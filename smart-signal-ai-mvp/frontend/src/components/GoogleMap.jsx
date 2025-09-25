import React, { useState, useEffect } from 'react'

const FallbackMap = ({ towers, onTowerClick, isSimulating, signalFlows }) => {
  const [selectedTower, setSelectedTower] = useState(null)

  const handleTowerClick = (tower) => {
    setSelectedTower(tower)
    onTowerClick && onTowerClick(tower)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal': return 'bg-green-500'
      case 'congested': return 'bg-yellow-500'
      case 'overloaded': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'normal': return 'عادي'
      case 'congested': return 'مزدحم'
      case 'overloaded': return 'محمل زائد'
      default: return 'غير معروف'
    }
  }

  // حساب النسبة المئوية للحمولة
  const getLoadPercentage = (tower) => {
    const currentLoad = tower.current_load || tower.currentLoad || 0
    const capacity = tower.capacity || 200
    return Math.round((currentLoad / capacity) * 100)
  }

  return (
    <div className="w-full h-full bg-gradient-to-b from-blue-100 to-green-100 rounded-lg relative overflow-hidden">
      {/* خريطة الأردن المبسطة */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50">
        {/* عمان */}
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="text-lg font-bold text-gray-700 mb-2">🏙️ عمان</div>
        </div>
        
        {/* الزرقاء */}
        <div className="absolute top-1/4 left-3/5">
          <div className="text-md font-semibold text-gray-600">🏘️ الزرقاء</div>
        </div>
        
        {/* إربد */}
        <div className="absolute top-1/5 left-1/3">
          <div className="text-md font-semibold text-gray-600">🏘️ إربد</div>
        </div>
        
        {/* العقبة */}
        <div className="absolute bottom-1/4 right-1/3">
          <div className="text-md font-semibold text-gray-600">🏖️ العقبة</div>
        </div>
        
        {/* الكرك */}
        <div className="absolute bottom-1/2 left-1/4">
          <div className="text-sm font-medium text-gray-600">🏛️ الكرك</div>
        </div>
        
        {/* معان */}
        <div className="absolute bottom-1/3 left-1/2">
          <div className="text-sm font-medium text-gray-600">🏜️ معان</div>
        </div>
      </div>

      {/* أبراج الاتصالات */}
      <div className="absolute inset-0">
        {towers.map((tower, index) => {
          const loadPercentage = getLoadPercentage(tower)
          const x = 20 + (index % 5) * 15 + Math.random() * 10
          const y = 20 + Math.floor(index / 5) * 18 + Math.random() * 8
          
          return (
            <div
              key={tower.id}
              className={`absolute cursor-pointer transform hover:scale-125 transition-all duration-300 ${
                isSimulating ? 'animate-pulse' : ''
              }`}
              style={{ 
                left: `${x}%`, 
                top: `${y}%`,
                zIndex: selectedTower?.id === tower.id ? 50 : 10
              }}
              onClick={() => handleTowerClick(tower)}
            >
              {/* برج الاتصالات */}
              <div className="relative">
                {/* قاعدة البرج */}
                <div className={`w-6 h-6 rounded-full ${getStatusColor(tower.status)} border-3 border-white shadow-lg relative overflow-hidden`}>
                  {/* مؤشر الحمولة */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-white opacity-30 transition-all duration-500"
                    style={{ height: `${100 - loadPercentage}%` }}
                  ></div>
                  {/* رقم البرج */}
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                    {index + 1}
                  </div>
                </div>
                
                {/* هوائي البرج */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full">
                  <div className="w-1 h-8 bg-gray-700"></div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full">
                    <div className="w-4 h-1 bg-gray-700"></div>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-2 h-1 bg-red-500 rounded"></div>
                  </div>
                </div>
                
                {/* تأثير الإشارة */}
                {isSimulating && (
                  <div className="absolute inset-0 animate-ping">
                    <div className={`w-6 h-6 rounded-full ${getStatusColor(tower.status)} opacity-20`}></div>
                  </div>
                )}
                
                {/* معلومات البرج */}
                <div className={`absolute top-8 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-lg shadow-xl border text-sm min-w-max z-50 ${
                  selectedTower?.id === tower.id ? 'block' : 'hidden group-hover:block'
                }`}>
                  <div className="font-bold text-blue-600">{tower.name}</div>
                  <div className="text-gray-600 text-xs">{tower.city}</div>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between items-center">
                      <span>الحمل:</span>
                      <div className="flex items-center gap-1">
                        <div className="w-16 h-2 bg-gray-200 rounded">
                          <div 
                            className={`h-full rounded ${
                              loadPercentage > 80 ? 'bg-red-500' : 
                              loadPercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(loadPercentage, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-semibold">{loadPercentage}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span>السعة:</span>
                      <span className="font-semibold">{tower.capacity || 200}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الحالة:</span>
                      <span className="font-semibold">{getStatusText(tower.status)}</span>
                    </div>
                    {tower.operator && (
                      <div className="flex justify-between">
                        <span>المشغل:</span>
                        <span className="text-xs">{tower.operator}</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <div className="w-4 h-4 bg-white border border-gray-200 rotate-45"></div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* خطوط الإشارة بين الأبراج */}
      {signalFlows && signalFlows.length > 0 && (
        <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
          {signalFlows.map((flow, index) => {
            const strength = flow.strength || 50
            const strokeColor = strength > 80 ? '#10B981' : strength > 60 ? '#F59E0B' : strength > 40 ? '#F97316' : '#EF4444'
            
            return (
              <g key={index}>
                <line
                  x1={`${20 + (flow.fromIndex % 5) * 15}%`}
                  y1={`${20 + Math.floor(flow.fromIndex / 5) * 18}%`}
                  x2={`${20 + (flow.toIndex % 5) * 15}%`}
                  y2={`${20 + Math.floor(flow.toIndex / 5) * 18}%`}
                  stroke={strokeColor}
                  strokeWidth={Math.max(2, strength / 20)}
                  strokeOpacity={0.6}
                  strokeDasharray={isSimulating ? "5,5" : "0"}
                  className={isSimulating ? "animate-pulse" : ""}
                />
              </g>
            )
          })}
        </svg>
      )}

      {/* مفتاح الخريطة */}
      <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-xl border">
        <div className="text-sm font-bold mb-3 flex items-center gap-2">
          📡 <span>مفتاح الخريطة</span>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 border border-white"></div>
            <span>عادي (&lt;60%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500 border border-white"></div>
            <span>مزدحم (60-80%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500 border border-white"></div>
            <span>محمل زائد (&gt;80%)</span>
          </div>
        </div>
      </div>

      {/* معلومات الحالة العامة */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-sm shadow-lg">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-green-400 animate-pulse' : 'bg-blue-200'}`}></div>
          <span>🗺️ خريطة تفاعلية - {towers.length} برج</span>
          {isSimulating && <span className="animate-pulse">⚡ جاري المحاكاة</span>}
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg border text-xs">
        <div className="font-bold mb-2">📊 الإحصائيات</div>
        <div className="space-y-1">
          <div className="flex justify-between gap-3">
            <span>🟢 عادي:</span>
            <span className="font-semibold">{towers.filter(t => t.status === 'normal').length}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span>🟡 مزدحم:</span>
            <span className="font-semibold">{towers.filter(t => t.status === 'congested').length}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span>🔴 محمل:</span>
            <span className="font-semibold">{towers.filter(t => t.status === 'overloaded').length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const GoogleMap = ({ towers, onTowerClick, isSimulating, signalFlows }) => {
  // استخدام الخريطة البديلة مباشرة لتجنب مشاكل Google Maps API
  return <FallbackMap towers={towers} onTowerClick={onTowerClick} isSimulating={isSimulating} signalFlows={signalFlows} />
}

export default GoogleMap

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
      </div>

      {/* أبراج الاتصالات */}
      <div className="absolute inset-0">
        {towers.map((tower, index) => {
          const loadPercentage = Math.round((tower.current_load || tower.currentLoad || 0) / (tower.capacity || 200) * 100)
          const x = 20 + (index % 4) * 20 + Math.random() * 15
          const y = 20 + Math.floor(index / 4) * 25 + Math.random() * 10
          
          return (
            <div
              key={tower.id}
              className={`absolute cursor-pointer transform hover:scale-110 transition-transform duration-200 ${
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
                <div className={`w-4 h-4 rounded-full ${getStatusColor(tower.status)} border-2 border-white shadow-lg`}></div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full">
                  <div className="w-0.5 h-6 bg-gray-600"></div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full">
                    <div className="w-3 h-1 bg-gray-600"></div>
                  </div>
                </div>
                
                {/* معلومات البرج */}
                <div className={`absolute top-6 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg border text-xs min-w-max ${
                  selectedTower?.id === tower.id ? 'block' : 'hidden hover:block'
                }`}>
                  <div className="font-bold">{tower.name}</div>
                  <div className="text-gray-600">{tower.city}</div>
                  <div className="mt-1">
                    <div>الحمل: {loadPercentage}%</div>
                    <div>الحالة: <span className={`font-semibold text-${getStatusColor(tower.status).replace('bg-', '')}`}>
                      {getStatusText(tower.status)}
                    </span></div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* خطوط الإشارة */}
      {signalFlows && signalFlows.length > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          {signalFlows.map((flow, index) => (
            <div
              key={index}
              className={`absolute border-dashed border-2 ${
                flow.strength > 80 ? 'border-green-400' :
                flow.strength > 60 ? 'border-yellow-400' :
                flow.strength > 40 ? 'border-orange-400' : 'border-red-400'
              } ${isSimulating ? 'animate-ping' : ''}`}
              style={{
                left: '20%',
                top: '30%',
                width: '40%',
                height: '2px',
                transform: `rotate(${index * 30}deg)`,
                transformOrigin: 'left center'
              }}
            />
          ))}
        </div>
      )}

      {/* مفتاح الخريطة */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded shadow-lg">
        <div className="text-sm font-bold mb-2">🗺️ خريطة الأبراج</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>عادي (&lt;60%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>مزدحم (60-80%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>محمل زائد (&gt;80%)</span>
          </div>
        </div>
      </div>

      {/* رسالة الحالة */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm">
        📡 خريطة تفاعلية - {towers.length} برج
      </div>
    </div>
  )
}

const GoogleMap = ({ towers, onTowerClick, isSimulating, signalFlows }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // محاولة تحميل Google Maps
    const script = document.createElement('script')
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    
    if (!apiKey || apiKey === 'YOUR_API_KEY') {
      setHasError(true)
      return
    }

    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`
    script.async = true
    script.defer = true
    
    script.onload = () => setIsLoaded(true)
    script.onerror = () => setHasError(true)
    
    document.head.appendChild(script)

    return () => {
      try {
        document.head.removeChild(script)
      } catch (e) {
        // تجاهل الخطأ
      }
    }
  }, [])

  // استخدام الخريطة البديلة في حالة الخطأ أو عدم توفر API key
  if (hasError || !import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
    return <FallbackMap towers={towers} onTowerClick={onTowerClick} isSimulating={isSimulating} signalFlows={signalFlows} />
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">جاري تحميل الخريطة...</p>
        </div>
      </div>
    )
  }

  // إذا تم تحميل Google Maps بنجاح، استخدم الكود الأصلي
  // ... باقي الكود الأصلي هنا
  return <FallbackMap towers={towers} onTowerClick={onTowerClick} isSimulating={isSimulating} signalFlows={signalFlows} />
}

export default GoogleMap
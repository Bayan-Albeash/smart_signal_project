import React, { useState, useCallback } from 'react'
import { GoogleMap, LoadScript, Marker, InfoWindow, Circle } from '@react-google-maps/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Antenna, Users, Zap, AlertTriangle } from 'lucide-react'

const mapContainerStyle = {
  width: '100%',
  height: '600px'
}

// مركز الأردن - عمان
const center = {
  lat: 31.9454,
  lng: 35.9284
}

// مواقع أبراج الاتصالات الحقيقية في الأردن
const jordanTowers = [
  {
    id: 1,
    name: 'برج عمان المركزي',
    position: { lat: 31.9454, lng: 35.9284 },
    city: 'عمان',
    operator: 'زين الأردن',
    capacity: 150,
    currentLoad: 120,
    status: 'normal',
    coverage: 5000, // meters
    users: [
      { type: 'call', count: 45 },
      { type: 'data', count: 60 },
      { type: 'video', count: 15 }
    ]
  },
  {
    id: 2,
    name: 'برج الزرقاء الشمالي',
    position: { lat: 32.0728, lng: 36.0879 },
    city: 'الزرقاء',
    operator: 'أورانج الأردن',
    capacity: 100,
    currentLoad: 85,
    status: 'normal',
    coverage: 4000,
    users: [
      { type: 'call', count: 30 },
      { type: 'data', count: 40 },
      { type: 'video', count: 15 }
    ]
  },
  {
    id: 3,
    name: 'برج إربد الجامعي',
    position: { lat: 32.5556, lng: 35.8500 },
    city: 'إربد',
    operator: 'أمنية',
    capacity: 120,
    currentLoad: 95,
    status: 'normal',
    coverage: 4500,
    users: [
      { type: 'call', count: 35 },
      { type: 'data', count: 45 },
      { type: 'video', count: 15 }
    ]
  },
  {
    id: 4,
    name: 'برج عمان الغربي',
    position: { lat: 31.9500, lng: 35.9000 },
    city: 'عمان',
    operator: 'زين الأردن',
    capacity: 80,
    currentLoad: 95,
    status: 'congested',
    coverage: 3500,
    users: [
      { type: 'call', count: 40 },
      { type: 'data', count: 35 },
      { type: 'video', count: 20 }
    ]
  },
  {
    id: 5,
    name: 'برج العقبة السياحي',
    position: { lat: 29.5320, lng: 35.0063 },
    city: 'العقبة',
    operator: 'أورانج الأردن',
    capacity: 90,
    currentLoad: 110,
    status: 'overloaded',
    coverage: 4000,
    users: [
      { type: 'call', count: 50 },
      { type: 'data', count: 40 },
      { type: 'video', count: 20 }
    ]
  },
  {
    id: 6,
    name: 'برج الكرك التاريخي',
    position: { lat: 31.1801, lng: 35.7048 },
    city: 'الكرك',
    operator: 'أمنية',
    capacity: 70,
    currentLoad: 45,
    status: 'normal',
    coverage: 3000,
    users: [
      { type: 'call', count: 20 },
      { type: 'data', count: 20 },
      { type: 'video', count: 5 }
    ]
  }
]

const InteractiveMap = () => {
  const [selectedTower, setSelectedTower] = useState(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [towers, setTowers] = useState(jordanTowers)

  const getTowerColor = (status) => {
    switch (status) {
      case 'normal': return '#22c55e'
      case 'congested': return '#f59e0b'
      case 'overloaded': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getTowerIcon = (status) => {
    const color = getTowerColor(status)
    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
          <circle cx="15" cy="15" r="12" fill="${color}" stroke="white" stroke-width="2"/>
          <path d="M15 8 L15 22 M10 12 L20 12 M11 16 L19 16" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `)}`,
      scaledSize: new window.google.maps.Size(30, 30)
    }
  }

  const simulateAIRedistribution = useCallback(() => {
    setIsSimulating(true)
    
    setTimeout(() => {
      const updatedTowers = towers.map(tower => {
        if (tower.status === 'overloaded') {
          // تقليل الحمل على الأبراج المحملة زائد
          const newLoad = Math.max(tower.capacity * 0.8, tower.currentLoad - 30)
          return {
            ...tower,
            currentLoad: Math.round(newLoad),
            status: newLoad > tower.capacity ? 'congested' : 'normal'
          }
        } else if (tower.status === 'normal' && tower.currentLoad < tower.capacity * 0.7) {
          // إضافة بعض المستخدمين للأبراج الأقل تحميلاً
          const newLoad = Math.min(tower.capacity * 0.9, tower.currentLoad + 15)
          return {
            ...tower,
            currentLoad: Math.round(newLoad),
            status: newLoad > tower.capacity * 0.8 ? 'congested' : 'normal'
          }
        }
        return tower
      })
      
      setTowers(updatedTowers)
      setIsSimulating(false)
    }, 3000)
  }, [towers])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Antenna className="h-5 w-5" />
            خريطة الأبراج التفاعلية - الأردن
          </CardTitle>
          <CardDescription>
            اضغط على أي برج لعرض التفاصيل ومشاهدة كيفية عمل الـ AI Agent
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button 
              onClick={simulateAIRedistribution}
              disabled={isSimulating}
              className="w-full"
            >
              {isSimulating ? 'جاري تشغيل AI Agent...' : 'تشغيل AI Agent لإعادة التوزيع'}
            </Button>
          </div>

          <LoadScript googleMapsApiKey="AIzaSyBFw0Qbyq9zTFTd-tUY6dpoWMgUBSRWV_M">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={7}
              options={{
                styles: [
                  {
                    featureType: 'all',
                    elementType: 'geometry.fill',
                    stylers: [{ color: '#f5f5f5' }]
                  },
                  {
                    featureType: 'water',
                    elementType: 'geometry',
                    stylers: [{ color: '#e9e9e9' }]
                  }
                ]
              }}
            >
              {towers.map((tower) => (
                <React.Fragment key={tower.id}>
                  <Marker
                    position={tower.position}
                    icon={getTowerIcon(tower.status)}
                    onClick={() => setSelectedTower(tower)}
                  />
                  
                  {/* دائرة التغطية */}
                  <Circle
                    center={tower.position}
                    radius={tower.coverage}
                    options={{
                      fillColor: getTowerColor(tower.status),
                      fillOpacity: 0.1,
                      strokeColor: getTowerColor(tower.status),
                      strokeOpacity: 0.3,
                      strokeWeight: 1
                    }}
                  />
                </React.Fragment>
              ))}

              {selectedTower && (
                <InfoWindow
                  position={selectedTower.position}
                  onCloseClick={() => setSelectedTower(null)}
                >
                  <div className="p-4 max-w-sm" dir="rtl">
                    <h3 className="font-bold text-lg mb-2">{selectedTower.name}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>المدينة:</span>
                        <span>{selectedTower.city}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>المشغل:</span>
                        <span>{selectedTower.operator}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>الحالة:</span>
                        <Badge variant={
                          selectedTower.status === 'normal' ? 'success' :
                          selectedTower.status === 'congested' ? 'warning' : 'destructive'
                        }>
                          {selectedTower.status === 'normal' ? 'طبيعي' :
                           selectedTower.status === 'congested' ? 'مزدحم' : 'محمل زائد'}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>الحمل الحالي</span>
                          <span>{selectedTower.currentLoad}/{selectedTower.capacity}</span>
                        </div>
                        <Progress 
                          value={(selectedTower.currentLoad / selectedTower.capacity) * 100} 
                          className="w-full"
                        />
                      </div>
                      <div className="mt-3">
                        <h4 className="font-semibold mb-2">توزيع المستخدمين:</h4>
                        {selectedTower.users.map((userType, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>
                              {userType.type === 'call' ? 'مكالمات' :
                               userType.type === 'data' ? 'بيانات' : 'فيديو'}:
                            </span>
                            <span>{userType.count}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        نطاق التغطية: {selectedTower.coverage / 1000} كم
                      </div>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-sm">طبيعي</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span className="text-sm">مزدحم</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-sm">محمل زائد</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default InteractiveMap


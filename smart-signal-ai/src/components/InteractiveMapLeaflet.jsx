import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Antenna, Users, Zap, AlertTriangle } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

import jordanTowers from '../data/jordanTowersData.js'

const InteractiveMapLeaflet = () => {
  const [isSimulating, setIsSimulating] = useState(false)
  const [towers, setTowers] = useState(jordanTowers)
  const [selectedTower, setSelectedTower] = useState(null)

  const getTowerColor = (status) => {
    switch (status) {
      case 'normal': return '#22c55e'
      case 'congested': return '#f59e0b'
      case 'overloaded': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const createCustomIcon = (status) => {
    const color = getTowerColor(status)
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
      ">📡</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    })
  }

  const simulateAIRedistribution = () => {
    setIsSimulating(true)
    
    setTimeout(() => {
      const updatedTowers = towers.map(tower => {
        // Simulate AI redistribution logic
        let newLoad = tower.currentLoad;
        let newStatus = tower.status;

        if (tower.currentLoad > tower.capacity) {
          // If overloaded, try to offload users
          const overloadAmount = tower.currentLoad - tower.capacity;
          const offload = Math.min(overloadAmount, Math.floor(Math.random() * 20) + 10); // Offload 10-30 users
          newLoad = tower.currentLoad - offload;
        } else if (tower.currentLoad < tower.capacity * 0.7) {
          // If underloaded, simulate receiving some users
          const availableCapacity = tower.capacity - tower.currentLoad;
          const gain = Math.min(availableCapacity, Math.floor(Math.random() * 10) + 5); // Gain 5-15 users
          newLoad = tower.currentLoad + gain;
        }

        // Ensure load doesn't go below zero
        newLoad = Math.max(0, newLoad);

        // Update status based on new load
        const percentage = (newLoad / tower.capacity) * 100;
        if (percentage > 100) newStatus = 'overloaded';
        else if (percentage > 80) newStatus = 'congested';
        else newStatus = 'normal';

        return {
          ...tower,
          currentLoad: Math.round(newLoad),
          status: newStatus
        };
      });
      
      setTowers(updatedTowers);
      setIsSimulating(false);
    }, 3000);
  };

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

          <div style={{ height: '600px', width: '100%' }}>
            <MapContainer
              center={[31.9454, 35.9284]}
              zoom={7}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {towers.map((tower) => (
                <React.Fragment key={tower.id}>
                  <Marker
                    position={tower.position}
                    icon={createCustomIcon(tower.status)}
                  >
                    <Popup>
                      <div className="p-4 max-w-sm" dir="rtl">
                        <h3 className="font-bold text-lg mb-2">{tower.name}</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>المدينة:</span>
                            <span>{tower.city}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>المشغل:</span>
                            <span>{tower.operator}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>الحالة:</span>
                            <Badge variant={
                              tower.status === 'normal' ? 'success' :
                              tower.status === 'congested' ? 'warning' : 'destructive'
                            }>
                              {tower.status === 'normal' ? 'طبيعي' :
                               tower.status === 'congested' ? 'مزدحم' : 'محمل زائد'}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>الحمل الحالي</span>
                              <span>{tower.currentLoad}/{tower.capacity}</span>
                            </div>
                            <Progress 
                              value={(tower.currentLoad / tower.capacity) * 100} 
                              className="w-full"
                            />
                          </div>
                          <div className="mt-3">
                            <h4 className="font-semibold mb-2">توزيع المستخدمين:</h4>
                            {tower.users.map((userType, index) => (
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
                            نطاق التغطية: {tower.coverage / 1000} كم
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                  
                  {/* دائرة التغطية */}
                  <Circle
                    center={tower.position}
                    radius={tower.coverage}
                    pathOptions={{
                      fillColor: getTowerColor(tower.status),
                      fillOpacity: 0.1,
                      color: getTowerColor(tower.status),
                      opacity: 0.3,
                      weight: 1
                    }}
                  />
                </React.Fragment>
              ))}
            </MapContainer>
          </div>

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

export default InteractiveMapLeaflet


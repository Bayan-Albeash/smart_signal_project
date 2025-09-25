import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import GoogleMap from '../components/GoogleMap'
import ScenarioReplay from '../components/ScenarioReplay'
import GeminiChat from '../components/GeminiChat'
import useWebSocket from '../hooks/useWebSocket'
import AnimatedCounter from '../components/AnimatedCounter'
import AnimatedProgressBar from '../components/AnimatedProgressBar'
import DynamicCounter from '../components/DynamicCounter'
import { useDynamicData } from '../components/DynamicDataProvider'
import { Wifi, Users, Zap, AlertTriangle, WifiOff } from 'lucide-react'

const MapPage = () => {
  const { data: dynamicData } = useDynamicData()
  const [isSimulating, setIsSimulating] = useState(false)
  const [towers, setTowers] = useState([])
  const [selectedTower, setSelectedTower] = useState(null)
  const [signalFlows, setSignalFlows] = useState([])
  const [isReplaying, setIsReplaying] = useState(false)
  const [realTimeData, setRealTimeData] = useState(null)
  
  // WebSocket connection for real-time updates
  const { isConnected, lastMessage, sendMessage } = useWebSocket('ws://localhost:5000/ws')
  
  const [scenarios] = useState([
    {
      id: 'rush_hour',
      name: 'ساعة الذروة',
      description: 'محاكاة الحمل العالي في ساعات الذروة',
      duration: 30,
      expectedLoad: 'high',
      timeline: [
        { time: 0, title: 'بداية المحاكاة', description: 'تشغيل النظام وتحديد الأحمال الأولية' },
        { time: 5, title: 'تحليل الأحمال', description: 'XGBoost يحلل الحمل المتوقع' },
        { time: 10, title: 'إعادة التوزيع', description: 'نقل المستخدمين من الأبراج المحملة' },
        { time: 20, title: 'تحسين الأداء', description: 'تطبيق خوارزمية التحسين الذكي' },
        { time: 30, title: 'انتهاء المحاكاة', description: 'عرض النتائج والتحسينات' }
      ]
    },
    {
      id: 'night_mode',
      name: 'الليل',
      description: 'محاكاة الحمل المنخفض في الليل',
      duration: 20,
      expectedLoad: 'low',
      timeline: [
        { time: 0, title: 'بداية الليل', description: 'انخفاض عدد المستخدمين' },
        { time: 8, title: 'تحسين الطاقة', description: 'توفير الطاقة في الأبراج' },
        { time: 15, title: 'مراقبة الأداء', description: 'مراقبة مستمرة للأداء' },
        { time: 20, title: 'انتهاء المحاكاة', description: 'عرض تقرير الأداء الليلي' }
      ]
    },
    {
      id: 'event_coverage',
      name: 'تغطية حدث',
      description: 'محاكاة حدث كبير يتطلب تغطية إضافية',
      duration: 45,
      expectedLoad: 'extreme',
      timeline: [
        { time: 0, title: 'بداية الحدث', description: 'زيادة مفاجئة في عدد المستخدمين' },
        { time: 10, title: 'تحديد المشاكل', description: 'تشخيص الأبراج المحملة زائد' },
        { time: 20, title: 'إعادة التوزيع السريع', description: 'نقل فوري للمستخدمين' },
        { time: 30, title: 'تحسين التغطية', description: 'زيادة قوة الإشارة' },
        { time: 40, title: 'استقرار النظام', description: 'تحقيق التوازن المطلوب' },
        { time: 45, title: 'انتهاء الحدث', description: 'عرض تقرير شامل' }
      ]
    }
  ])

  useEffect(() => {
    // Use dynamic data from context
    if (dynamicData && dynamicData.towers) {
      const dynamicTowers = dynamicData.towers.map(tower => ({
        id: tower.id,
        name: tower.name,
        position: [tower.lat, tower.lng],
        currentLoad: tower.users,
        capacity: 200,
        status: tower.efficiency > 90 ? 'normal' : tower.efficiency > 80 ? 'congested' : 'overloaded',
        city: tower.name.split(' - ')[0] || 'عمان',
        operator: 'زين الأردن'
      }))
      setTowers(dynamicTowers)
    } else {
      // Fallback to mock data
      setTowers([
        { id: 1, name: 'برج عمان - وسط البلد', position: [31.9565, 35.9239], currentLoad: 180, capacity: 200, status: 'congested', city: 'عمان', operator: 'زين الأردن' },
        { id: 2, name: 'برج الزرقاء - الجديدة', position: [32.0833, 36.0933], currentLoad: 110, capacity: 150, status: 'normal', city: 'الزرقاء', operator: 'أورانج الأردن' },
        { id: 3, name: 'برج إربد - جامعة اليرموك', position: [32.5486, 35.8519], currentLoad: 170, capacity: 180, status: 'congested', city: 'إربد', operator: 'أمنية' },
        { id: 4, name: 'برج العقبة - الميناء', position: [29.5320, 35.0063], currentLoad: 85, capacity: 120, status: 'normal', city: 'العقبة', operator: 'زين الأردن' },
        { id: 5, name: 'برج الكرك - القلعة', position: [31.1854, 35.7017], currentLoad: 95, capacity: 100, status: 'congested', city: 'الكرك', operator: 'أورانج الأردن' }
      ])
    }
  }, [dynamicData])

  // Handle real-time updates from WebSocket
  useEffect(() => {
    if (lastMessage) {
      setRealTimeData(lastMessage)
      
      // Update towers with real-time data
      if (lastMessage.type === 'tower_update' && lastMessage.data) {
        setTowers(prevTowers => 
          prevTowers.map(tower => {
            const updatedTower = lastMessage.data.find(t => t.id === tower.id)
            return updatedTower ? { ...tower, ...updatedTower } : tower
          })
        )
      }
      
      // Update signal flows
      if (lastMessage.type === 'signal_flow_update' && lastMessage.flows) {
        setSignalFlows(lastMessage.flows)
      }
    }
  }, [lastMessage])

  const runSimulation = async () => {
    setIsSimulating(true)
    
    try {
      const response = await fetch('/api/simulation/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          num_towers: towers.length,
          num_users: 150,
          duration_minutes: 10
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Update towers with new data
        setTowers(data.final_state.towers)
        
        // Generate signal flows between towers
        const flows = []
        for (let i = 0; i < towers.length - 1; i++) {
          flows.push({
            from: { lat: towers[i].position[0], lng: towers[i].position[1] },
            to: { lat: towers[i + 1].position[0], lng: towers[i + 1].position[1] }
          })
        }
        setSignalFlows(flows)
      }
    } catch (error) {
      console.error('Simulation failed:', error)
    }
    
    setTimeout(() => {
      setIsSimulating(false)
    }, 3000)
  }

  const handleTowerClick = (tower) => {
    setSelectedTower(tower)
  }

  const handleScenarioChange = (scenario) => {
    // Implement scenario-specific tower updates
    console.log('Scenario changed:', scenario)
  }

  const handlePlayPause = (playing) => {
    setIsReplaying(playing)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal': return 'bg-green-500'
      case 'congested': return 'bg-yellow-500'
      case 'overloaded': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-16 sm:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">الخريطة والمحاكاة</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">مراقبة الأبراج ومحاكاة إعادة التوزيع الذكي</p>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            {isConnected ? (
              <>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">متصل</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-500">غير متصل</span>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Interactive Map */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
              <span className="mr-2">🗺️</span>
              خريطة الأبراج التفاعلية
            </h2>
            <div className="h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden">
              <GoogleMap
                towers={towers}
                onTowerClick={handleTowerClick}
                isSimulating={isSimulating}
                signalFlows={signalFlows}
              />
            </div>
          </div>

          {/* Control Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">لوحة التحكم</h2>
            
            <button
              onClick={runSimulation}
              disabled={isSimulating}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                isSimulating
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isSimulating ? 'جاري تشغيل المحاكاة...' : 'تشغيل المحاكاة'}
            </button>

            {isSimulating && (
              <div className="mt-4">
                <div className="bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '66%'}}></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">جاري تحليل الأحمال وإعادة التوزيع...</p>
              </div>
            )}

            <div className="mt-6">
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">حالة الأبراج</h3>
              {towers.map((tower, index) => (
                <motion.div 
                  key={tower.id} 
                  className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{tower.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                         <AnimatedCounter 
                           value={tower.currentLoad || 0} 
                           duration={2} 
                           delay={index * 0.1 + 0.5} 
                           ease="easeOut"
                           startValue={0}
                         />/<AnimatedCounter 
                           value={tower.capacity || 200} 
                           duration={2} 
                           delay={index * 0.1 + 0.7} 
                           ease="easeOut"
                           startValue={0}
                         />
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full ${getStatusColor(tower.status)}`}></div>
                  </div>
                  <AnimatedProgressBar
                    value={tower.currentLoad || 0}
                    max={tower.capacity || 200}
                    color={tower.status === 'overloaded' ? 'bg-red-500' : 
                           tower.status === 'congested' ? 'bg-yellow-500' : 'bg-green-500'}
                    height="h-2"
                    showPercentage={true}
                    duration={1.5}
                    delay={index * 0.1 + 0.3}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Scenario Replay Section */}
        <div className="mt-8">
          <ScenarioReplay
            scenarios={scenarios}
            onScenarioChange={handleScenarioChange}
            isPlaying={isReplaying}
            onPlayPause={handlePlayPause}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6 sm:mt-8">
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">إجمالي المستخدمين</p>
                       <p className="text-2xl font-bold text-gray-900 dark:text-white">
                         <DynamicCounter 
                           value={towers.reduce((sum, tower) => sum + (tower.currentLoad || 0), 0)} 
                           duration={2} 
                           delay={0.1} 
                           ease="easeOut"
                           showTrend={true}
                           trend="up"
                         />
                       </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">الأبراج النشطة</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  <AnimatedCounter 
                    value={towers.length} 
                    duration={1.5} 
                    delay={0.2} 
                  />
                </p>
              </div>
              <Wifi className="w-8 h-8 text-green-600" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">كفاءة النظام</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  <AnimatedCounter 
                    value={Math.round((1 - towers.filter(t => t.status === 'overloaded').length / towers.length) * 100)} 
                    duration={2} 
                    delay={0.3} 
                    suffix="%" 
                  />
                </p>
              </div>
              <Zap className="w-8 h-8 text-yellow-600" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">الأبراج المحملة</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  <AnimatedCounter 
                    value={towers.filter(t => t.status === 'overloaded').length} 
                    duration={1.5} 
                    delay={0.4} 
                  />
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </motion.div>
        </div>

        {/* Selected Tower Details */}
        {selectedTower && (
          <motion.div
            className="mt-8 bg-white rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">تفاصيل البرج المحدد</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">معلومات أساسية</h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <div><span className="font-medium">الاسم:</span> {selectedTower.name}</div>
                  <div><span className="font-medium">المدينة:</span> {selectedTower.city}</div>
                  <div><span className="font-medium">المشغل:</span> {selectedTower.operator}</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">الأداء</h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <div><span className="font-medium">الحمل الحالي:</span> {selectedTower.currentLoad || 0}</div>
                  <div><span className="font-medium">السعة:</span> {selectedTower.capacity || 200}</div>
                  <div><span className="font-medium">النسبة:</span> {Math.round((selectedTower.currentLoad || 0) / (selectedTower.capacity || 200) * 100)}%</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">الحالة</h4>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  selectedTower.status === 'normal' ? 'bg-green-100 text-green-800' :
                  selectedTower.status === 'congested' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedTower.status === 'normal' ? 'عادي' :
                   selectedTower.status === 'congested' ? 'مزدحم' : 'محمل زائد'}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Gemini Chat */}
        <GeminiChat />
      </div>
    </div>
  )
}

export default MapPage

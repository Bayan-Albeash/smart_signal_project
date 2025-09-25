import React, { createContext, useContext, useState, useEffect } from 'react'

const DynamicDataContext = createContext()

export const useDynamicData = () => {
  const context = useContext(DynamicDataContext)
  if (!context) {
    throw new Error('useDynamicData must be used within a DynamicDataProvider')
  }
  return context
}

export const DynamicDataProvider = ({ children }) => {
  // دالة لإنشاء بيانات أداء تفصيلية
  const generatePerformanceData = () => {
    const data = []
    for (let i = 0; i < 24; i++) {
      const hour = i
      let efficiency, latency, throughput
      
      if (hour >= 6 && hour <= 9) {
        // Morning rush hour
        efficiency = 88 + Math.random() * 5
        latency = 45 + Math.random() * 15
        throughput = 180 + Math.random() * 20
      } else if (hour >= 17 && hour <= 20) {
        // Evening rush hour
        efficiency = 85 + Math.random() * 8
        latency = 50 + Math.random() * 20
        throughput = 170 + Math.random() * 30
      } else if (hour >= 22 || hour <= 5) {
        // Night time - low usage
        efficiency = 92 + Math.random() * 6
        latency = 30 + Math.random() * 10
        throughput = 120 + Math.random() * 20
      } else {
        // Normal hours
        efficiency = 90 + Math.random() * 7
        latency = 40 + Math.random() * 15
        throughput = 150 + Math.random() * 25
      }
      
      data.push({
        time: `${i.toString().padStart(2, '0')}:00`,
        efficiency: Math.round(efficiency * 10) / 10,
        latency: Math.round(latency * 10) / 10,
        throughput: Math.round(throughput * 10) / 10
      })
    }
    return data
  }

  const [data, setData] = useState({
    // إحصائيات النظام
    systemStats: {
      activeTowers: 5,
      activeUsers: 150,
      networkEfficiency: 91,
      performanceImprovement: 26
    },
    
    // بيانات الأبراج
    towers: [
      { id: 1, name: 'برج عمان', lat: 31.9539, lng: 35.9106, users: 45, efficiency: 94, signal: 85 },
      { id: 2, name: 'برج الزرقاء', lat: 32.0728, lng: 36.0876, users: 38, efficiency: 89, signal: 78 },
      { id: 3, name: 'برج إربد', lat: 32.5556, lng: 35.8500, users: 52, efficiency: 92, signal: 88 },
      { id: 4, name: 'برج العقبة', lat: 29.5320, lng: 35.0063, users: 28, efficiency: 87, signal: 82 },
      { id: 5, name: 'برج الكرك', lat: 31.1851, lng: 35.7019, users: 33, efficiency: 90, signal: 85 }
    ],
    
    // بيانات الأداء
    performanceData: generatePerformanceData(),
    
    // بيانات الحرارة
    heatmapData: [
      { name: 'عمان', towers: 3, efficiency: 94, users: 180, load: 85 },
      { name: 'الزرقاء', towers: 2, efficiency: 89, users: 120, load: 72 },
      { name: 'إربد', towers: 2, efficiency: 92, users: 150, load: 68 },
      { name: 'الطفيلة', towers: 1, efficiency: 85, users: 80, load: 45 },
      { name: 'العقبة', towers: 1, efficiency: 87, users: 60, load: 38 }
    ],
    
    // KPIs
    kpis: [
      { name: 'إجمالي الأبراج', value: 5, change: '+2.5%', trend: 'up' },
      { name: 'المستخدمين النشطين', value: 150, change: '+12.3%', trend: 'up' },
      { name: 'كفاءة الشبكة', value: 91, change: '+5.7%', trend: 'up' },
      { name: 'وقت الاستجابة', value: 45, change: '-8.2%', trend: 'down' }
    ]
  })

  // دالة لتحديث البيانات بشكل عشوائي واقعي
  const updateData = () => {
    setData(prevData => {
      const now = new Date()
      const hour = now.getHours()
      
      // تحديد نمط النشاط حسب الوقت
      let activityMultiplier = 1
      if (hour >= 7 && hour <= 9) activityMultiplier = 1.3 // ساعة الذروة الصباحية
      else if (hour >= 17 && hour <= 19) activityMultiplier = 1.4 // ساعة الذروة المسائية
      else if (hour >= 22 || hour <= 6) activityMultiplier = 0.6 // ساعات الليل
      
      return {
        ...prevData,
        systemStats: {
          activeTowers: Math.max(3, Math.min(8, prevData.systemStats.activeTowers + (Math.random() - 0.5) * 0.5)),
          activeUsers: Math.max(80, Math.min(300, Math.round(prevData.systemStats.activeUsers + (Math.random() - 0.5) * 20 * activityMultiplier))),
          networkEfficiency: Math.max(75, Math.min(98, prevData.systemStats.networkEfficiency + (Math.random() - 0.5) * 3)),
          performanceImprovement: Math.max(15, Math.min(35, prevData.systemStats.performanceImprovement + (Math.random() - 0.5) * 2))
        },
        towers: prevData.towers.map(tower => ({
          ...tower,
          users: Math.max(10, Math.min(80, Math.round(tower.users + (Math.random() - 0.5) * 15 * activityMultiplier))),
          efficiency: Math.max(70, Math.min(98, tower.efficiency + (Math.random() - 0.5) * 4)),
          signal: Math.max(60, Math.min(95, tower.signal + (Math.random() - 0.5) * 6))
        })),
        performanceData: generatePerformanceData(),
        heatmapData: prevData.heatmapData.map(item => ({
          ...item,
          efficiency: Math.max(75, Math.min(98, item.efficiency + (Math.random() - 0.5) * 3)),
          users: Math.max(40, Math.min(200, Math.round(item.users + (Math.random() - 0.5) * 15 * activityMultiplier))),
          load: Math.max(20, Math.min(95, item.load + (Math.random() - 0.5) * 8 * activityMultiplier)),
          towers: Math.max(1, Math.min(5, item.towers + (Math.random() > 0.9 ? (Math.random() > 0.5 ? 1 : -1) : 0)))
        })),
        kpis: prevData.kpis.map(kpi => ({
          ...kpi,
          value: Math.max(0, kpi.value + (Math.random() - 0.5) * (kpi.name.includes('وقت') ? 2 : 5)),
          change: `${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 10).toFixed(1)}%`,
          trend: Math.random() > 0.5 ? 'up' : 'down'
        }))
      }
    })
  }

  // تحديث البيانات كل 3-8 ثوانٍ بشكل عشوائي
  useEffect(() => {
    const updateInterval = () => {
      const delay = Math.random() * 5000 + 3000 // 3-8 ثوانٍ
      setTimeout(() => {
        updateData()
        updateInterval()
      }, delay)
    }
    
    updateInterval()
  }, [])

  // تحديث البيانات عند تغيير الوقت (كل ساعة)
  useEffect(() => {
    const hourInterval = setInterval(updateData, 3600000) // كل ساعة
    return () => clearInterval(hourInterval)
  }, [])

  return (
    <DynamicDataContext.Provider value={{ data, updateData }}>
      {children}
    </DynamicDataContext.Provider>
  )
}

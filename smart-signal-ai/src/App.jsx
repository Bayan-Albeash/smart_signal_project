import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line
} from 'recharts'
import { Activity, Users, Zap, TrendingUp, AlertTriangle } from 'lucide-react'
import InteractiveMap from './components/InteractiveMapLeaflet.jsx'
import ReportsAnalytics from './components/ReportsAnalytics.jsx'
import smartSignalLogo from './assets/smartsignal-logo.png'
import DataWarningBanner from './components/DataWarningBanner.jsx'
import './App.css'

function App() {
    const [isSimulating, setIsSimulating] = useState(false)
    const [simulationData, setSimulationData] = useState(null)
    const [realTimeData, setRealTimeData] = useState([])
    const [userCount, setUserCount] = useState(135)
    const [activeTab, setActiveTab] = useState("simulation")

    const initialTowerData = [
        { id: 0, name: 'Tower 0', capacity: 25, load: 12, location: 'عمان الشرقية' },
        { id: 1, name: 'Tower 1', capacity: 25, load: 10, location: 'عمان الغربية' },
        { id: 2, name: 'Tower 2', capacity: 25, load: 116, location: 'وسط البلد' },
        { id: 3, name: 'Tower 3', capacity: 25, load: 5, location: 'الزرقاء' },
        { id: 4, name: 'Tower 4', capacity: 25, load: 7, location: 'إربد' }
    ]

    const redistributedTowerData = [
        { id: 0, name: 'Tower 0', capacity: 25, load: 25, location: 'عمان الشرقية' },
        { id: 1, name: 'Tower 1', capacity: 25, load: 25, location: 'عمان الغربية' },
        { id: 2, name: 'Tower 2', capacity: 25, load: 50, location: 'وسط البلد' },
        { id: 3, name: 'Tower 3', capacity: 25, load: 25, location: 'الزرقاء' },
        { id: 4, name: 'Tower 4', capacity: 25, load: 25, location: 'إربد' }
    ]

    const runSimulation = () => {
        setIsSimulating(true)
        setTimeout(() => {
            setSimulationData({
                initial: initialTowerData,
                redistributed: redistributedTowerData,
                usersRedistributed: 65,
                overloadReduction: '71%'
            })
            setIsSimulating(false)
        }, 3000)
    }

    useEffect(() => {
        const interval = setInterval(() => {
            const newDataPoint = {
                time: new Date().toLocaleTimeString('ar-SA'),
                totalUsers: Math.floor(Math.random() * 50) + 100,
                overloadedTowers: Math.floor(Math.random() * 3) + 1,
                efficiency: Math.floor(Math.random() * 20) + 80
            }
            setRealTimeData(prev => [...prev.slice(-9), newDataPoint])
        }, 2000)

        return () => clearInterval(interval)
    }, [])
    
       useEffect(() => {
  const interval = setInterval(() => {
    const randomCount = Math.floor(Math.random() * (150 - 120 + 1)) + 120
    setUserCount(randomCount)
  }, 2500)

 

        return () => clearInterval(interval)
    }, [activeTab])

    const getTowerStatus = (load, capacity) => {
        const percentage = (load / capacity) * 100
        if (percentage > 100) return { status: 'محمل زائد', color: 'destructive' }
        if (percentage > 80) return { status: 'مزدحم', color: 'warning' }
        return { status: 'طبيعي', color: 'success' }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6" dir="rtl">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
                        <img src={smartSignalLogo} alt="SmartSignal AI Logo" className="h-12 w-12" />
                        SmartSignal AI
                    </h1>
                    <p className="text-xl text-gray-600">نظام ذكي لتوزيع إشارات الاتصال حسب الطلب اللحظي</p>
                </div>

                <DataWarningBanner />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{userCount}</div>
                            <p className="text-xs text-muted-foreground">اجمالي المستخدمين</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">الأبراج النشطة</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">5</div>
                            <p className="text-xs text-muted-foreground">جميع الأبراج متصلة</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">كفاءة النظام</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">87%</div>
                            <p className="text-xs text-muted-foreground">+12% بعد التحسين</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">الأبراج المحملة زائد</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1</div>
                            <p className="text-xs text-muted-foreground">انخفاض من 4 أبراج</p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="simulation" className="space-y-6" onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="simulation">المحاكاة</TabsTrigger>
                        <TabsTrigger value="towers">حالة الأبراج</TabsTrigger>
                        <TabsTrigger value="map">الخريطة التفاعلية</TabsTrigger>
                        <TabsTrigger value="reports">التقارير</TabsTrigger>
                        <TabsTrigger value="realtime">المراقبة اللحظية</TabsTrigger>
                    </TabsList>

                   



          <TabsContent value="simulation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  محاكاة إعادة التوزيع الذكي
                </CardTitle>
                <CardDescription>
                  تشغيل محاكاة لإعادة توزيع المستخدمين باستخدام الذكاء الاصطناعي
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    onClick={runSimulation} 
                    disabled={isSimulating}
                    className="w-full"
                    size="lg"
                  >
                    {isSimulating ? 'جاري تشغيل المحاكاة...' : 'تشغيل المحاكاة'}
                  </Button>

                  {isSimulating && (
                    <div className="space-y-2">
                      <Progress value={66} className="w-full" />
                      <p className="text-sm text-center text-muted-foreground">
                        جاري تحليل الأحمال وإعادة التوزيع...
                      </p>
                    </div>
                  )}

                  {simulationData && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">النتائج</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex justify-between">
                              <span>المستخدمين المعاد توزيعهم:</span>
                              <Badge variant="secondary">{simulationData.usersRedistributed}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>تقليل الحمل الزائد:</span>
                              <Badge variant="success">{simulationData.overloadReduction}</Badge>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">التحسينات</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex justify-between">
                              <span>تحسين الكفاءة:</span>
                              <Badge variant="success">+15%</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>تقليل زمن الاستجابة:</span>
                              <Badge variant="success">-23%</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[
                            ...simulationData.initial.map(tower => ({
                              name: tower.name,
                              'قبل التحسين': tower.load,
                              'بعد التحسين': simulationData.redistributed.find(r => r.id === tower.id)?.load || 0,
                              capacity: tower.capacity
                            }))
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="قبل التحسين" fill="#ef4444" />
                            <Bar dataKey="بعد التحسين" fill="#22c55e" />
                            <Bar dataKey="capacity" fill="#94a3b8" fillOpacity={0.3} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="towers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(simulationData?.redistributed || initialTowerData).map((tower) => {
                const status = getTowerStatus(tower.load, tower.capacity)
                const loadPercentage = (tower.load / tower.capacity) * 100

                return (
                  <Card key={tower.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{tower.name}</span>
                        <Badge variant={status.color}>{status.status}</Badge>
                      </CardTitle>
                      <CardDescription>{tower.location}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>الحمل الحالي</span>
                          <span>{tower.load}/{tower.capacity}</span>
                        </div>
                        <Progress value={loadPercentage} className="w-full" />
                        <p className="text-xs text-muted-foreground">
                          {loadPercentage.toFixed(1)}% من السعة القصوى
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <InteractiveMap />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <ReportsAnalytics />
          </TabsContent>

          <TabsContent value="realtime" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>المراقبة اللحظية</CardTitle>
                <CardDescription>
                  بيانات الشبكة في الزمن الحقيقي
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={realTimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="totalUsers" stroke="#3b82f6" name="إجمالي المستخدمين" />
                      <Line type="monotone" dataKey="efficiency" stroke="#22c55e" name="كفاءة النظام %" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App


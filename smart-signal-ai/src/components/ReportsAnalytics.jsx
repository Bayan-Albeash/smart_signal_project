import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { FileText, TrendingUp, AlertTriangle, CheckCircle, MapPin, Calendar, Target, Lightbulb, Download } from 'lucide-react'

const ReportsAnalytics = () => {
  const [reportData, setReportData] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // بيانات الأعطال والحالات
  const faultSummary = {
    totalTowers: 6,
    activeTowers: 5,
    faultyTowers: 1,
    overloadedTowers: 1,
    normalTowers: 4,
    maintenanceRequired: 2,
    uptime: 94.2
  }

  // تحليل حسب المنطقة
  const regionalAnalysis = [
    { region: 'عمان', towers: 2, normal: 1, congested: 1, overloaded: 0, efficiency: 85 },
    { region: 'الزرقاء', towers: 1, normal: 1, congested: 0, overloaded: 0, efficiency: 92 },
    { region: 'إربد', towers: 1, normal: 1, congested: 0, overloaded: 0, efficiency: 88 },
    { region: 'العقبة', towers: 1, normal: 0, congested: 0, overloaded: 1, efficiency: 65 },
    { region: 'الكرك', towers: 1, normal: 1, congested: 0, overloaded: 0, efficiency: 95 }
  ]

  // التوقعات المستقبلية
  const futureProjections = [
    { month: 'كانون الثاني', demand: 120, capacity: 150, efficiency: 88 },
    { month: 'شباط', demand: 135, capacity: 150, efficiency: 85 },
    { month: 'آذار', demand: 145, capacity: 150, efficiency: 82 },
    { month: 'نيسان', demand: 160, capacity: 150, efficiency: 78 },
    { month: 'أيار', demand: 175, capacity: 150, efficiency: 75 },
    { month: 'حزيران', demand: 180, capacity: 180, efficiency: 88 }
  ]

  // بيانات الأداء التاريخي
  const performanceHistory = [
    { date: '01/01', uptime: 95.2, efficiency: 87, users: 120 },
    { date: '02/01', uptime: 94.8, efficiency: 85, users: 125 },
    { date: '03/01', uptime: 96.1, efficiency: 89, users: 130 },
    { date: '04/01', uptime: 93.5, efficiency: 82, users: 140 },
    { date: '05/01', uptime: 94.2, efficiency: 84, users: 150 },
    { date: '06/01', uptime: 95.8, efficiency: 88, users: 145 },
    { date: '07/01', uptime: 94.2, efficiency: 86, users: 155 }
  ]

  // التوصيات والحلول
  const recommendations = [
    {
      priority: 'عالية',
      category: 'صيانة طارئة',
      title: 'صيانة برج العقبة السياحي',
      description: 'البرج يعاني من حمل زائد بنسبة 122%. يتطلب تدخل فوري لتوزيع الأحمال.',
      impact: 'تحسين الأداء بنسبة 25%',
      timeline: '24 ساعة',
      cost: 'منخفض'
    },
    {
      priority: 'متوسطة',
      category: 'تحسين الشبكة',
      title: 'إضافة برج جديد في منطقة عمان الشرقية',
      description: 'لتخفيف الضغط على الأبراج الموجودة وتحسين التغطية.',
      impact: 'زيادة السعة بنسبة 40%',
      timeline: '3-6 أشهر',
      cost: 'عالي'
    },
    {
      priority: 'منخفضة',
      category: 'تحسين الكفاءة',
      title: 'ترقية أنظمة الذكاء الاصطناعي',
      description: 'تحسين خوارزميات إعادة التوزيع لزيادة الكفاءة التشغيلية.',
      impact: 'تحسين الكفاءة بنسبة 15%',
      timeline: '2-4 أسابيع',
      cost: 'متوسط'
    },
    {
      priority: 'متوسطة',
      category: 'الصيانة الوقائية',
      title: 'جدولة صيانة دورية للأبراج',
      description: 'وضع جدول صيانة وقائية منتظم لتجنب الأعطال المفاجئة.',
      impact: 'تقليل الأعطال بنسبة 30%',
      timeline: 'مستمر',
      cost: 'منخفض'
    }
  ]

  const generateReport = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setReportData({
        generatedAt: new Date().toLocaleString('ar-SA'),
        summary: faultSummary,
        regional: regionalAnalysis,
        projections: futureProjections,
        recommendations: recommendations
      })
      setIsGenerating(false)
    }, 2000)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'عالية': return 'destructive'
      case 'متوسطة': return 'warning'
      case 'منخفضة': return 'secondary'
      default: return 'secondary'
    }
  }

  const COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#6b7280']

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            تقارير وتحليلات الشبكة
          </CardTitle>
          <CardDescription>
            تقارير شاملة عن حالة الأبراج والتوقعات المستقبلية والتوصيات
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Button 
              onClick={generateReport}
              disabled={isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? 'جاري إنشاء التقرير...' : 'إنشاء تقرير شامل'}
            </Button>
          </div>

          {reportData && (
            <Tabs defaultValue="summary" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="summary">الملخص العام</TabsTrigger>
                <TabsTrigger value="regional">التحليل الإقليمي</TabsTrigger>
                <TabsTrigger value="projections">التوقعات المستقبلية</TabsTrigger>
                <TabsTrigger value="recommendations">التوصيات</TabsTrigger>
              </TabsList>

              {/* الملخص العام */}
              <TabsContent value="summary" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">إجمالي الأبراج</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{faultSummary.totalTowers}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">الأبراج النشطة</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{faultSummary.activeTowers}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">الأبراج المعطلة</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">{faultSummary.faultyTowers}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">معدل التشغيل</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">{faultSummary.uptime}%</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>توزيع حالات الأبراج</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'طبيعي', value: faultSummary.normalTowers, color: '#22c55e' },
                                { name: 'محمل زائد', value: faultSummary.overloadedTowers, color: '#ef4444' },
                                { name: 'معطل', value: faultSummary.faultyTowers, color: '#6b7280' }
                              ]}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {[
                                { name: 'طبيعي', value: faultSummary.normalTowers, color: '#22c55e' },
                                { name: 'محمل زائد', value: faultSummary.overloadedTowers, color: '#ef4444' },
                                { name: 'معطل', value: faultSummary.faultyTowers, color: '#6b7280' }
                              ].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>الأداء التاريخي</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={performanceHistory}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="uptime" stroke="#3b82f6" name="معدل التشغيل %" />
                            <Line type="monotone" dataKey="efficiency" stroke="#22c55e" name="الكفاءة %" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* التحليل الإقليمي */}
              <TabsContent value="regional" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      تحليل الأداء حسب المنطقة
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={regionalAnalysis}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="region" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="normal" stackId="a" fill="#22c55e" name="طبيعي" />
                          <Bar dataKey="congested" stackId="a" fill="#f59e0b" name="مزدحم" />
                          <Bar dataKey="overloaded" stackId="a" fill="#ef4444" name="محمل زائد" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {regionalAnalysis.map((region, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">{region.region}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span>عدد الأبراج:</span>
                          <Badge variant="secondary">{region.towers}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>الكفاءة:</span>
                          <Badge variant={region.efficiency > 85 ? 'success' : region.efficiency > 70 ? 'warning' : 'destructive'}>
                            {region.efficiency}%
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>الأداء العام</span>
                            <span>{region.efficiency}%</span>
                          </div>
                          <Progress value={region.efficiency} className="w-full" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* التوقعات المستقبلية */}
              <TabsContent value="projections" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      التوقعات المستقبلية للطلب والسعة
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={futureProjections}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Area type="monotone" dataKey="capacity" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="السعة المتاحة" />
                          <Area type="monotone" dataKey="demand" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} name="الطلب المتوقع" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-center">الربع الأول</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-2">
                      <div className="text-2xl font-bold text-green-600">85%</div>
                      <p className="text-sm text-gray-600">متوقع كفاءة جيدة</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-center">الربع الثاني</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-2">
                      <div className="text-2xl font-bold text-yellow-600">75%</div>
                      <p className="text-sm text-gray-600">تحتاج تدخل</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-center">النصف الثاني</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-2">
                      <div className="text-2xl font-bold text-green-600">88%</div>
                      <p className="text-sm text-gray-600">بعد التحسينات</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* التوصيات */}
              <TabsContent value="recommendations" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      التوصيات والحلول المقترحة
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recommendations.map((rec, index) => (
                        <Card key={index} className="border-l-4" style={{
                          borderLeftColor: rec.priority === 'عالية' ? '#ef4444' : 
                                          rec.priority === 'متوسطة' ? '#f59e0b' : '#6b7280'
                        }}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{rec.title}</CardTitle>
                              <div className="flex gap-2">
                                <Badge variant={getPriorityColor(rec.priority)}>
                                  {rec.priority}
                                </Badge>
                                <Badge variant="outline">
                                  {rec.category}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <p className="text-gray-600">{rec.description}</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="font-semibold">التأثير المتوقع:</span>
                                <p className="text-green-600">{rec.impact}</p>
                              </div>
                              <div>
                                <span className="font-semibold">المدة الزمنية:</span>
                                <p>{rec.timeline}</p>
                              </div>
                              <div>
                                <span className="font-semibold">التكلفة:</span>
                                <p>{rec.cost}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {reportData && (
            <div className="mt-6 flex justify-center">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                تحميل التقرير PDF
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ReportsAnalytics


import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { Download, TrendingUp, TrendingDown, FileText, FileSpreadsheet } from 'lucide-react'
import { exportToCSV, exportToPDF, prepareTowerData, prepareAnalyticsData } from '../utils/exportUtils'
import AnimatedCounter from '../components/AnimatedCounter'
import AnimatedProgressBar from '../components/AnimatedProgressBar'
import AnimatedTable from '../components/AnimatedTable'
import DynamicCounter from '../components/DynamicCounter'
import EnhancedChart from '../components/EnhancedChart'
import { useDynamicData } from '../components/DynamicDataProvider'

const AnalyticsPage = () => {
  const { data: dynamicData } = useDynamicData()
  const [kpis, setKpis] = useState({})
  const [heatmapData, setHeatmapData] = useState([])
  const [performanceData, setPerformanceData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Use dynamic data from context
    if (dynamicData) {
      setKpis({
        network_efficiency: { current: dynamicData.systemStats.networkEfficiency, change_percent: 12 },
        user_satisfaction: { current: 4.6, change_percent: 8 },
        tower_utilization: { current: 78, change_percent: 5 },
        handover_success_rate: { current: 97, change_percent: 3 }
      })
      setHeatmapData(dynamicData.heatmapData)
      setPerformanceData(dynamicData.performanceData)
      setLoading(false)
    }
  }, [dynamicData])

  const handleDownloadReport = (format) => {
    if (format === 'csv') {
      const csvData = prepareAnalyticsData(kpis, performanceData)
      exportToCSV(csvData.performance, 'smartsignal-analytics')
    } else if (format === 'pdf') {
      const pdfData = {
        kpis,
        performanceData,
        heatmapData,
        timestamp: new Date().toISOString()
      }
      exportToPDF(pdfData, 'smartsignal-analytics')
    } else {
      // JSON fallback
      const dataStr = JSON.stringify({ kpis, heatmapData, performanceData }, null, 2)
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
      
      const exportFileDefaultName = `smartsignal-report-${new Date().toISOString().split('T')[0]}.json`
      
      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-16 sm:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">التحليلات والتقارير</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">تحليل شامل لأداء الشبكة ومؤشرات الأداء الرئيسية</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:space-x-2 sm:space-x-reverse">
            <motion.button
              onClick={() => handleDownloadReport('pdf')}
              className="flex items-center px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FileText className="w-4 h-4 mr-2" />
              PDF
            </motion.button>
            <motion.button
              onClick={() => handleDownloadReport('csv')}
              className="flex items-center px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              CSV
            </motion.button>
            <motion.button
              onClick={() => handleDownloadReport('json')}
              className="flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-4 h-4 mr-2" />
              JSON
            </motion.button>
          </div>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-between">
                     <div>
                       <p className="text-sm text-gray-600 dark:text-gray-300">كفاءة الشبكة</p>
                       <p className="text-3xl font-bold text-green-600">
                         <DynamicCounter 
                           value={kpis.network_efficiency?.current || 91} 
                           duration={1.5} 
                           delay={0.1} 
                           suffix="%" 
                           ease="easeOut"
                           showDecimal={true}
                           decimals={1}
                           showTrend={true}
                           trend="up"
                         />
                       </p>
                       <div className="flex items-center text-xs text-green-600">
                         <TrendingUp className="w-3 h-3 mr-1" />
                         +<AnimatedCounter 
                           value={kpis.network_efficiency?.change_percent || 12} 
                           duration={2} 
                           delay={0.5} 
                           suffix="%" 
                           className="inline"
                           ease="easeOut"
                           startValue={0}
                         /> من الشهر الماضي
                       </div>
                     </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-between">
                     <div>
                       <p className="text-sm text-gray-600 dark:text-gray-300">رضا المستخدمين</p>
                       <p className="text-3xl font-bold text-blue-600">
                         <AnimatedCounter 
                           value={kpis.user_satisfaction?.current || 4.6} 
                           duration={2} 
                           delay={0.2} 
                           decimals={1}
                         />
                       </p>
                       <div className="flex items-center text-xs text-blue-600">
                         <TrendingUp className="w-3 h-3 mr-1" />
                         +<AnimatedCounter 
                           value={kpis.user_satisfaction?.change_percent || 0.8} 
                           duration={1.5} 
                           delay={0.6} 
                           decimals={1}
                           className="inline"
                         /> من الشهر الماضي
                       </div>
                     </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-between">
                     <div>
                       <p className="text-sm text-gray-600 dark:text-gray-300">استخدام الأبراج</p>
                       <p className="text-3xl font-bold text-purple-600">
                         <AnimatedCounter 
                           value={kpis.tower_utilization?.current || 78} 
                           duration={2} 
                           delay={0.3} 
                           suffix="%" 
                         />
                       </p>
                       <div className="flex items-center text-xs text-purple-600">
                         <TrendingUp className="w-3 h-3 mr-1" />
                         +<AnimatedCounter 
                           value={kpis.tower_utilization?.change_percent || 5} 
                           duration={1.5} 
                           delay={0.7} 
                           suffix="%" 
                           className="inline"
                         /> من الشهر الماضي
                       </div>
                     </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-between">
                     <div>
                       <p className="text-sm text-gray-600 dark:text-gray-300">معدل النجاح</p>
                       <p className="text-3xl font-bold text-orange-600">
                         <AnimatedCounter 
                           value={kpis.handover_success_rate?.current || 97} 
                           duration={2} 
                           delay={0.4} 
                           suffix="%" 
                         />
                       </p>
                       <div className="flex items-center text-xs text-orange-600">
                         <TrendingUp className="w-3 h-3 mr-1" />
                         +<AnimatedCounter 
                           value={kpis.handover_success_rate?.change_percent || 3} 
                           duration={1.5} 
                           delay={0.8} 
                           suffix="%" 
                           className="inline"
                         /> من الشهر الماضي
                       </div>
                     </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Chart */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            {performanceData && performanceData.length > 0 ? (
              <EnhancedChart 
                type="line" 
                data={performanceData} 
                title="أداء الشبكة على مدار 24 ساعة"
                height={300}
              />
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p>جاري تحميل البيانات...</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Heatmap */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            {heatmapData && heatmapData.length > 0 ? (
              <EnhancedChart 
                type="bar" 
                data={heatmapData} 
                title="توزيع الحمل على الأبراج"
                height={300}
              />
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p>جاري تحميل البيانات...</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Comparison Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">مقارنة الأداء</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <motion.div
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ duration: 0.6, delay: 0.2 }}
                   >
                     <h3 className="font-medium mb-4 text-gray-900 dark:text-white">قبل التحسين</h3>
                     <div className="space-y-3">
                       <motion.div 
                         className="flex justify-between text-gray-600 dark:text-gray-300"
                         initial={{ opacity: 0, x: -10 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ duration: 0.4, delay: 0.3 }}
                       >
                         <span>الأبراج المحملة زائد</span>
                         <span className="font-semibold text-red-600">
                           <AnimatedCounter value={4} duration={1} delay={0.4} /> أبراج
                         </span>
                       </motion.div>
                       <motion.div 
                         className="flex justify-between text-gray-600 dark:text-gray-300"
                         initial={{ opacity: 0, x: -10 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ duration: 0.4, delay: 0.5 }}
                       >
                         <span>متوسط زمن الاستجابة</span>
                         <span className="font-semibold text-red-600">
                           <AnimatedCounter value={85.2} duration={1.5} delay={0.6} decimals={1} />ms
                         </span>
                       </motion.div>
                       <motion.div 
                         className="flex justify-between text-gray-600 dark:text-gray-300"
                         initial={{ opacity: 0, x: -10 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ duration: 0.4, delay: 0.7 }}
                       >
                         <span>كفاءة الشبكة</span>
                         <span className="font-semibold text-red-600">
                           <AnimatedCounter value={78.5} duration={1.5} delay={0.8} decimals={1} />%
                         </span>
                       </motion.div>
                       <motion.div 
                         className="flex justify-between text-gray-600 dark:text-gray-300"
                         initial={{ opacity: 0, x: -10 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ duration: 0.4, delay: 0.9 }}
                       >
                         <span>رضا المستخدمين</span>
                         <span className="font-semibold text-red-600">
                           <AnimatedCounter value={3.2} duration={1.5} delay={1.0} decimals={1} />/5
                         </span>
                       </motion.div>
                     </div>
                   </motion.div>

                   <motion.div
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ duration: 0.6, delay: 0.4 }}
                   >
                     <h3 className="font-medium mb-4 text-gray-900 dark:text-white">بعد التحسين</h3>
                     <div className="space-y-3">
                       <motion.div 
                         className="flex justify-between text-gray-600 dark:text-gray-300"
                         initial={{ opacity: 0, x: 10 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ duration: 0.4, delay: 0.5 }}
                       >
                         <span>الأبراج المحملة زائد</span>
                         <span className="font-semibold text-green-600">
                           <AnimatedCounter value={1} duration={1} delay={0.6} /> برج
                         </span>
                       </motion.div>
                       <motion.div 
                         className="flex justify-between text-gray-600 dark:text-gray-300"
                         initial={{ opacity: 0, x: 10 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ duration: 0.4, delay: 0.7 }}
                       >
                         <span>متوسط زمن الاستجابة</span>
                         <span className="font-semibold text-green-600">
                           <AnimatedCounter value={62.8} duration={1.5} delay={0.8} decimals={1} />ms
                         </span>
                       </motion.div>
                       <motion.div 
                         className="flex justify-between text-gray-600 dark:text-gray-300"
                         initial={{ opacity: 0, x: 10 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ duration: 0.4, delay: 0.9 }}
                       >
                         <span>كفاءة الشبكة</span>
                         <span className="font-semibold text-green-600">
                           <AnimatedCounter value={91.3} duration={1.5} delay={1.0} decimals={1} />%
                         </span>
                       </motion.div>
                       <motion.div 
                         className="flex justify-between text-gray-600 dark:text-gray-300"
                         initial={{ opacity: 0, x: 10 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ duration: 0.4, delay: 1.1 }}
                       >
                         <span>رضا المستخدمين</span>
                         <span className="font-semibold text-green-600">
                           <AnimatedCounter value={4.6} duration={1.5} delay={1.2} decimals={1} />/5
                         </span>
                       </motion.div>
                     </div>
                   </motion.div>
                 </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">رؤى الذكاء الاصطناعي</h2>
          <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 mb-4">
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">💡 توصية من Gemini AI</h3>
            <p className="text-blue-800 dark:text-blue-200">
              بناءً على تحليل البيانات، نوصي بتطبيق خوارزمية إعادة التوزيع الذكي على أبراج منطقة وسط البلد 
              خلال ساعات الذروة (8-10 صباحاً و 5-7 مساءً) لتحسين الأداء بنسبة 15% إضافية.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">✅ التحسينات المحققة</h4>
              <ul className="text-green-800 dark:text-green-200 text-sm space-y-1">
                <li>• تقليل الحمل الزائد 75%</li>
                <li>• تحسين زمن الاستجابة 26%</li>
                <li>• زيادة الكفاءة 16%</li>
                <li>• رضا المستخدمين 44%</li>
              </ul>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-4">
              <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">⚠️ مناطق تحتاج انتباه</h4>
              <ul className="text-yellow-800 dark:text-yellow-200 text-sm space-y-1">
                <li>• برج وسط البلد - حمل عالي</li>
                <li>• ساعات الذروة - ازدحام</li>
                <li>• منطقة الزرقاء - تغطية ضعيفة</li>
              </ul>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4">
              <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">🚀 خطط مستقبلية</h4>
              <ul className="text-purple-800 dark:text-purple-200 text-sm space-y-1">
                <li>• إضافة أبراج جديدة</li>
                <li>• تحسين التغطية</li>
                <li>• تطبيق ML متقدم</li>
                <li>• مراقبة 24/7</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage

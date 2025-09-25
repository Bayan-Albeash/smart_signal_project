import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import AnimatedCounter from '../components/AnimatedCounter'
import DynamicCounter from '../components/DynamicCounter'
import { useDynamicData } from '../components/DynamicDataProvider'

const HomePage = () => {
  const { data } = useDynamicData()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-16 sm:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
            SmartSignal AI
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            نظام ذكي متطور لتوزيع إشارات الاتصال الخلوي باستخدام الذكاء الاصطناعي والتعلم الآلي
          </p>
          <Link
            to="/map"
            className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg text-sm sm:text-base"
          >
            <span className="ml-2">🚀</span>
            ابدأ المحاكاة
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">الذكاء الاصطناعي</h3>
            <p className="text-gray-600 dark:text-gray-300">
              استخدام XGBoost و Gemini AI للتنبؤ الذكي وتحسين توزيع المستخدمين
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">المحاكاة التفاعلية</h3>
            <p className="text-gray-600 dark:text-gray-300">
              محاكاة فورية مع خرائط Google Maps ومراقبة لحظية للأداء
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">التحليلات المتقدمة</h3>
            <p className="text-gray-600 dark:text-gray-300">
              تقارير شاملة مع KPIs وخرائط حرارية ومقارنات الأداء
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-8 shadow-md">
          <div className="flex items-center justify-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">إحصائيات النظام</h2>
            <motion.div
              className="ml-3 text-green-500"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              🔄
            </motion.div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <motion.div 
              className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.15)" }}
            >
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
                <DynamicCounter 
                  value={data.systemStats.activeTowers} 
                  duration={1.5} 
                  delay={0.2} 
                  ease="easeOut"
                  showTrend={true}
                  trend="up"
                />
              </div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-medium">أبراج نشطة</div>
            </motion.div>
            
            <motion.div 
              className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(34, 197, 94, 0.15)" }}
            >
              <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
                <DynamicCounter 
                  value={data.systemStats.activeUsers} 
                  duration={2} 
                  delay={0.4} 
                  suffix="+" 
                  ease="easeOut"
                  showTrend={true}
                  trend="up"
                />
              </div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-medium">مستخدم نشط</div>
            </motion.div>
            
            <motion.div 
              className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(147, 51, 234, 0.15)" }}
            >
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">
                <DynamicCounter 
                  value={data.systemStats.networkEfficiency} 
                  duration={1.8} 
                  delay={0.6} 
                  suffix="%" 
                  ease="easeOut"
                  showDecimal={true}
                  decimals={1}
                  showTrend={true}
                  trend="up"
                />
              </div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-medium">كفاءة الشبكة</div>
            </motion.div>
            
            <motion.div 
              className="text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(249, 115, 22, 0.15)" }}
            >
              <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-2">
                <DynamicCounter 
                  value={data.systemStats.performanceImprovement} 
                  duration={1.5} 
                  delay={0.8} 
                  suffix="%" 
                  ease="easeOut"
                  showTrend={true}
                  trend="up"
                />
              </div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-medium">تحسين الأداء</div>
            </motion.div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">جاهز لاستكشاف النظام؟</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            اكتشف كيف يمكن للذكاء الاصطناعي تحسين أداء الشبكات الخلوية
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/map"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              عرض الخريطة التفاعلية
            </Link>
            <Link
              to="/analytics"
              className="px-6 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
            >
              عرض التحليلات
            </Link>
            <Link
              to="/about"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              نبذة عن
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              تواصل معنا
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage

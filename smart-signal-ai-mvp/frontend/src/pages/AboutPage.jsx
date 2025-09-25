import React from 'react'
import { motion } from 'framer-motion'
import { Users, Target, Award, Lightbulb, Globe, Shield } from 'lucide-react'

const AboutPage = () => {
  const features = [
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "فريق متخصص",
      description: "فريق من المهندسين والمطورين المتخصصين في الذكاء الاصطناعي والشبكات"
    },
    {
      icon: <Target className="w-8 h-8 text-green-600" />,
      title: "رؤية واضحة",
      description: "نهدف إلى تحسين كفاءة الشبكات الخلوية وتوفير تجربة أفضل للمستخدمين"
    },
    {
      icon: <Award className="w-8 h-8 text-purple-600" />,
      title: "جودة عالية",
      description: "نستخدم أحدث التقنيات والمعايير العالمية في تطوير الحلول"
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-yellow-600" />,
      title: "ابتكار مستمر",
      description: "نعمل على تطوير حلول مبتكرة باستمرار لمواكبة التطورات التقنية"
    },
    {
      icon: <Globe className="w-8 h-8 text-indigo-600" />,
      title: "تغطية شاملة",
      description: "نقدم خدماتنا في جميع أنحاء المملكة الأردنية الهاشمية"
    },
    {
      icon: <Shield className="w-8 h-8 text-red-600" />,
      title: "أمان وموثوقية",
      description: "نضمن أعلى مستويات الأمان والموثوقية في جميع خدماتنا"
    }
  ]

  const stats = [
    { number: "5+", label: "سنوات خبرة" },
    { number: "50+", label: "مشروع مكتمل" },
    { number: "99%", label: "رضا العملاء" },
    { number: "24/7", label: "دعم فني" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-16 sm:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
            نبذة عن SmartSignal AI
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            نحن رواد في مجال الذكاء الاصطناعي وتطوير حلول الشبكات الذكية في الأردن
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">رؤيتنا</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              نطمح إلى أن نكون الرائدين في مجال الذكاء الاصطناعي وتطوير حلول الشبكات الذكية 
              في الشرق الأوسط، وأن نساهم في بناء مستقبل رقمي متقدم للمملكة الأردنية الهاشمية.
            </p>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">مهمتنا</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              نعمل على تطوير حلول ذكية ومبتكرة لتحسين كفاءة الشبكات الخلوية، 
              وتوفير تجربة أفضل للمستخدمين من خلال استخدام أحدث تقنيات الذكاء الاصطناعي.
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            مميزاتنا
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          className="bg-white rounded-lg shadow-md p-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <h2 className="text-3xl font-bold text-center text-blue-900 dark:text-blue-800 mb-12">
            إحصائياتنا
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                whileHover={{ scale: 1.1 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
              >
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technology Stack */}
        <motion.div
          className="bg-white rounded-lg shadow-md p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
        >
         <h2 className="text-3xl font-bold text-center text-blue-900 dark:text-blue-800 mb-12">
  التقنيات المستخدمة
</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: "React", color: "text-blue-500" },
              { name: "Python", color: "text-yellow-500" },
              { name: "XGBoost", color: "text-green-500" },
              { name: "Flask", color: "text-red-500" },
              { name: "Tailwind CSS", color: "text-cyan-500" },
              { name: "Google Maps", color: "text-blue-600" },
              { name: "Gemini AI", color: "text-purple-500" },
              { name: "FastAPI", color: "text-indigo-500" }
            ].map((tech, index) => (
              <motion.div
                key={index}
                className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.8 + index * 0.1 }}
              >
                <div className={`text-2xl font-bold ${tech.color}`}>
                  {tech.name}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AboutPage

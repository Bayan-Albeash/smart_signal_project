import React, { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const AnimatedProgressBar = ({ 
  value, 
  max = 100, 
  color = 'bg-blue-500',
  height = 'h-2',
  showPercentage = true,
  duration = 2,
  delay = 0,
  className = ''
}) => {
  const [progress, setProgress] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.3 })

  useEffect(() => {
    if (isInView) {
      const startTime = Date.now()
      const endValue = (value / max) * 100

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / (duration * 1000), 1)
        
        // Easing function
        const easeOutCubic = 1 - Math.pow(1 - progress, 3)
        const currentValue = endValue * easeOutCubic
        
        setProgress(currentValue)

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setProgress(endValue)
        }
      }

      const timeout = setTimeout(() => {
        requestAnimationFrame(animate)
      }, delay * 1000)

      return () => clearTimeout(timeout)
    }
  }, [isInView, value, max, duration, delay])

  return (
    <motion.div
      ref={ref}
      className={`w-full ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full ${height} overflow-hidden`}>
        <motion.div
          className={`${color} ${height} rounded-full relative`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: duration, delay: delay, ease: "easeOut" }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          />
        </motion.div>
      </div>
      {showPercentage && (
        <motion.div
          className="text-sm text-gray-600 dark:text-gray-300 mt-1 text-right"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: delay + 0.5 }}
        >
          {Math.round(progress)}%
        </motion.div>
      )}
    </motion.div>
  )
}

export default AnimatedProgressBar


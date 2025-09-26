import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const DynamicCounter = ({ 
  value, 
  duration = 1.5, 
  delay = 0, 
  suffix = '', 
  prefix = '',
  ease = "easeOut",
  showDecimal = false,
  decimals = 0,
  className = "",
  showTrend = false,
  trend = "up"
}) => {
  const [displayValue, setDisplayValue] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [previousValue, setPreviousValue] = useState(0)

  useEffect(() => {
    if (value !== previousValue) {
      setIsAnimating(true)
      setPreviousValue(displayValue)
      
      const startTime = Date.now()
      const startValue = displayValue
      const endValue = value
      const difference = endValue - startValue
      
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / (duration * 1000), 1)
        
        // تطبيق easing function
        let easedProgress = progress
        switch (ease) {
          case "easeIn":
            easedProgress = progress * progress
            break
          case "easeOut":
            easedProgress = 1 - Math.pow(1 - progress, 3)
            break
          case "easeInOut":
            easedProgress = progress < 0.5 
              ? 2 * progress * progress 
              : 1 - Math.pow(-2 * progress + 2, 3) / 2
            break
          case "bounce":
            easedProgress = progress < 0.5
              ? 4 * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 2) / 2
            break
          case "elastic":
            easedProgress = progress === 0 ? 0 : progress === 1 ? 1 : 
              Math.pow(2, -10 * progress) * Math.sin((progress * 10 - 0.75) * (2 * Math.PI) / 3) + 1
            break
          default:
            easedProgress = progress
        }
        
        const currentValue = startValue + (difference * easedProgress)
        setDisplayValue(currentValue)
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setIsAnimating(false)
        }
      }
      
      setTimeout(() => {
        requestAnimationFrame(animate)
      }, delay * 1000)
    }
  }, [value, duration, delay, ease, displayValue, previousValue])

  const formatValue = (val) => {
    if (showDecimal) {
      return val.toFixed(decimals)
    }
    return Math.round(val)
  }

  const getTrendIcon = () => {
    if (trend === "up") return "📈"
    if (trend === "down") return "📉"
    return "➡️"
  }

  const getTrendColor = () => {
    if (trend === "up") return "text-green-500"
    if (trend === "down") return "text-red-500"
    return "text-gray-500"
  }

  return (
    <motion.div 
      className={`relative ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={displayValue}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center space-x-1 space-x-reverse"
        >
          <span className="text-2xl sm:text-3xl font-bold">
            {prefix}{formatValue(displayValue)}{suffix}
          </span>
          
          {showTrend && (
            <motion.span
              className={`text-lg ${getTrendColor()}`}
              animate={{ 
                scale: isAnimating ? [1, 1.2, 1] : 1,
                rotate: isAnimating ? [0, 5, -5, 0] : 0
              }}
              transition={{ duration: 0.5 }}
            >
              {getTrendIcon()}
            </motion.span>
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* تأثير الوميض عند التحديث */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            className="absolute inset-0 bg-blue-200 dark:bg-blue-800 rounded-lg opacity-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default DynamicCounter

import React, { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const AnimatedCounter = ({ 
  value, 
  duration = 2, 
  delay = 0, 
  prefix = '', 
  suffix = '', 
  className = '',
  decimals = 0,
  startValue = 0,
  ease = "easeOut",
  showDecimal = false
}) => {
  const [count, setCount] = useState(startValue)
  const [isAnimating, setIsAnimating] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.3 })
  const animationRef = useRef(null)

  useEffect(() => {
    if (isInView) {
      const startTime = Date.now()
      const endValue = value
      setIsAnimating(true)

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / (duration * 1000), 1)
        
        // Different easing functions for more realistic animation
        let easedProgress
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
            if (progress < 0.5) {
              easedProgress = 2 * progress * progress
            } else {
              easedProgress = 1 - Math.pow(-2 * progress + 2, 2) / 2
            }
            break
          case "elastic":
            const c4 = (2 * Math.PI) / 3
            easedProgress = progress === 0 ? 0 : progress === 1 ? 1 : Math.pow(2, -10 * progress) * Math.sin((progress * 10 - 0.75) * c4) + 1
            break
          default:
            easedProgress = progress
        }
        
        const currentValue = startValue + (endValue - startValue) * easedProgress
        
        // Add some randomness for more realistic counter effect
        const randomFactor = 0.02
        const randomOffset = (Math.random() - 0.5) * randomFactor * (endValue - startValue)
        const finalValue = currentValue + randomOffset
        
        setCount(Math.max(startValue, Math.min(endValue, finalValue)))

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        } else {
          setCount(endValue)
          setIsAnimating(false)
        }
      }

      const timeout = setTimeout(() => {
        requestAnimationFrame(animate)
      }, delay * 1000)

      return () => {
        clearTimeout(timeout)
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }
  }, [isInView, value, duration, delay, startValue, ease])

  const formatNumber = (num) => {
    if (showDecimal) {
      return num.toFixed(decimals)
    }
    return Math.round(num).toFixed(decimals)
  }

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={isInView ? { 
        opacity: 1, 
        scale: 1, 
        y: 0 
      } : { 
        opacity: 0, 
        scale: 0.5, 
        y: 20 
      }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: "easeOut"
      }}
    >
      <motion.span
        style={{ 
          display: 'inline-block',
          fontVariantNumeric: 'tabular-nums',
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
        }}
        animate={isAnimating ? {
          scale: [1, 1.05, 1],
          textShadow: [
            '0 0 0px rgba(59, 130, 246, 0)',
            '0 0 8px rgba(59, 130, 246, 0.4)',
            '0 0 0px rgba(59, 130, 246, 0)'
          ]
        } : {}}
        transition={{
          duration: 0.3,
          repeat: isAnimating ? Infinity : 0,
          repeatDelay: 0.1
        }}
      >
        {prefix}{formatNumber(count)}{suffix}
      </motion.span>
    </motion.span>
  )
}

export default AnimatedCounter

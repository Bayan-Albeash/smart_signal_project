import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const AnimatedTable = ({ 
  data, 
  columns, 
  className = '',
  staggerDelay = 0.1 
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.1 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.2
      }
    }
  }

  const rowVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  const cellVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div
      ref={ref}
      className={`overflow-x-auto ${className}`}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <motion.tr variants={rowVariants}>
            {columns.map((column, index) => (
              <motion.th
                key={index}
                variants={cellVariants}
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                {column.header}
              </motion.th>
            ))}
          </motion.tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row, rowIndex) => (
            <motion.tr
              key={rowIndex}
              variants={rowVariants}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {columns.map((column, colIndex) => (
                <motion.td
                  key={colIndex}
                  variants={cellVariants}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                >
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </motion.td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  )
}

export default AnimatedTable


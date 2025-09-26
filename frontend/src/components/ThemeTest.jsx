import React from 'react'
import { useTheme } from '../context/ThemeContext'

const ThemeTest = () => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Theme Status
        </h3>
        <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">
          Current: {isDark ? 'Dark' : 'Light'}
        </div>
        <button
          onClick={toggleTheme}
          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
        >
          Toggle Theme
        </button>
      </div>
    </div>
  )
}

export default ThemeTest

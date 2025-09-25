import React, { useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'

const ThemeWrapper = ({ children }) => {
  const { isDark } = useTheme()

  useEffect(() => {
    // Force apply theme to body
    const body = document.body
    if (isDark) {
      body.classList.add('dark')
      body.classList.remove('light')
    } else {
      body.classList.add('light')
      body.classList.remove('dark')
    }
  }, [isDark])

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      {children}
    </div>
  )
}

export default ThemeWrapper

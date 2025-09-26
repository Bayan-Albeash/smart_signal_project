import React, { useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'

const ThemeWrapper = ({ children }) => {
  const { isDark } = useTheme()

  useEffect(() => {
    // Force apply theme to body and html
    const body = document.body
    const html = document.documentElement
    
    if (isDark) {
      body.classList.add('dark')
      body.classList.remove('light')
      html.classList.add('dark')
      html.classList.remove('light')
    } else {
      body.classList.add('light')
      body.classList.remove('dark')
      html.classList.add('light')
      html.classList.remove('dark')
    }
  }, [isDark])

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDark 
        ? 'bg-gray-900 text-white' 
        : 'bg-white text-gray-900'
    }`}>
      {children}
    </div>
  )
}

export default ThemeWrapper

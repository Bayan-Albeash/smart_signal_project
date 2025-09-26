import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false) // Always start with light theme

  // Initialize theme on mount and apply to document
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    // Default to light theme - only use dark if explicitly saved
    const shouldBeDark = saved === 'dark' ? true : false
    
    setIsDark(shouldBeDark)
    
    // Apply theme to document immediately
    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
      document.documentElement.setAttribute('data-theme', 'dark')
      document.body.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.setAttribute('data-theme', 'light')
      document.body.classList.add('light')
      document.body.classList.remove('dark')
    }
  }, [])

  // Update document when theme changes
  useEffect(() => {
    // Update localStorage
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    
    // Update document class and attribute for Tailwind dark mode
    if (isDark) {
      document.documentElement.classList.add('dark')
      document.documentElement.setAttribute('data-theme', 'dark')
      document.body.classList.add('dark')
      document.body.classList.remove('light')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.setAttribute('data-theme', 'light')
      document.body.classList.add('light')
      document.body.classList.remove('dark')
    }
    
    // Force re-render of all components by updating a global state
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { isDark } 
    }))
  }, [isDark])

  const toggleTheme = () => {
    console.log('Toggle theme clicked! Current isDark:', isDark)
    setIsDark(prev => {
      const newTheme = !prev
      console.log('New theme will be:', newTheme ? 'dark' : 'light')
      return newTheme
    })
  }

  const value = {
    isDark,
    toggleTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

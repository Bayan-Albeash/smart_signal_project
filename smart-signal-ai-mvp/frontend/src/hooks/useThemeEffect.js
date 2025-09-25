import { useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'

export const useThemeEffect = () => {
  const { isDark } = useTheme()

  useEffect(() => {
    // Force re-render of all components when theme changes
    const event = new CustomEvent('themeChanged', { 
      detail: { isDark, timestamp: Date.now() } 
    })
    window.dispatchEvent(event)

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? '#1f2937' : '#ffffff')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'theme-color'
      meta.content = isDark ? '#1f2937' : '#ffffff'
      document.head.appendChild(meta)
    }

    // Update CSS custom properties for theme
    const root = document.documentElement
    if (isDark) {
      root.style.setProperty('--bg-primary', '#1f2937')
      root.style.setProperty('--bg-secondary', '#374151')
      root.style.setProperty('--text-primary', '#ffffff')
      root.style.setProperty('--text-secondary', '#d1d5db')
    } else {
      root.style.setProperty('--bg-primary', '#ffffff')
      root.style.setProperty('--bg-secondary', '#f9fafb')
      root.style.setProperty('--text-primary', '#1f2937')
      root.style.setProperty('--text-secondary', '#6b7280')
    }
  }, [isDark])

  return { isDark }
}

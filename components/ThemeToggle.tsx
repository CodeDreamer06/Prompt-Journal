'use client'

import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-9 h-9" />; // Placeholder to prevent layout shift
  }

  const toggleTheme = () => {
    const current = theme || 'system'
    let next
    if (current === 'system') {
      next = 'light'
    } else if (current === 'light') {
      next = 'dark'
    } else {
      next = 'system'
    }
    setTheme(next)
  }

  const currentTheme = theme || 'system'
  let Icon = Monitor
  if (currentTheme === 'light') Icon = Sun
  if (currentTheme === 'dark') Icon = Moon

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle theme"
    >
      <Icon className="w-5 h-5" />
    </button>
  )
}

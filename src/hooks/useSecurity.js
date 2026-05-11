'use client'

import { useState, useEffect } from 'react'
import { showToast } from '@/utils/toast'

/**
 * Hook to implement enterprise-grade frontend restrictions
 * @returns {Object} Security state and handlers
 */
export const useSecurity = (options = { blockDevTools: true, blockShortcuts: true }) => {
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false)
  const [isWindowFocused, setIsWindowFocused] = useState(true)

  useEffect(() => {
    // 1. DevTools Detection (Heuristic approach)
    const detectDevTools = () => {
      const threshold = 160
      const widthThreshold = window.outerWidth - window.innerWidth > threshold
      const heightThreshold = window.outerHeight - window.innerHeight > threshold

      if (widthThreshold || heightThreshold) {
        if (!isDevToolsOpen) {
          setIsDevToolsOpen(true)
          showToast('Protected Content - Unauthorized Action Restricted', 'error')
        }
      } else {
        setIsDevToolsOpen(false)
      }
    }

    // 2. Continuous Monitoring
    const interval = setInterval(detectDevTools, 1000)

    // 3. Keyboard Shortcut Blocking
    const handleKeyDown = (e) => {
      if (!options.blockShortcuts) return

      // List of blocked keys/combinations
      const blockedKeys = [
        { key: 'p', ctrl: true, meta: true }, // Print
        { key: 's', ctrl: true, meta: true }, // Save
        { key: 'u', ctrl: true, meta: true }, // View Source
        { key: 'c', ctrl: true, meta: true }, // Copy
        { key: 'a', ctrl: true, meta: true }, // Select All
        { key: 'F12' }, // DevTools
        { key: 'i', ctrl: true, shift: true }, // Inspect
        { key: 'j', ctrl: true, shift: true }, // Console
        { key: 'c', ctrl: true, shift: true }, // Inspect (Mac)
      ]

      const isBlocked = blockedKeys.some(blocked => {
        const keyMatch = e.key.toLowerCase() === blocked.key.toLowerCase()
        const ctrlMatch = blocked.ctrl ? (e.ctrlKey || e.metaKey) : true
        return keyMatch && ctrlMatch
      })

      if (isBlocked) {
        e.preventDefault()
        showToast('This action is restricted for protected materials.', 'warning')
        return false
      }
    }

    // 4. Focus/Blur Detection (Privacy Shield)
    const handleFocus = () => setIsWindowFocused(true)
    const handleBlur = () => setIsWindowFocused(false)

    // 5. Right Click & Selection Blocking
    const handleContextMenu = (e) => {
      e.preventDefault()
      showToast('Right-click is disabled on this viewer.', 'warning')
    }

    const handleSelect = (e) => {
      e.preventDefault()
      return false
    }

    // Attach Listeners
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)
    window.addEventListener('resize', detectDevTools)
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('selectstart', handleSelect)
    document.addEventListener('dragstart', handleSelect)

    return () => {
      clearInterval(interval)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('resize', detectDevTools)
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('selectstart', handleSelect)
      document.removeEventListener('dragstart', handleSelect)
    }
  }, [isDevToolsOpen, options])

  return {
    isDevToolsOpen,
    isWindowFocused,
    isProtected: isDevToolsOpen || !isWindowFocused,
    securityStyle: {
      filter: (isDevToolsOpen || !isWindowFocused) ? 'blur(20px)' : 'none',
      transition: 'filter 0.3s ease',
      userSelect: 'none',
      WebkitUserSelect: 'none',
    }
  }
}

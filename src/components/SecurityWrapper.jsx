'use client'

import { useEffect } from 'react'

import { useAuth } from '@/contexts/AuthContext'

const SecurityWrapper = ({ children }) => {
  const { role } = useAuth()

  useEffect(() => {
    // Only apply strict security for students
    if (role === 'user') {
      const handleContextMenu = e => {
        e.preventDefault()
      }

      const handleKeyDown = e => {
        // Disable Ctrl+S, Ctrl+P, Ctrl+U, Ctrl+Shift+I, F12
        if (
          (e.ctrlKey || e.metaKey) &&
          (e.key === 's' || e.key === 'S' || e.key === 'p' || e.key === 'P' || e.key === 'u' || e.key === 'U' || e.key === 'c' || e.key === 'C')
        ) {
          e.preventDefault()
        }

        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j'))
        ) {
          e.preventDefault()
        }
      }

      document.addEventListener('contextmenu', handleContextMenu)
      document.addEventListener('keydown', handleKeyDown)

      return () => {
        document.removeEventListener('contextmenu', handleContextMenu)
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [role])

  return (
    <div className='security-wrapper bs-full'>
      {children}
      <style jsx global>{`
        /* Hide common download/print icons in iframes if any */
        iframe {
          pointer-events: auto;
        }
        @media print {
          body {
            display: none !important;
          }
        }
        /* Disable text selection for students */
        ${role === 'user' ? `
          body {
            user-select: none;
            -webkit-user-select: none;
          }
        ` : ''}
      `}</style>
    </div>
  )
}

export default SecurityWrapper

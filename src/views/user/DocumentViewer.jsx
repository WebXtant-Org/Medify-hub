'use client'

import { useEffect, useState } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import { useAuth } from '@/contexts/AuthContext'

const DocumentViewer = () => {
  const { user, appSettings } = useAuth()
  const [timestamp, setTimestamp] = useState('')

  useEffect(() => {
    setTimestamp(new Date().toLocaleString())

    const interval = setInterval(() => {
      setTimestamp(new Date().toLocaleString())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleContextMenu = e => {
      e.preventDefault()
    }

    const handleKeyDown = e => {
      // Disable Ctrl+S, Ctrl+P, etc.
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === 's' || e.key === 'S' || e.key === 'p' || e.key === 'P' || e.key === 'c' || e.key === 'C')
      ) {
        e.preventDefault()
      }


      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) ||
        (e.ctrlKey && (e.key === 'U' || e.key === 'u'))
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
  }, [])

  return (
    <Card className='bs-[85vh] flex flex-col relative overflow-hidden'>
      <CardContent className='flex-grow p-0 relative bg-[#f0f0f0]'>
        {/* Mock PDF Iframe */}
        <Box className='bs-full is-full flex items-center justify-center relative'>
          <Box className='bs-[90%] is-[80%] bg-white shadow-xl flex flex-col p-10'>
             <Typography variant='h3' className='mb-6 font-bold'>Study Material: Full Stack Web Development</Typography>
             <Typography variant='body1' className='mb-4'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
             </Typography>
             <div className='flex-grow border-t pt-4 mt-4'>
                <Typography variant='h5' className='mb-2'>Module 1: Introduction to Next.js 15</Typography>
                <Typography variant='body2'>
                   This module covers the basics of Next.js 15, including the App Router, Server Components, and more...
                </Typography>
             </div>
             <Typography variant='caption' className='text-center mt-auto border-t pt-2'>
                &copy; 2026 Medify Hub Learning Platform. All rights reserved.
             </Typography>
          </Box>
        </Box>

        {/* Watermark Overlay */}
        {appSettings?.watermarkEnable !== false && (
          <Box
            className='absolute inset-0 pointer-events-none flex flex-wrap items-center justify-around opacity-15 select-none'
            style={{ zIndex: 10 }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className='transform -rotate-45 m-12 text-center'>
                <Typography variant='h6' className='font-bold whitespace-nowrap text-primary' sx={{ opacity: 0.5 }}>
                   {user?.name || 'Student'} - {user?.email || 'student@example.com'}
                </Typography>
                <Typography variant='caption' className='whitespace-nowrap'>{timestamp}</Typography>
              </div>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default DocumentViewer

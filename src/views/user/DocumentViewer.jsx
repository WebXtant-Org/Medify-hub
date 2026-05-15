'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'

import { useAuth } from '@/contexts/AuthContext'
import { studentService } from '@/api/studentServices'
import { showToast } from '@/utils/toast'
 
const DocumentViewer = () => {
  const searchParams = useSearchParams()
  const materialId = searchParams.get('id')
  const router = useRouter()
  
  const { user } = useAuth()
  const [material, setMaterial] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Floating Watermark Position
  const [wmPos, setWmPos] = useState({ top: '30%', left: '30%' })

  const fetchMaterial = useCallback(async () => {
    if (!materialId) return
    try {
      setLoading(true)
      const data = await studentService.getMaterials()
      const current = data.find(m => m._id === materialId)
      setMaterial(current)
    } catch (error) {
      console.error('Failed to fetch material:', error)
    } finally {
      setLoading(false)
    }
  }, [materialId])
 
  useEffect(() => {
    fetchMaterial()
  }, [fetchMaterial])

  // Move watermark randomly every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setWmPos({
        top: `${Math.floor(Math.random() * 70 + 10)}%`,
        left: `${Math.floor(Math.random() * 60 + 5)}%`
      })
    }, 6000)
    return () => clearInterval(interval)
  }, [])
 
  // Professional Security Measures (Stable)
  useEffect(() => {
    const handleContextMenu = e => {
      e.preventDefault()
    }
 
    const handleKeyDown = e => {
      // Block common shortcuts
      if (
        (e.ctrlKey || e.metaKey) &&
        ['p', 's', 'c', 'u', 'a', 'i', 'j', 'k'].includes(e.key.toLowerCase())
      ) {
        e.preventDefault()
        showToast('Action restricted for security.', 'warning')
        return false
      }
      
      // DevTools
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key))) {
        e.preventDefault()
        showToast('Developer tools restricted.', 'error')
      }

      // PrintScreen
      if (e.key === 'PrintScreen' || e.key === 'Snapshot') {
        showToast('Screenshots are strictly prohibited!', 'error')
        navigator.clipboard.writeText('Protected Content - Medify Hub')
      }
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)
 
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
 
  if (loading) {
    return (
      <Box className='bs-full flex items-center justify-center p-12'>
        <CircularProgress />
      </Box>
    )
  }
 
  if (!material) {
    return (
      <Box className='bs-full flex flex-col items-center justify-center p-12 gap-4'>
        <Typography variant='h5'>Material Not Found</Typography>
        <Button variant='contained' onClick={() => router.back()}>Back to Courses</Button>
      </Box>
    )
  }
 
  const isVideo = material.type === 'Video'
  const isPDF = material.type === 'PDF'
 
  return (
    <Box className='bs-full flex flex-col gap-4 relative'>
      {/* Header */}
      <Box className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <IconButton onClick={() => router.back()} color='secondary' className='bg-secondary/10'>
             <i className='tabler-arrow-left' />
          </IconButton>
          <div>
            <Typography variant='h5' className='font-bold leading-tight'>
              {material.title}
            </Typography>
            <Typography variant='caption' color='text.secondary' className='flex items-center gap-1'>
               <i className='tabler-school text-xs' /> {material.courseId?.title || 'Study Material'}
            </Typography>
          </div>
        </div>
        <Box className='flex items-center gap-2'>
           <Chip label="Protected Access" color="error" size="small" variant="tonal" icon={<i className='tabler-shield-lock' />} />
           <Button variant='tonal' size='small' startIcon={<i className='tabler-refresh' />} onClick={() => window.location.reload()}>Refresh</Button>
        </Box>
      </Box>
 
      <Card 
        className='bs-[82vh] flex flex-col relative overflow-hidden select-none border shadow-2xl'
        sx={{ 
          '& *': { userSelect: 'none !important' },
          '@media print': { display: 'none !important' },
          borderRadius: '16px',
          background: '#0f111a'
        }}
      >
        {/* Viewer Toolbar */}
        <Box className='px-6 py-4 bg-[#1a1c27] flex items-center justify-between border-b border-white/5'>
          <div className='flex items-center gap-3'>
            <Avatar variant='rounded' className='bg-primary/20 text-primary'>
               <i className={isPDF ? 'tabler-file-type-pdf' : isVideo ? 'tabler-player-play' : 'tabler-file-text'} />
            </Avatar>
            <div className='flex flex-col'>
              <Typography variant='subtitle2' className='text-white font-bold leading-none'>
                {material.title}
              </Typography>
              <Typography sx={{ fontSize: '10px' }} className='text-blue-400 font-bold mt-1 uppercase'>
                Secure Study Environment
              </Typography>
            </div>
          </div>
          
          <Box className='flex items-center gap-4 bg-white/5 px-4 py-2 rounded-xl border border-white/10'>
              <div className='flex flex-col items-end'>
                <Typography sx={{ fontSize: '8px' }} className='text-gray-500 uppercase'>Student ID</Typography>
                <Typography sx={{ fontSize: '12px' }} className='text-white font-mono'>{user?.studentId}</Typography>
              </div>
              <div className='w-[1px] h-6 bg-white/10' />
              <div className='flex flex-col items-start'>
                <Typography sx={{ fontSize: '8px' }} className='text-gray-500 uppercase'>Name</Typography>
                <Typography sx={{ fontSize: '12px' }} className='text-white font-bold'>{user?.name}</Typography>
              </div>
          </Box>
        </Box>
 
        <CardContent className='flex-grow p-0 relative bg-[#12141c] flex items-center justify-center overflow-hidden'>
          {isPDF ? (
            <Box className='bs-full is-full relative'>
              <iframe
                src={`${material.fileUrl}#toolbar=0&navpanes=0`}
                className='bs-full is-full border-none'
                title={material.title}
              />
            </Box>
          ) : isVideo ? (
            <video 
              controls 
              controlsList="nodownload" 
              disablePictureInPicture
              className='bs-full is-full'
            >
              <source src={material.fileUrl} type="video/mp4" />
            </video>
          ) : (
            <Typography color='white'>Format not supported</Typography>
          )}
 
          {/* Static Grid Watermark */}
          <Box
            className='absolute inset-0 pointer-events-none flex flex-wrap items-center justify-around select-none'
            sx={{ zIndex: 90, opacity: 0.04, overflow: 'hidden' }}
          >
            {Array.from({ length: 25 }).map((_, i) => (
              <Typography key={i} variant='h2' className='transform -rotate-45 m-20 whitespace-nowrap text-white font-black'>
                {user?.studentId}
              </Typography>
            ))}
          </Box>

          {/* Dynamic Floating Watermark */}
          <Box
            className='absolute pointer-events-none select-none transition-all duration-1000 ease-in-out'
            sx={{ 
              zIndex: 200, 
              top: wmPos.top, 
              left: wmPos.left,
              opacity: 0.4
            }}
          >
            <Box className='bg-primary/10 backdrop-blur-md border border-primary/20 px-3 py-1 rounded shadow-2xl'>
               <Typography sx={{ fontSize: '14px' }} className='text-white font-black tracking-tighter'>
                  {user?.studentId}
               </Typography>
               <Typography sx={{ fontSize: '9px' }} className='text-white/60 font-medium'>
                  {user?.name}
               </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
 
export default DocumentViewer

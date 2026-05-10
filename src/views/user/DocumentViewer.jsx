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

import { useAuth } from '@/contexts/AuthContext'
import { studentService } from '@/api/studentServices'
import { showToast } from '@/utils/toast'
 
const DocumentViewer = () => {
  const searchParams = useSearchParams()
  const materialId = searchParams.get('id')
  const router = useRouter()
  
  const { user, appSettings } = useAuth()
  const [timestamp, setTimestamp] = useState('')
  const [material, setMaterial] = useState(null)
  const [loading, setLoading] = useState(true)
 
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
 
  useEffect(() => {
    setTimestamp(new Date().toLocaleString())
    const interval = setInterval(() => setTimestamp(new Date().toLocaleString()), 1000)
    return () => clearInterval(interval)
  }, [])
 
  // Security Measures
  useEffect(() => {
    const handleContextMenu = e => {
      e.preventDefault()
      showToast('Right-click is disabled for security.', 'warning')
    }
 
    const handleKeyDown = e => {
      // Disable Print (Ctrl+P), Save (Ctrl+S), Copy (Ctrl+C), DevTools (F12)
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === 'p' || e.key === 's' || e.key === 'c' || e.key === 'u' || e.key === 'a')
      ) {
        e.preventDefault()
        showToast(`Action '${e.key.toUpperCase()}' is restricted for this document.`, 'error')
      }
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C'))) {
        e.preventDefault()
        showToast('Developer tools are disabled.', 'error')
      }
    }
 
    // Attempt to block Print Screen (limited support)
    const handleKeyUp = e => {
      if (e.key === 'PrintScreen') {
        showToast('Screenshots are strictly prohibited!', 'error')
      }
    }
 
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
 
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
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
        <Typography color='text.secondary'>The requested study material does not exist or you don't have access.</Typography>
        <IconButton onClick={() => router.back()} color='primary'>
           <i className='tabler-arrow-left' /> Back
        </IconButton>
      </Box>
    )
  }
 
  const isVideo = material.type === 'Video'
  const isPDF = material.type === 'PDF'
 
  return (
    <Box className='bs-full flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <div className='flex gap-2'>
          <Button 
            variant='tonal' 
            color='info' 
            size='small' 
            startIcon={<i className='tabler-refresh' />}
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
          <IconButton onClick={() => router.back()} variant='tonal' color='secondary'>
             <i className='tabler-x' />
          </IconButton>
        </div>
      </div>
 
      <Card className='bs-[85vh] flex flex-col relative overflow-hidden select-none border shadow-lg' sx={{ 
        '& *': { userSelect: 'none !important' },
        '@media print': { display: 'none !important' },
        borderRadius: '12px'
      }}>
        {/* Professional Viewer Header */}
        <Box className='px-6 py-3 bg-[#232734] border-b border-gray-700 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-[#7367f022] rounded-lg'>
               <i className='tabler-file-text text-[#7367f0]' />
            </div>
            <div>
              <Typography variant='subtitle1' className='text-white font-bold leading-none'>
                {material.title}
              </Typography>
              <Typography variant='caption' className='text-gray-400'>
                Secure Viewer Mode
              </Typography>
            </div>
          </div>
          <div className='flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full'>
            <i className='tabler-shield-lock text-red-500 text-xs' />
            <Typography sx={{ fontSize: '10px' }} className='text-red-500 font-bold uppercase tracking-wider'>
              Protected Content
            </Typography>
          </div>
        </Box>
 
        <CardContent className='flex-grow p-0 relative bg-[#2f3349]'>
          {isPDF ? (
            <Box className='bs-full is-full relative'>
              <iframe
                src={`${material.fileUrl}#toolbar=0`}
                className='bs-full is-full border-none'
                title={material.title}
                style={{ backgroundColor: 'white' }}
              />
            </Box>
          ) : isVideo ? (
            <video 
              controls 
              controlsList="nodownload" 
              className='bs-full is-full'
              style={{ objectFit: 'contain' }}
            >
              <source src={material.fileUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className='flex items-center justify-center bs-full'>
              <Typography color='white'>Preview not available for this file type.</Typography>
            </div>
          )}
 
          {/* High Security Watermark Overlay */}
          {appSettings?.watermarkEnable !== false && (
            <Box
              className='absolute inset-0 pointer-events-none flex flex-wrap items-center justify-around select-none'
              sx={{ 
                zIndex: 100, 
                opacity: 0.1,
                overflow: 'hidden'
              }}
            >
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className='transform -rotate-45 m-20 text-center pointer-events-none'>
                  <Typography 
                    variant='h2' 
                    className='font-black whitespace-nowrap text-white' 
                    sx={{ 
                      fontSize: '4rem !important',
                      letterSpacing: '8px',
                      opacity: 0.5,
                      textShadow: '0px 0px 20px rgba(255,255,255,0.2)'
                    }}
                  >
                    MEDIFY HUB
                  </Typography>
                  <Typography 
                    variant='h6' 
                    className='whitespace-nowrap text-white font-bold'
                    sx={{ opacity: 0.4 }}
                  >
                    {user?.name} | {user?.studentId}
                  </Typography>
                </div>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
      
      <Box className='flex flex-col items-center gap-1'>
        <Typography variant='caption' color='text.secondary'>
          If the document fails to load, please use the <b>Open in New Tab</b> button at the top right.
        </Typography>
        <Typography variant='caption' color='error' className='text-center flex items-center justify-center gap-1 font-medium'>
          <i className='tabler-shield-lock' />
          Secure Content: Printing and Screenshots are strictly prohibited.
        </Typography>
      </Box>
    </Box>
  )
}

export default DocumentViewer

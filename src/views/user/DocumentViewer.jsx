'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'

import { useAuth } from '@/contexts/AuthContext'
import { studentService } from '@/api/studentServices'

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
    const handleContextMenu = e => e.preventDefault()
    const handleKeyDown = e => {
      // Disable Print (Ctrl+P), Save (Ctrl+S), Copy (Ctrl+C), DevTools (F12)
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === 'p' || e.key === 's' || e.key === 'c' || e.key === 'u' || e.key === 'a')
      ) {
        e.preventDefault()
      }
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C'))) {
        e.preventDefault()
      }
    }

    // Attempt to block Print Screen (limited support)
    const handleKeyUp = e => {
      if (e.key === 'PrintScreen') {
        try {
          // Just show alert, clearing clipboard often fails due to permissions
          alert('Screenshots are not allowed for this document.')
        } catch (err) {
          console.error('Clipboard/Alert error:', err)
        }
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

  // Google Docs Viewer URL for PDFs, direct link for others
  const isVideo = material.type === 'Video'
  const isPDF = material.type === 'PDF'

  const viewerUrl = isPDF 
    ? `https://docs.google.com/viewer?url=${encodeURIComponent(material.fileUrl)}&embedded=true`
    : material.fileUrl

  return (
    <Box className='bs-full flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <div>
          <Typography variant='h4'>{material.title}</Typography>
          <Typography variant='body2' color='text.secondary'>{material.description}</Typography>
        </div>
        <IconButton onClick={() => router.back()} variant='tonal' color='secondary'>
           <i className='tabler-x' />
        </IconButton>
      </div>

      <Card className='bs-[80vh] flex flex-col relative overflow-hidden select-none' sx={{ 
        '& *': { userSelect: 'none !important' },
        '@media print': { display: 'none !important' }
      }}>
        <CardContent className='flex-grow p-0 relative bg-[#2f3349]'>
          {isPDF ? (
            <iframe
              src={`${viewerUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className='bs-full is-full border-none'
              title={material.title}
              style={{ filter: 'contrast(1.1)' }}
            />
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
              <Button href={material.fileUrl} target='_blank' color='primary' className='ml-4'>
                Download/View Original
              </Button>
            </div>
          )}

          {/* High Security Watermark Overlay */}
          {appSettings?.watermarkEnable !== false && (
            <Box
              className='absolute inset-0 pointer-events-none flex flex-wrap items-center justify-around opacity-20 select-none'
              style={{ zIndex: 10 }}
            >
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className='transform -rotate-45 m-16 text-center'>
                  <Typography 
                    variant='h6' 
                    className='font-bold whitespace-nowrap text-white' 
                    sx={{ 
                      textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                      fontSize: '1rem' 
                    }}
                  >
                    {user?.name} | {user?.email}
                  </Typography>
                  <Typography 
                    variant='caption' 
                    className='whitespace-nowrap text-white'
                    sx={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
                  >
                    {timestamp}
                  </Typography>
                </div>
              ))}
            </Box>
          )}

          {/* Shield Overlay to prevent direct right-click on iframe */}
          <div className='absolute inset-0 z-0 bg-transparent' />
        </CardContent>
      </Card>
      
      <Typography variant='caption' color='error' className='text-center flex items-center justify-center gap-1'>
        <i className='tabler-shield-lock' />
        Secure Content: Downloading and Screenshots are strictly prohibited and monitored.
      </Typography>
    </Box>
  )
}

export default DocumentViewer

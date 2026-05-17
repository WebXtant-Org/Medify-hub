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

const DocumentViewer = () => {
  const searchParams = useSearchParams()
  const materialId = searchParams.get('id')
  const router = useRouter()
  
  const { user } = useAuth()
  const [material, setMaterial] = useState(null)
  const [loading, setLoading] = useState(true)

  // 1. Fetch Material Data
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

  // 2. Front-end Copy & Security Protection
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault()
    
    const handleKeyDown = (e) => {
      // Block Ctrl+C, Ctrl+P, Ctrl+S, Ctrl+U, F12
      if (
        (e.ctrlKey && ['c', 'p', 's', 'u'].includes(e.key.toLowerCase())) ||
        e.key === 'F12' ||
        e.key === 'PrintScreen'
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

  if (loading) {
    return (
      <Box className='bs-full flex items-center justify-center p-12 min-h-[60vh]'>
        <CircularProgress />
      </Box>
    )
  }
 
  if (!material) {
    return (
      <Box className='bs-full flex flex-col items-center justify-center p-12 gap-4 min-h-[60vh]'>
        <Typography variant='h5'>Material Not Found</Typography>
        <Button variant='contained' onClick={() => router.back()}>Back to Courses</Button>
      </Box>
    )
  }
 
  const isVideo = material.type === 'Video'
  const isPDF = material.type === 'PDF'

  const isGoogleDrive = material.fileUrl?.includes('drive.google.com') || material.fileUrl?.includes('docs.google.com')
  const iframeSrc = isGoogleDrive ? material.fileUrl : `${material.fileUrl}#toolbar=0`

  return (
    <Box className='bs-full flex flex-col gap-4 relative' sx={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
      {/* Dynamic Header */}
      <Box className='flex items-center justify-between flex-wrap gap-4'>
        <div className='flex items-center gap-3'>
          <IconButton onClick={() => router.back()} color='secondary' className='bg-secondary/10 hover:bg-secondary/20 rounded-xl'>
             <i className='tabler-arrow-left' />
          </IconButton>
          <div>
            <Typography variant='h5' className='font-black leading-tight'>
              {material.title}
            </Typography>
            <Typography variant='caption' color='text.secondary' className='flex items-center gap-1 font-bold'>
               <i className='tabler-school text-xs' /> {material.courseId?.title || 'Study Material'}
            </Typography>
          </div>
        </div>
      </Box>
 
      <Box 
        className='w-full overflow-hidden'
        sx={{ 
          height: '85vh',
          borderRadius: '16px',
          background: 'transparent'
        }}
      >
        {isPDF ? (
          <iframe
            src={iframeSrc}
            className='w-full h-full border-none'
            title={material.title}
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        ) : isVideo ? (
          <Box className='w-full h-full flex items-center justify-center bg-black rounded-2xl overflow-hidden'>
            <video 
              controls 
              className='w-full max-h-[80vh] bg-black'
            >
              <source src={material.fileUrl} type="video/mp4" />
              Your browser does not support HTML5 video streams.
            </video>
          </Box>
        ) : (
          <Typography color='text.secondary'>Format not supported</Typography>
        )}
      </Box>
    </Box>
  )
}
 
export default DocumentViewer

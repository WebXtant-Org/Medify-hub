'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
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
  
  // Custom PDF.js States
  const [pdfjsLoaded, setPdfjsLoaded] = useState(false)
  const [pdfDoc, setPdfDoc] = useState(null)
  const [pageNum, setPageNum] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [scale, setScale] = useState(1.2)
  const [pageRendering, setPageRendering] = useState(false)
  const [canvasError, setCanvasError] = useState(false)
  const canvasRef = useRef(null)

  // Floating Watermark Position
  const [wmPos, setWmPos] = useState({ top: '30%', left: '30%' })
  
  // High-Security Window Focus DRM State
  const [isFocused, setIsFocused] = useState(true)

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

  // 2. Load PDF.js script dynamically from CDN
  useEffect(() => {
    if (material && material.type === 'PDF') {
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js'
      script.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js'
        setPdfjsLoaded(true)
      }
      script.onerror = () => {
        console.error('Failed to load PDF.js from CDN')
        setCanvasError(true) // Fallback to iframe if CDN fails
      }
      document.body.appendChild(script)
      return () => {
        document.body.removeChild(script)
      }
    }
  }, [material])

  // 3. Render PDF Page on Canvas when PDF.js is loaded
  const renderPage = useCallback((num, pdfInstance = pdfDoc) => {
    if (!pdfInstance || !canvasRef.current) return
    setPageRendering(true)

    pdfInstance.getPage(num).then((page) => {
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      
      const viewport = page.getViewport({ scale: scale })
      canvas.height = viewport.height
      canvas.width = viewport.width

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      }

      const renderTask = page.render(renderContext)
      renderTask.promise.then(() => {
        setPageRendering(false)
      }).catch(err => {
        console.error('Error during canvas page rendering:', err)
        setPageRendering(false)
      })
    }).catch(err => {
      console.error('Error getting page:', err)
      setPageRendering(false)
    })
  }, [pdfDoc, scale])

  // 4. Initialize PDF document
  useEffect(() => {
    if (pdfjsLoaded && material && material.type === 'PDF' && !canvasError) {
      const loadingTask = window.pdfjsLib.getDocument(material.fileUrl)
      loadingTask.promise.then((pdf) => {
        setPdfDoc(pdf)
        setTotalPages(pdf.numPages)
        setPageNum(1)
      }).catch(err => {
        console.error('PDF.js failed to fetch document (e.g. CORS). Falling back to Secure Iframe mode:', err)
        setCanvasError(true) // Graceful fallback
      })
    }
  }, [pdfjsLoaded, material, canvasError])

  // 5. Re-render page when pageNum or scale (zoom) changes
  useEffect(() => {
    if (pdfDoc) {
      renderPage(pageNum)
    }
  }, [pageNum, scale, pdfDoc, renderPage])

  // 6. Move watermark randomly every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setWmPos({
        top: `${Math.floor(Math.random() * 70 + 15)}%`,
        left: `${Math.floor(Math.random() * 60 + 5)}%`
      })
    }, 6000)
    return () => clearInterval(interval)
  }, [])
 
  // 7. Keyboard, print-screen, context-menu restrictions
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

  // 8. Focus & Visibility DRM Restrictions (Screenshots prevention)
  useEffect(() => {
    const handleFocus = () => {
      setIsFocused(true)
    }

    const handleBlur = () => {
      setIsFocused(false)
      // Instantly wipe clipboard if Snipping Tool or screenshot software takes focus
      navigator.clipboard.writeText('Protected Content - Medify Hub').catch(() => {
        // Fail silently if browser blocks clipboard access when document loses focus
      })
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setIsFocused(false)
        navigator.clipboard.writeText('Protected Content - Medify Hub').catch(() => {
          // Fail silently
        })
      } else {
        setIsFocused(true)
      }
    }

    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // 9. Advanced DevTools / Inspect Resize & Debugger Detection
  useEffect(() => {
    const threshold = 160
    
    const triggerViolation = (reason) => {
      setCanvasError(true)
      showToast(`Security Shield Active: ${reason}`, 'error')
    }

    const checkResize = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > threshold
      const heightThreshold = window.outerHeight - window.innerHeight > threshold
      
      if (widthThreshold || heightThreshold) {
        triggerViolation('Window resized (possible Inspect Tool open).')
      }
    }

    // Intercept console image property checking (extremely stable devtools open trigger)
    const element = new Image()
    Object.defineProperty(element, 'id', {
      get: () => {
        triggerViolation('Developer Tools detected.')
        throw new Error('DevTools Detected')
      }
    })

    const consoleTimer = setInterval(() => {
      console.log(element)
      console.clear()
    }, 2000)

    window.addEventListener('resize', checkResize)
    checkResize()

    return () => {
      clearInterval(consoleTimer)
      window.removeEventListener('resize', checkResize)
    }
  }, [])

  // Page Nav Functions
  const handlePrevPage = () => {
    if (pageNum <= 1) return
    setPageNum(prev => prev - 1)
  }

  const handleNextPage = () => {
    if (pageNum >= totalPages) return
    setPageNum(prev => prev + 1)
  }

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 2.5))
  }

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.6))
  }

  const handleFitWidth = () => {
    setScale(1.2)
  }

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error('Error attempting to enable full-screen mode:', err)
      })
    } else {
      document.exitFullscreen()
    }
  }
 
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
  const useCanvasViewer = isPDF && !canvasError

  return (
    <Box className='bs-full flex flex-col gap-4 relative'>
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
        <Box className='flex items-center gap-2'>
           <Chip label={useCanvasViewer ? "HTML5 SECURE CANVASES" : "DRM SECURE STREAM"} color="success" size="small" variant="tonal" icon={<i className='tabler-lock text-xs' />} className="font-bold text-[10px]" />
           <Chip label="Protected Access" color="error" size="small" variant="tonal" icon={<i className='tabler-shield-lock text-xs' />} className="font-bold text-[10px]" />
           <Button variant='tonal' size='small' startIcon={<i className='tabler-refresh' />} onClick={() => window.location.reload()} className="font-bold text-xs">Refresh</Button>
        </Box>
      </Box>
 
      <Card 
        className='bs-[82vh] flex flex-col relative overflow-hidden select-none border border-white/5 shadow-2xl'
        sx={{ 
          '& *': { userSelect: 'none !important' },
          '@media print': { display: 'none !important' },
          borderRadius: '24px',
          background: '#0a0c14'
        }}
      >
        {/* DRM Secured Dark-Mode Toolbar */}
        <Box className='px-6 py-4 bg-[#121420] flex flex-wrap items-center justify-between border-b border-white/5 gap-4'>
          <div className='flex items-center gap-3'>
            <Avatar variant='rounded' className='bg-primary/10 text-primary border border-white/5'>
               <i className={isPDF ? 'tabler-file-type-pdf text-xl' : isVideo ? 'tabler-player-play text-xl' : 'tabler-file-text text-xl'} />
            </Avatar>
            <div className='flex flex-col'>
              <Typography variant='subtitle2' className='text-white font-black leading-none mb-1'>
                {material.title}
              </Typography>
              <Typography sx={{ fontSize: '9px' }} className='text-primary font-black uppercase tracking-widest'>
                HIGH SECURITY DRM VAULT ACTIVE
              </Typography>
            </div>
          </div>
          
          {/* Custom PDF Controls (Only if Canvas renderer is active) */}
          {useCanvasViewer && (
            <Box className='flex items-center gap-4 bg-white/5 border border-white/10 px-4 py-1.5 rounded-xl backdrop-blur'>
              {/* Previous Page */}
              <IconButton size='small' onClick={handlePrevPage} disabled={pageNum <= 1} className='text-white disabled:text-gray-600'>
                <i className='tabler-arrow-left text-sm' />
              </IconButton>
              
              {/* Page Indicator */}
              <Typography variant='caption' className='text-white font-bold tracking-tight text-[11px] font-mono'>
                Page {pageNum} / {totalPages || 1}
              </Typography>
              
              {/* Next Page */}
              <IconButton size='small' onClick={handleNextPage} disabled={pageNum >= totalPages} className='text-white disabled:text-gray-600'>
                <i className='tabler-arrow-right text-sm' />
              </IconButton>

              <div className='w-[1px] h-4 bg-white/10' />

              {/* Zoom Out */}
              <IconButton size='small' onClick={handleZoomOut} disabled={scale <= 0.6} className='text-white disabled:text-gray-600'>
                <i className='tabler-minus text-sm' />
              </IconButton>

              {/* Zoom Label */}
              <Chip label={`${Math.round(scale * 100)}%`} size='small' className='bg-white/10 text-white text-[10px] font-black font-mono' />

              {/* Zoom In */}
              <IconButton size='small' onClick={handleZoomIn} disabled={scale >= 2.5} className='text-white disabled:text-gray-600'>
                <i className='tabler-plus text-sm' />
              </IconButton>

              <div className='w-[1px] h-4 bg-white/10' />

              {/* Fit Width */}
              <IconButton size='small' onClick={handleFitWidth} className='text-white' title="Reset Zoom">
                <i className='tabler-arrows-maximize text-sm' />
              </IconButton>

              <div className='w-[1px] h-4 bg-white/10' />

              {/* Fullscreen Toggle */}
              <IconButton size='small' onClick={handleFullscreen} className='text-white' title="Toggle Fullscreen">
                <i className='tabler-maximize text-sm' />
              </IconButton>
            </Box>
          )}

          {/* Student DRM Badge */}
          <Box className='flex items-center gap-4 bg-white/5 px-4 py-2 rounded-xl border border-white/10 backdrop-blur'>
              <div className='flex flex-col items-end'>
                <Typography sx={{ fontSize: '7px' }} className='text-gray-500 uppercase tracking-widest font-black'>Student ID</Typography>
                <Typography sx={{ fontSize: '12px' }} className='text-white font-mono font-black'>{user?.studentId || 'N/A'}</Typography>
              </div>
              <div className='w-[1px] h-6 bg-white/10' />
              <div className='flex flex-col items-start'>
                <Typography sx={{ fontSize: '7px' }} className='text-gray-500 uppercase tracking-widest font-black'>Name</Typography>
                <Typography sx={{ fontSize: '12px' }} className='text-white font-black'>{user?.name || 'Student'}</Typography>
              </div>
          </Box>
        </Box>
 
        {/* Render Viewer Box */}
        <CardContent 
          className='flex-grow p-0 relative bg-[#0b0c13] flex items-center justify-center overflow-auto select-none'
          onDragStart={(e) => e.preventDefault()}
          sx={{
            filter: isFocused ? 'none' : 'blur(25px) grayscale(100%)',
            transition: 'filter 0.2s ease-in-out',
            pointerEvents: isFocused ? 'auto' : 'none'
          }}
        >
          
          {/* Loss of Focus / Snipping Tool Shield Message overlay */}
          {!isFocused && (
            <Box className='absolute inset-0 flex flex-col items-center justify-center bg-black/85 z-[300] p-6 text-center select-none pointer-events-none'>
              <Avatar className='bg-error/10 text-error bs-16 is-16 mb-4 animate-pulse border border-error/20'>
                <i className='tabler-shield-lock text-4xl' />
              </Avatar>
              <Typography variant='h4' className='text-white font-black mb-2 tracking-tight'>
                PROTECTED VAULT SHIELDED
              </Typography>
              <Typography variant='body2' className='text-gray-400 max-w-[320px] leading-relaxed text-xs'>
                Screen capture or Snipping Tool action detected. Focus lost. Page contents have been automatically shielded.
              </Typography>
            </Box>
          )}

          {/* DRM CANVAS VIEWER ENGINE (Absolutely Protected, No Printing, No Saving) */}
          {useCanvasViewer ? (
            <Box className='relative my-4 flex items-center justify-center shadow-2xl border border-white/5 rounded-lg overflow-hidden' sx={{ pointerEvents: 'none' }}>
              {pageRendering && (
                <Box className='absolute inset-0 flex items-center justify-center bg-black/60 z-50 rounded-lg'>
                  <CircularProgress size={30} />
                </Box>
              )}
              <canvas ref={canvasRef} className='max-w-full h-auto bg-white rounded-lg shadow-inner' />
            </Box>
          ) : isPDF ? (
            /* Secure Iframe Failsafe (If CORS prevents canvas download or CDN fails) */
            <Box className='bs-full is-full relative'>
              <iframe
                src={`${material.fileUrl}#toolbar=0&navpanes=0`}
                className='bs-full is-full border-none'
                title={material.title}
              />
            </Box>
          ) : isVideo ? (
            /* Protected Video Stream */
            <video 
              controls 
              controlsList="nodownload" 
              disablePictureInPicture
              className='bs-full is-full max-h-[70vh] bg-black'
            >
              <source src={material.fileUrl} type="video/mp4" />
              Your browser does not support secure HTML5 video streams.
            </video>
          ) : (
            <Typography color='white'>Protected format not supported</Typography>
          )}
 
          {/* DRM Watermark Grid Layer 1 */}
          <Box
            className='absolute inset-0 pointer-events-none flex flex-wrap items-center justify-around select-none'
            sx={{ zIndex: 90, opacity: 0.04, overflow: 'hidden' }}
          >
            {Array.from({ length: 30 }).map((_, i) => (
              <Typography key={i} variant='h2' className='transform -rotate-45 m-16 whitespace-nowrap text-white font-black tracking-tight'>
                {user?.studentId}
              </Typography>
            ))}
          </Box>

          {/* Dynamic Shifting Floating Watermark Box (Extremely hard to bypass on screen-recording) */}
          <Box
            className='absolute pointer-events-none select-none transition-all duration-1000 ease-in-out'
            sx={{ 
              zIndex: 200, 
              top: wmPos.top, 
              left: wmPos.left,
              opacity: 0.35
            }}
          >
            <Box className='bg-primary/10 backdrop-blur-md border border-primary/20 px-3 py-1.5 rounded-lg shadow-2xl flex flex-col items-center justify-center min-w-[120px]'>
               <Typography sx={{ fontSize: '13px' }} className='text-white font-black tracking-tighter font-mono leading-none mb-1'>
                  {user?.studentId}
               </Typography>
               <Typography sx={{ fontSize: '8px' }} className='text-white/60 font-black uppercase tracking-wider leading-none'>
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

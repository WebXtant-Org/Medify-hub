'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Box, Typography, CircularProgress, IconButton, Button } from '@mui/material'
import { useSecurity } from '@/hooks/useSecurity'
import { useAuth } from '@/contexts/AuthContext'

// Lazy load react-pdf to avoid SSR issues
const Document = dynamic(() => import('react-pdf').then(mod => mod.Document), { ssr: false })
const Page = dynamic(() => import('react-pdf').then(mod => mod.Page), { ssr: false })
import { pdfjs } from 'react-pdf'

// Set worker path from public folder (Most reliable for Next.js/Turbopack)
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs'

const ProtectedViewer = ({ materialId, type, title }) => {
  const { user } = useAuth()
  const { securityStyle, isProtected } = useSecurity()
  
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [blobUrl, setBlobUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timestamp, setTimestamp] = useState(new Date().toLocaleString())

  // Fetch material as blob
  useEffect(() => {
    const fetchBlob = async () => {
      try {
        setLoading(true)
        const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || ''
        const response = await fetch(`${BASE_URL}/materials/${materialId}/view`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        if (!response.ok) throw new Error('Failed to fetch material')
        
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        setBlobUrl(url)
      } catch (error) {
        console.error('Fetch Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlob()
    
    // Cleanup
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl)
    }
  }, [materialId])

  useEffect(() => {
    const interval = setInterval(() => setTimestamp(new Date().toLocaleString()), 2000)
    return () => clearInterval(interval)
  }, [])

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
    setPageNumber(1)
  }

  if (loading) return <Box className='flex items-center justify-center p-12'><CircularProgress /></Box>

  return (
    <Box className='relative overflow-hidden bg-[#1a1c23] rounded-xl shadow-2xl' sx={{ height: '85vh' }}>
      
      {/* 1. Header Control Bar */}
      <Box className='px-6 py-3 bg-[#232734] border-b border-gray-700 flex items-center justify-between z-50'>
        <div className='flex items-center gap-3'>
          <Typography variant='subtitle1' className='text-white font-bold'>{title}</Typography>
          <Box className='px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded-md'>
            <Typography sx={{ fontSize: '10px' }} className='text-red-500 font-bold uppercase'>Protected</Typography>
          </Box>
        </div>
        
        {type === 'PDF' && numPages && (
          <div className='flex items-center gap-4'>
            <Button 
              size='small' 
              disabled={pageNumber <= 1} 
              onClick={() => setPageNumber(prev => prev - 1)}
              variant='tonal'
              className='text-white'
            >Previous</Button>
            <Typography variant='caption' className='text-gray-400'>Page {pageNumber} of {numPages}</Typography>
            <Button 
              size='small' 
              disabled={pageNumber >= numPages} 
              onClick={() => setPageNumber(prev => prev + 1)}
              variant='tonal'
              className='text-white'
            >Next</Button>
          </div>
        )}
      </Box>

      {/* 2. Main Content Area */}
      <Box 
        className='relative flex-grow flex items-start justify-center overflow-auto p-4 custom-scrollbar' 
        style={securityStyle}
      >
        {type === 'PDF' ? (
          <Document
            file={blobUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<CircularProgress color="inherit" />}
            className="shadow-2xl"
          >
            <Page 
              pageNumber={pageNumber} 
              renderTextLayer={false} 
              renderAnnotationLayer={false}
              scale={1.5}
            />
          </Document>
        ) : type === 'Video' ? (
          <video 
            src={blobUrl} 
            controls 
            controlsList="nodownload noplaybackrate" 
            disablePictureInPicture
            className='max-w-full max-h-full outline-none'
          />
        ) : (
          <img src={blobUrl} className='max-w-full max-h-full object-contain' alt="Protected" />
        )}

        {/* 3. Advanced Dynamic Watermark Engine */}
        <Box 
          className='absolute inset-0 pointer-events-none z-[100] flex flex-wrap items-center justify-around overflow-hidden'
          sx={{ opacity: 0.15 }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className='transform -rotate-45 m-24 text-center pointer-events-none whitespace-nowrap'>
              <Typography variant='h2' className='font-black text-white' sx={{ fontSize: '3rem !important', letterSpacing: '4px' }}>
                MEDIFY HUB
              </Typography>
              <Typography variant='h6' className='text-white font-bold'>
                {user?.name} | {user?.email}
              </Typography>
              <Typography variant='caption' className='text-gray-300 block'>
                {user?.studentId} | {timestamp}
              </Typography>
              <Typography variant='caption' className='text-gray-500 block uppercase tracking-widest'>
                UNAUTHORIZED ACCESS PROHIBITED
              </Typography>
            </div>
          ))}
        </Box>
      </Box>

      {/* 4. Security Shield Overlay (Privacy/DevTools) */}
      {isProtected && (
        <Box className='absolute inset-0 z-[200] flex flex-col items-center justify-center bg-[#1a1c23ef] backdrop-blur-3xl p-12 text-center animate-fade-in'>
          <Box className='w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 animate-pulse'>
            <i className='tabler-shield-lock text-red-500 text-5xl' />
          </Box>
          <Typography variant='h4' className='text-white font-black mb-4'>PROTECTED CONTENT</Typography>
          <Typography className='text-gray-400 max-w-md mx-auto mb-8 leading-relaxed'>
            For security reasons, this material is hidden while the window is inactive or developer tools are open. 
            Unauthorized capture attempts are logged.
          </Typography>
          <Typography variant='subtitle2' className='text-[#7367f0] font-bold animate-bounce'>
            CLICK INSIDE TO RESUME SECURE VIEWING
          </Typography>
        </Box>
      )}

      {/* 5. Custom Styling */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #1a1c23; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3a3e4b; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4a4e5b; }
        
        canvas {
          margin: 0 auto;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5) !important;
          border-radius: 8px;
        }

        @media print {
          body * { visibility: hidden !important; }
          .protected-viewer { display: none !important; }
        }
      `}</style>
    </Box>
  )
}

export default ProtectedViewer

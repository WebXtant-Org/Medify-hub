'use client'

import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'

const MediaPreview = ({ src, alt, type = 'image', className = '' }) => {
  const [open, setOpen] = useState(false)
  const isVideo = src?.toLowerCase().endsWith('.mp4') || src?.includes('video/upload')

  const handleOpen = (e) => {
    e.stopPropagation()
    setOpen(true)
  }

  const handleClose = (e) => {
    e.stopPropagation()
    setOpen(false)
  }

  return (
    <>
      <Box 
        onClick={handleOpen}
        sx={{ 
          cursor: 'pointer', 
          width: '50px', 
          height: '50px', 
          borderRadius: '4px', 
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          border: '1px solid #ddd'
        }}
        className={className}
      >
        {isVideo ? (
          <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <video src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
            <Box sx={{ position: 'absolute', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className='tabler-player-play text-white' style={{ fontSize: '14px' }} />
            </Box>
          </Box>
        ) : (
          <img 
            src={src} 
            alt={alt} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            onError={(e) => { e.target.src = '/images/placeholder.png' }}
          />
        )}
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
        <DialogContent sx={{ p: 0, position: 'relative', backgroundColor: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <IconButton 
            onClick={handleClose} 
            sx={{ position: 'absolute', right: 8, top: 8, color: '#fff', zIndex: 1, backgroundColor: 'rgba(0,0,0,0.5)', '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' } }}
          >
            <i className='tabler-x' />
          </IconButton>
          
          {isVideo ? (
            <video src={src} style={{ width: '100%', maxHeight: '80vh' }} controls autoPlay />
          ) : (
            <img src={src} alt={alt} style={{ width: '100%', height: 'auto', maxHeight: '80vh', objectFit: 'contain' }} />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default MediaPreview

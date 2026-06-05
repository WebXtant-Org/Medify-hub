'use client'

import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, minLength, pipe } from 'valibot'

import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import CustomButton from '@components/CustomButton'
import { galleryService } from '@/api/adminServices'
import { showToast } from '@/utils/toast'

const gallerySchema = object({
  title: pipe(string(), minLength(1, 'Title is required')),
  category: pipe(string(), minLength(1, 'Category is required'))
})

const GalleryDialog = ({ open, handleClose, refreshData }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: valibotResolver(gallerySchema),
    defaultValues: {
      title: '',
      category: 'general'
    }
  })

  const onSubmit = async (data) => {
    if (!selectedFile) {
      showToast('Please select an image', 'error')
      return
    }

    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('category', data.category)
      formData.append('image', selectedFile)

      await galleryService.create(formData)
      showToast('Image uploaded successfully!')
      refreshData()
      handleClose()
      reset()
      setSelectedFile(null)
    } catch (err) {
      showToast(err.message || 'Upload failed', 'error')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const fileSizeInMB = file.size / (1024 * 1024)
      if (fileSizeInMB > 10) {
        showToast('File size must be less than 10 MB', 'error')
        e.target.value = ''
        return
      }
      setSelectedFile(file)
    }
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth='sm' 
      fullWidth 
      scroll='body'
      PaperProps={{ sx: { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={handleClose} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      
      <DialogTitle sx={{ textAlign: 'center', pbe: 4 }}>
        <Typography variant='h5' component='span'>Upload New Image</Typography>
        <Typography variant='body2' color='text.secondary'>
          Select a file and category to add to the site gallery
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pbs: 0 }}>
          <Grid container spacing={5}>
            <Grid size={{ xs: 12 }}>
              <Controller
                name='title'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Image Title'
                    placeholder='e.g. Lab Session'
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    required
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant='body2' sx={{ mb: 1 }}>Gallery Image *</Typography>
              <div className='flex items-center gap-4 border p-3 rounded'>
                <Button component='label' variant='tonal' size='small' startIcon={<i className='tabler-upload' />}>
                  Choose Image
                  <input type='file' hidden accept='image/*' onChange={handleFileChange} />
                </Button>
                <Typography variant='caption'>
                  {selectedFile ? selectedFile.name : 'No file selected'}
                </Typography>
              </div>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name='category'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Category'
                    placeholder='e.g. Campus, Event'
                    error={!!errors.category}
                    helperText={errors.category?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pbe: 8 }}>
          <Button variant='contained' type='submit' disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Upload to Gallery'}
          </Button>
          <Button variant='tonal' color='secondary' onClick={handleClose}>
            Discard
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default GalleryDialog

'use client'

import { useState, useEffect } from 'react'
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
import { achieverService } from '@/api/adminServices'
import { showToast } from '@/utils/toast'

const achieverSchema = object({
  name: pipe(string(), minLength(1, 'Name is required')),
  year: pipe(string(), minLength(1, 'Year is required'))
})

const AchieverDialog = ({ open, handleClose, achiever, refreshData }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: valibotResolver(achieverSchema),
    defaultValues: {
      name: '',
      year: new Date().getFullYear().toString()
    }
  })

  useEffect(() => {
    if (achiever && open) {
      reset({
        name: achiever.name || '',
        year: achiever.year || ''
      })
    } else if (!achiever && open) {
      reset({
        name: '',
        year: new Date().getFullYear().toString()
      })
      setSelectedFile(null)
    }
  }, [achiever, open, reset])

  const onSubmit = async (data) => {
    if (!selectedFile && !achiever) {
      showToast('Please select a photo', 'error')
      return
    }

    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('year', data.year)
      
      if (selectedFile) {
        formData.append('image', selectedFile)
      }

      if (achiever) {
        await achieverService.update(achiever._id, formData)
        showToast('Achiever record updated!')
      } else {
        await achieverService.create(formData)
        showToast('Achiever record added!')
      }
      refreshData()
      handleClose()
      reset()
      setSelectedFile(null)
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
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
        <Typography variant='h5' component='span'>{achiever ? 'Edit Achiever' : 'Add New Achiever'}</Typography>
        <Typography variant='body2' color='text.secondary'>
          Fill in the information below to {achiever ? 'update' : 'add'} an achiever
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pbs: 0 }}>
          <Grid container spacing={5}>
            <Grid size={{ xs: 12 }}>
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Student Name'
                    placeholder='e.g. John Doe'
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    required
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant='body2' sx={{ mb: 1 }}>Achiever Photo *</Typography>
              <div className='flex items-center gap-4 border p-3 rounded'>
                <Button component='label' variant='tonal' size='small' startIcon={<i className='tabler-upload' />}>
                  Choose Photo
                  <input type='file' hidden accept='image/*' onChange={handleFileChange} />
                </Button>
                <Typography variant='caption'>
                  {selectedFile ? selectedFile.name : 'No file selected'}
                </Typography>
              </div>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name='year'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Year'
                    placeholder='e.g. 2024'
                    error={!!errors.year}
                    helperText={errors.year?.message}
                    required
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pbe: 8 }}>
          <Button variant='contained' type='submit' disabled={isUploading}>
            {isUploading ? (achiever ? 'Saving...' : 'Adding...') : (achiever ? 'Save Changes' : 'Save Achiever')}
          </Button>
          <Button variant='tonal' color='secondary' onClick={handleClose}>
            Discard
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AchieverDialog

'use client'

import { useEffect } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, minLength, pipe, number } from 'valibot'

import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import CustomButton from '@components/CustomButton'
import { courseService } from '@/api/adminServices'
import { showToast } from '@/utils/toast'

const courseSchema = object({
  title: pipe(string(), minLength(1, 'Title is required')),
  description: pipe(string(), minLength(1, 'Description is required')),
  duration: pipe(string(), minLength(1, 'Duration is required')),
  price: pipe(number('Price must be a number')),
  status: pipe(string(), minLength(1, 'Status is required'))
})

const CourseDialog = ({ open, handleClose, course, refreshData }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: valibotResolver(courseSchema),
    defaultValues: {
      title: '',
      description: '',
      duration: '',
      price: 0,
      status: 'active'
    }
  })

  useEffect(() => {
    if (course && open) {
      reset({
        title: course.title || '',
        description: course.description || '',
        duration: course.duration || '',
        price: course.price || 0,
        status: course.status || 'active'
      })
    } else if (!course && open) {
      reset({
        title: '',
        description: '',
        duration: '',
        price: 0,
        status: 'active'
      })
    }
  }, [course, open, reset])

  const onSubmit = async (data) => {
    try {
      if (course) {
        await courseService.update(course._id, data)
        showToast('Course updated successfully!')
      } else {
        await courseService.create(data)
        showToast('Course created successfully!')
      }

      refreshData()
      handleClose()
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error')
    }
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth='md' 
      fullWidth 
      scroll='body'
      closeAfterTransition={false}
      PaperProps={{ sx: { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={handleClose} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      
      <DialogTitle sx={{ textAlign: 'center', pbe: 4 }}>
        <Typography variant='h5' component='span'>
          {course ? 'Edit Course Details' : 'Add New Course'}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Fill in the information below to {course ? 'update' : 'create'} a course
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
                    label='Course Title'
                    placeholder='e.g. Advanced Medical Coding'
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    required
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name='description'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    multiline
                    rows={3}
                    label='Description'
                    placeholder='Course description...'
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    required
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='duration'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Duration'
                    placeholder='e.g. 3 Months'
                    error={!!errors.duration}
                    helperText={errors.duration?.message}
                    required
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='price'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type='number'
                    label='Price ($)'
                    placeholder='0.00'
                    error={!!errors.price}
                    helperText={errors.price?.message}
                    required
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name='status'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label='Status'
                    error={!!errors.status}
                    helperText={errors.status?.message}
                  >
                    <MenuItem value='active'>Active</MenuItem>
                    <MenuItem value='inactive'>Inactive</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pbe: 8 }}>
          <CustomButton type='submit'>
            {course ? 'Save Changes' : 'Create Course'}
          </CustomButton>
          <CustomButton variant='tonal' color='secondary' onClick={handleClose}>
            Discard
          </CustomButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CourseDialog

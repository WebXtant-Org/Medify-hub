'use client'

import { useState, useEffect } from 'react'

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
import CustomAutocomplete from '@components/CustomAutocomplete'
import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import CustomButton from '@components/CustomButton'
import { testService, courseService } from '@/api/adminServices'
import { showToast } from '@/utils/toast'

const testSchema = object({
  title: pipe(string(), minLength(1, 'Title is required')),
  courseId: pipe(string(), minLength(1, 'Course is required')),
  duration: pipe(number('Duration must be a number')),
  totalMarks: pipe(number('Total marks must be a number')),
  status: pipe(string(), minLength(1, 'Status is required'))
})

const TestDialog = ({ open, handleClose, test, refreshData }) => {
  const [courses, setCourses] = useState([])

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: valibotResolver(testSchema),
    defaultValues: {
      title: '',
      courseId: '',
      duration: 30,
      totalMarks: 50,
      status: 'draft'
    }
  })

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseService.getAll()

        setCourses(data)
      } catch (err) {
        console.error('Error fetching courses:', err)
      }
    }

    if (open) fetchCourses()
  }, [open])

  useEffect(() => {
    if (test && open) {
      reset({
        title: test.title || '',
        courseId: test.courseId?._id || test.courseId || '',
        duration: test.duration || 30,
        totalMarks: test.totalMarks || 50,
        status: test.status || 'draft'
      })
    } else if (!test && open) {
      reset({
        title: '',
        courseId: '',
        duration: 30,
        totalMarks: 50,
        status: 'draft'
      })
    }
  }, [test, open, reset])

  const onSubmit = async (data) => {
    try {
      if (test) {
        await testService.update(test._id, data)
        showToast('Test updated successfully!')
      } else {
        await testService.create(data)
        showToast('Test created successfully!')
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
          {test ? 'Edit Test Details' : 'Add New Test'}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Fill in the information below to {test ? 'update' : 'create'} a test
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
                    label='Test Title'
                    placeholder='e.g. Weekly Quiz 1'
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    required
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name='courseId'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomAutocomplete
                    options={courses}
                    value={value}
                    onChange={onChange}
                    label='Course'
                    placeholder='Select Course'
                    required
                    error={errors.courseId}
                    helperText={errors.courseId?.message}
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
                    type='number'
                    label='Duration (mins)'
                    error={!!errors.duration}
                    helperText={errors.duration?.message}
                    required
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='totalMarks'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type='number'
                    label='Total Marks'
                    error={!!errors.totalMarks}
                    helperText={errors.totalMarks?.message}
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
                render={({ field: { value, onChange } }) => (
                  <CustomAutocomplete
                    options={['draft', 'published']}
                    value={value}
                    onChange={onChange}
                    label='Status'
                    placeholder='Select Status'
                    error={errors.status}
                    helperText={errors.status?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pbe: 8 }}>
          <CustomButton type='submit'>
            {test ? 'Save Changes' : 'Create Test'}
          </CustomButton>
          <CustomButton variant='tonal' color='secondary' onClick={handleClose}>
            Discard
          </CustomButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default TestDialog

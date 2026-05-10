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
import { object, string, minLength, pipe } from 'valibot'

import CustomTextField from '@core/components/mui/TextField'
import CustomAutocomplete from '@components/CustomAutocomplete'
import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import CustomButton from '@components/CustomButton'
import { batchService, courseService, facultyService } from '@/api/adminServices'
import { showToast } from '@/utils/toast'

const batchSchema = object({
  name: pipe(string(), minLength(1, 'Name is required')),
  timing: pipe(string(), minLength(1, 'Timing is required')),
  courseId: pipe(string(), minLength(1, 'Course is required')),
  facultyId: pipe(string(), minLength(1, 'Faculty is required'))
})

const BatchDialog = ({ open, handleClose, batch, refreshData }) => {
  const [courses, setCourses] = useState([])
  const [faculties, setFaculties] = useState([])

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: valibotResolver(batchSchema),
    defaultValues: {
      name: '',
      timing: '',
      courseId: '',
      facultyId: ''
    }
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesData, facultiesData] = await Promise.all([
          courseService.getAll(),
          facultyService.getAll()
        ])

        setCourses(coursesData)
        setFaculties(facultiesData)
      } catch (err) {
        console.error('Error fetching courses/faculties:', err)
      }
    }

    if (open) fetchData()
  }, [open])

  useEffect(() => {
    if (batch && open) {
      reset({
        name: batch.name || '',
        timing: batch.timing || '',
        courseId: batch.courseId?._id || batch.courseId || '',
        facultyId: batch.facultyId?._id || batch.facultyId || ''
      })
    } else if (!batch && open) {
      reset({
        name: '',
        timing: '',
        courseId: '',
        facultyId: ''
      })
    }
  }, [batch, open, reset])

  const onSubmit = async (data) => {
    try {
      if (batch) {
        await batchService.update(batch._id, data)
        showToast('Batch updated successfully!')
      } else {
        await batchService.create(data)
        showToast('Batch created successfully!')
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
          {batch ? 'Edit Batch Details' : 'Add New Batch'}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Fill in the information below to {batch ? 'update' : 'create'} a batch
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pbs: 0 }}>
          <Grid container spacing={5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Batch Name'
                    placeholder='e.g. Morning Batch'
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    required
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='timing'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Timing'
                    placeholder='e.g. 9:00 AM - 12:00 PM'
                    error={!!errors.timing}
                    helperText={errors.timing?.message}
                    required
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
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
                name='facultyId'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomAutocomplete
                    options={faculties}
                    value={value}
                    onChange={onChange}
                    label='Faculty'
                    placeholder='Select Faculty'
                    required
                    error={errors.facultyId}
                    helperText={errors.facultyId?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pbe: 8 }}>
          <CustomButton type='submit'>
            {batch ? 'Save Changes' : 'Create Batch'}
          </CustomButton>
          <CustomButton variant='tonal' color='secondary' onClick={handleClose}>
            Discard
          </CustomButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default BatchDialog

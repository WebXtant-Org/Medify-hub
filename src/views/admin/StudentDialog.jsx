'use client'

import { useState, useEffect } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Autocomplete from '@mui/material/Autocomplete'
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, string, email, minLength, pipe } from 'valibot'

import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import { studentService, courseService, batchService } from '@/api/adminServices'
import { showToast } from '@/utils/toast'

const studentSchema = (isEdit) => object({
  name: pipe(string(), minLength(1, 'Name is required')),
  email: pipe(string(), minLength(1, 'Student ID/Email is required')),
  personalEmail: pipe(string(), minLength(1, 'Personal Email is required'), email('Invalid personal email')),
  password: isEdit ? pipe(string()) : pipe(string(), minLength(5, 'Password must be at least 5 characters')),
  courseId: pipe(string(), minLength(1, 'Course is required')),
  batchId: pipe(string(), minLength(1, 'Batch is required')),
  mobile: pipe(string(), minLength(10, 'Mobile number must be at least 10 digits')),
  status: pipe(string(), minLength(1, 'Status is required')),
  feesStatus: pipe(string(), minLength(1, 'Fees status is required'))
})

const StudentDialog = ({ open, handleClose, student, refreshData }) => {
  const [courses, setCourses] = useState([])
  const [batches, setBatches] = useState([])

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: valibotResolver(studentSchema(!!student)),
    defaultValues: {
      name: '',
      email: '',
      personalEmail: '',
      password: '',
      courseId: '',
      batchId: '',
      mobile: '',
      status: 'Active',
      feesStatus: 'Pending'
    }
  })

  // Watch fields for auto-generation
  const watchName = watch('name')
  const watchBatchId = watch('batchId')
  const watchCourseId = watch('courseId')

  useEffect(() => {
    if (!student && open && watchName) {
      const year = new Date().getFullYear()
      const cleanName = watchName.toUpperCase().replace(/\s+/g, '')
      
      const selectedBatch = batches.find(b => b._id === watchBatchId)
      const cleanBatch = (selectedBatch?.name || 'BATCH').toUpperCase().replace(/\s+/g, '')
      
      // Generate Professional ID (Email)
      const generatedId = `MH-${cleanName}-${cleanBatch}-${year}@medifyhubhealthcaresolution.com`

      setValue('email', generatedId)

      // Generate Professional Password
      const generatedPass = `${cleanName}@MH${year}`

      setValue('password', generatedPass)
    }
  }, [watchName, watchBatchId, watchCourseId, setValue, student, open, batches])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesData, batchesData] = await Promise.all([
          courseService.getAll(),
          batchService.getAll()
        ])

        setCourses(coursesData)
        setBatches(batchesData)
      } catch (err) {
        console.error('Error fetching courses/batches:', err)
      }
    }

    if (open) fetchData()
  }, [open])

  useEffect(() => {
    if (student && open) {
      reset({
        name: student.name || '',
        email: student.email || '',
        personalEmail: student.personalEmail || '',
        password: '',
        courseId: student.courseIds?.[0]?._id || student.courseIds?.[0] || '',
        batchId: student.batchId?._id || student.batchId || '',
        mobile: student.mobile || '',
        status: student.status || 'Active',
        feesStatus: student.feesStatus || 'Pending'
      })
    } else if (!student && open) {
      reset({
        name: '',
        email: '',
        personalEmail: '',
        password: '',
        courseId: '',
        batchId: '',
        mobile: '',
        status: 'Active',
        feesStatus: 'Pending'
      })
    }
  }, [student, open, reset])

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        courseIds: [data.courseId],
        batchId: data.batchId
      }
      
      if (student) {
        await studentService.update(student._id, payload)
        showToast('Student updated successfully!')
      } else {
        await studentService.create({ ...payload, role: 'student' })
        showToast('Student registered successfully!')
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
      
      <DialogTitle id='student-dialog-title' sx={{ textAlign: 'center', pbe: 4 }}>
        <Typography variant='h5' component='span'>
          {student ? 'Edit Student Details' : 'Add New Student'}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Fill in the information below to {student ? 'update' : 'register'} a student
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
                    label='Full Name'
                    placeholder='John Doe'
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    required
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='personalEmail'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Personal Email (for OTP)'
                    placeholder='john.personal@example.com'
                    error={!!errors.personalEmail}
                    helperText={errors.personalEmail?.message || 'OTP will be sent here'}
                    required
                    type='email'
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Professional ID / Login Email'
                    placeholder='MH-JOHN-BATCHA-2026@medifyhubhealthcaresolution.com'
                    error={!!errors.email}
                    helperText={errors.email?.message || 'Auto-generated professional ID'}
                    required
                    type='email'
                    slotProps={{ input: { readOnly: !!student } }}
                  />
                )}
              />
            </Grid>
            {!student && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name='password'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      label='Generated Password'
                      error={!!errors.password}
                      helperText={errors.password?.message || 'Auto-generated professional password'}
                      required
                    />
                  )}
                />
              </Grid>
            )}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='courseId'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    options={courses}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.title || '')}
                    value={courses.find((c) => c._id === value) || null}
                    onChange={(event, newValue) => onChange(newValue ? newValue._id : '')}
                    renderInput={(params) => (
                      <CustomTextField
                        {...params}
                        label='Course'
                        required
                        error={!!errors.courseId}
                        helperText={errors.courseId?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='batchId'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    options={batches}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name || '')}
                    value={batches.find((b) => b._id === value) || null}
                    onChange={(event, newValue) => onChange(newValue ? newValue._id : '')}
                    renderInput={(params) => (
                      <CustomTextField
                        {...params}
                        label='Batch'
                        required
                        error={!!errors.batchId}
                        helperText={errors.batchId?.message}
                        sx={{ '& .MuiFormLabel-asterisk': { color: 'error.main' } }}
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='mobile'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Mobile Number'
                    placeholder='9876543210'
                    error={!!errors.mobile}
                    helperText={errors.mobile?.message}
                    required
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
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
                    <MenuItem value='Active'>Active</MenuItem>
                    <MenuItem value='Hold'>Hold</MenuItem>
                    <MenuItem value='Terminated'>Terminated</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='feesStatus'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label='Fees Status'
                    error={!!errors.feesStatus}
                    helperText={errors.feesStatus?.message}
                  >
                    <MenuItem value='Paid'>Paid</MenuItem>
                    <MenuItem value='Pending'>Pending</MenuItem>
                    <MenuItem value='Partial'>Partial</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pbe: 8 }}>
          <Button variant='contained' type='submit'>
            {student ? 'Save Changes' : 'Register Student'}
          </Button>
          <Button variant='tonal' color='secondary' onClick={handleClose}>
            Discard
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default StudentDialog

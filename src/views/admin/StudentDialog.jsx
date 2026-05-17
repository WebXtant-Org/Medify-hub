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
import CustomAutocomplete from '@components/CustomAutocomplete'
import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import { studentService, courseService, batchService } from '@/api/adminServices'
import { showToast } from '@/utils/toast'

const studentSchema = (isEdit) => object({
  name: pipe(string(), minLength(1, 'Name is required')),
  email: pipe(string(), minLength(1, 'Login Id is required')),
  personalEmail: pipe(string(), minLength(1, 'Personal Email is required'), email('Invalid personal email')),
  password: pipe(string()),
  courseId: pipe(string(), minLength(1, 'Course is required')),
  batchId: pipe(string(), minLength(1, 'Batch is required')),
  mobile: pipe(string(), minLength(10, 'Mobile number must be at least 10 digits')),
  status: pipe(string(), minLength(1, 'Status is required')),
  feesStatus: pipe(string(), minLength(1, 'Fees status is required'))
})

const COURSE_CODES = {
  'Basic Medical Coding Training (BMCT)': 'BMCT',
  'Advanced Medical Coding Training (AMCT)': 'AMCT',
  'Certified Professional Coder (CPC)': 'CPC',
  'Certified Coding Specialist (CCS)': 'CCS',
  'Certified Risk adjustment Coder (CRC)': 'CRC',
  'UAE Medical Coding Course': 'UAE'
}

const StudentDialog = ({ open, handleClose, student, refreshData }) => {
  const [courses, setCourses] = useState([])
  const [batches, setBatches] = useState([])
  const [allStudents, setAllStudents] = useState([])

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
    if (open && watchCourseId) {
      const selectedCourse = courses.find(c => c._id === watchCourseId)
      if (!selectedCourse) return

      const originalCourseId = student ? (student.courseIds?.[0]?._id || student.courseIds?.[0] || '') : ''
      
      // If we are in edit mode, and the course is the same as the student's original course, restore original ID
      if (student && watchCourseId === originalCourseId) {
        setValue('email', student.email)
        return
      }

      const courseTitle = selectedCourse.title || ''
      let courseCode = 'GEN'
      
      // Find matching code
      Object.keys(COURSE_CODES).forEach(key => {
        if (courseTitle.includes(key) || key.includes(courseTitle)) {
          courseCode = COURSE_CODES[key]
        }
      })

      // Fallback for UAE if not matched exactly
      if (courseCode === 'GEN' && (courseTitle.includes('UAE') || courseTitle.includes('Dubai'))) {
        courseCode = 'UAE'
      }

      const prefix = `MHHS${courseCode}`
      
      // Calculate sequence based on existing students with this prefix
      const count = allStudents.filter(s => (s.studentId || s.email || '').startsWith(prefix)).length
      const sequence = (count + 1).toString().padStart(3, '0')
      
      const generatedId = `${prefix}${sequence}`
      setValue('email', generatedId)

      // Only generate background password for NEW students
      if (!student) {
        const year = new Date().getFullYear()
        const cleanName = (watchName || 'STUDENT').toUpperCase().replace(/\s+/g, '')
        const generatedPass = `${cleanName}@MH${year}`
        setValue('password', generatedPass)
      }
    }
  }, [watchName, watchCourseId, setValue, student, open, courses, allStudents])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesData, batchesData, studentsData] = await Promise.all([
          courseService.getAll(),
          batchService.getAll(),
          studentService.getAll()
        ])

        setCourses(coursesData)
        setBatches(batchesData)
        setAllStudents(studentsData)
      } catch (err) {
        console.error('Error fetching courses/batches/students:', err)
      }
    }

    if (open) fetchData()
  }, [open])

  useEffect(() => {
    if (!student && open && batches.length > 0) {
      const morning = batches.find(b => b.name?.toLowerCase().includes('morning'))
      if (morning) {
        setValue('batchId', morning._id)
      }
    }
  }, [batches, student, open, setValue])

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
                name='courseId'
                control={control}
                render={({ field: { onChange, value } }) => (
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
                name='batchId'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CustomAutocomplete
                    options={batches}
                    value={value}
                    onChange={onChange}
                    label='Batch'
                    placeholder='Select Batch'
                    required
                    error={errors.batchId}
                    helperText={errors.batchId?.message}
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
                    label='Login Id'
                    placeholder='MHHSBMCT001'
                    error={!!errors.email}
                    helperText={errors.email?.message || 'Auto-generated professional ID'}
                    required
                    slotProps={{ input: { readOnly: !!student } }}
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
                render={({ field: { value, onChange } }) => (
                  <CustomAutocomplete
                    options={['Active', 'Hold', 'Terminated']}
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
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='feesStatus'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomAutocomplete
                    options={['Paid', 'Pending', 'Partial']}
                    value={value}
                    onChange={onChange}
                    label='Fees Status'
                    placeholder='Select Fees Status'
                    error={errors.feesStatus}
                    helperText={errors.feesStatus?.message}
                  />
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

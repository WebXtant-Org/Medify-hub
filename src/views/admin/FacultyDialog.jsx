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
import { object, string, email, minLength, pipe, number } from 'valibot'

import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import CustomButton from '@components/CustomButton'
import { facultyService } from '@/api/adminServices'

const facultySchema = (isEdit) => object({
  name: pipe(string(), minLength(1, 'Name is required')),
  email: pipe(string(), minLength(1, 'Email is required'), email('Invalid email')),
  password: isEdit ? pipe(string()) : pipe(string(), minLength(5, 'Password must be at least 5 characters')),
  specialty: pipe(string(), minLength(1, 'Specialty is required')),
  salary: pipe(number('Salary must be a number')),
  status: pipe(string(), minLength(1, 'Status is required'))
})

const FacultyDialog = ({ open, handleClose, staff, refreshData }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: valibotResolver(facultySchema(!!staff)),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      specialty: '',
      salary: 0,
      status: 'Active'
    }
  })

  useEffect(() => {
    if (staff && open) {
      reset({
        name: staff.name || '',
        email: staff.email || '',
        password: '',
        specialty: staff.specialty || '',
        salary: staff.salary || 0,
        status: staff.status || 'Active'
      })
    } else if (!staff && open) {
      reset({
        name: '',
        email: '',
        password: '',
        specialty: '',
        salary: 0,
        status: 'Active'
      })
    }
  }, [staff, open, reset])

  const onSubmit = async (data) => {
    try {
      if (staff) {
        await facultyService.update(staff._id, data)
        showToast('Faculty updated successfully!')
      } else {
        await facultyService.create(data)
        showToast('Faculty registered successfully!')
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
          {staff ? 'Edit Faculty Details' : 'Add New Faculty'}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Fill in the information below to {staff ? 'update' : 'register'} a faculty member
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
                name='email'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Email'
                    placeholder='john@example.com'
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    required
                    type='email'
                  />
                )}
              />
            </Grid>
            {!staff && (
              <Grid size={{ xs: 12 }}>
                <Controller
                  name='password'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      label='Password'
                      type='password'
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      required
                    />
                  )}
                />
              </Grid>
            )}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='specialty'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Specialty'
                    placeholder='e.g. CPC Expert'
                    error={!!errors.specialty}
                    helperText={errors.specialty?.message}
                    required
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name='salary'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type='number'
                    label='Salary ($)'
                    placeholder='0.00'
                    error={!!errors.salary}
                    helperText={errors.salary?.message}
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
                    <MenuItem value='Active'>Active</MenuItem>
                    <MenuItem value='Inactive'>Inactive</MenuItem>
                    <MenuItem value='On Leave'>On Leave</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pbe: 8 }}>
          <CustomButton type='submit'>
            {staff ? 'Save Changes' : 'Register Faculty'}
          </CustomButton>
          <CustomButton variant='tonal' color='secondary' onClick={handleClose}>
            Discard
          </CustomButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default FacultyDialog

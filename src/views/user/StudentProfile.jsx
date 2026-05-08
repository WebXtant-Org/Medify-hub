'use client'

import { useEffect, useState } from 'react'

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import CardHeader from '@mui/material/CardHeader'

import { studentService } from '@/api/studentServices'
import CustomTextField from '@core/components/mui/TextField'

const StudentProfile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const data = await studentService.getProfile()

        setProfile(data)
      } catch (err) {
        console.error('Failed to fetch profile:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) return <Typography sx={{ p: 6 }}>Loading profile...</Typography>

  const user = profile || {}

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Card>
          <CardContent className='flex flex-col items-center gap-4 text-center'>
            <Avatar sx={{ width: 100, height: 100, fontSize: '2.5rem' }}>
              {user.name?.charAt(0) || 'S'}
            </Avatar>
            <div>
              <Typography variant='h5'>{user.name || 'Student Name'}</Typography>
              <Chip label='Active Student' color='primary' size='small' variant='tonal' className='mt-2' />
            </div>
          </CardContent>
          <Divider />
          <CardContent>
            <Typography variant='h6' className='mb-4'>Details</Typography>
            <div className='flex flex-col gap-3'>
              <div className='flex justify-between'>
                <Typography color='text.secondary'>Email:</Typography>
                <Typography className='font-medium'>{user.email}</Typography>
              </div>
              <div className='flex justify-between'>
                <Typography color='text.secondary'>Contact:</Typography>
                <Typography className='font-medium'>{user.mobile || 'N/A'}</Typography>
              </div>
              <div className='flex justify-between'>
                <Typography color='text.secondary'>Joined:</Typography>
                <Typography className='font-medium'>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</Typography>
              </div>
              <div className='flex justify-between'>
                <Typography color='text.secondary'>Batch:</Typography>
                <Typography className='font-medium'>{user.batchId?.name || 'Unassigned'}</Typography>
              </div>
            </div>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 8 }}>
        <Card>
          <CardHeader title='Profile Information' />
          <CardContent className='flex flex-col gap-6'>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField fullWidth label='Full Name' value={user.name || ''} readOnly />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField fullWidth label='Personal Email' value={user.personalEmail || ''} readOnly />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <CustomTextField fullWidth label='Institutional Email' value={user.email || ''} disabled />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <CustomTextField fullWidth label='Mobile' value={user.mobile || ''} readOnly />
              </Grid>
            </Grid>
            <Typography variant='body2' color='text.secondary'>
              To update your profile information, please contact the administrator.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default StudentProfile

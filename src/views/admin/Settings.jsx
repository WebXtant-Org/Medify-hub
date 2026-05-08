'use client'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import Chip from '@mui/material/Chip'

import { useAuth } from '@/contexts/AuthContext'

const Settings = () => {
  const { appSettings, updateSettings } = useAuth()

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardHeader title='Security Settings' />
          <CardContent className='flex flex-col gap-4'>
            <FormControlLabel
              control={
                <Switch 
                  checked={appSettings.singleDeviceLogin} 
                  onChange={(e) => updateSettings({ singleDeviceLogin: e.target.checked })}
                />
              }
              label='Restrict Single Device Login'
            />
            <Typography variant='body2' color='text.secondary'>
              When enabled, users will be logged out from other devices when they log in to a new one.
            </Typography>
            
            <FormControlLabel
              control={
                <Switch 
                  checked={appSettings.watermarkEnable} 
                  onChange={(e) => updateSettings({ watermarkEnable: e.target.checked })}
                />
              }
              label='Enable PDF Watermark'
            />
            <Typography variant='body2' color='text.secondary'>
              Display student name and email as watermark on all study materials.
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardHeader title='Sub-Admin Management' action={<Button size='small'>Add Role</Button>} />
          <CardContent className='flex flex-col gap-4'>
            <div className='flex justify-between items-center p-3 border rounded'>
              <div>
                <Typography className='font-medium'>Manager Role</Typography>
                <Typography variant='body2'>Access to students and payments</Typography>
              </div>
              <Button size='small' variant='tonal'>Edit</Button>
            </div>
            <div className='flex justify-between items-center p-3 border rounded'>
              <div>
                <Typography className='font-medium'>Faculty Head</Typography>
                <Typography variant='body2'>Access to batches and faculty</Typography>
              </div>
              <Button size='small' variant='tonal'>Edit</Button>
            </div>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title='Branch Management' action={<Button size='small'>Add Branch</Button>} />
          <CardContent>
            <div className='flex gap-4 overflow-x-auto'>
              <Card variant='outlined' className='min-is-[200px]'>
                <CardContent>
                  <Typography variant='h6'>Main Branch</Typography>
                  <Typography variant='body2'>New York, NY</Typography>
                  <Chip label='Primary' size='small' className='mt-2' color='primary' />
                </CardContent>
              </Card>
              <Card variant='outlined' className='min-is-[200px]'>
                <CardContent>
                  <Typography variant='h6'>Jersey City</Typography>
                  <Typography variant='body2'>Jersey City, NJ</Typography>
                  <Chip label='Secondary' size='small' className='mt-2' />
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Settings

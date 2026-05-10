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

    </Grid>
  )
}

export default Settings

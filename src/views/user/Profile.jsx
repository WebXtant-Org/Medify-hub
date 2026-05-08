'use client'

import Grid from '@mui/material/Grid2'

import { useAuth } from '@/contexts/AuthContext'
import UserProfileHeader from '@views/pages/user-profile/UserProfileHeader'
import AboutOverview from '@views/pages/user-profile/profile/AboutOverview'

const Profile = () => {
  const { user, deviceId, devices } = useAuth()
  
  const currentDevice = devices.find(d => d.deviceId === deviceId)

  const profileHeaderData = {
    fullName: user?.name || 'Student',
    coverImg: '/images/pages/profile-banner.png',
    profileImg: user?.image || '/images/avatars/1.png',
    designation: 'Medical Coding Student',
    designationIcon: 'tabler-books',
    location: 'Remote Learning',
    joiningDate: 'Recently Enrolled'
  }

  const profileOverviewData = {
    about: [
      { property: 'Full Name', value: user?.name || 'Student', icon: 'tabler-user' },
      { property: 'Status', value: 'Active', icon: 'tabler-check' },
      { property: 'Role', value: 'Student', icon: 'tabler-star' },
      { property: 'Language', value: 'English', icon: 'tabler-language' }
    ],
    contacts: [
      { property: 'Email', value: user?.email || 'student@example.com', icon: 'tabler-mail' }
    ],
    teams: [],
    overview: [
      { property: 'Current Device', value: currentDevice?.deviceName || 'Unknown Browser', icon: 'tabler-device-laptop' },
      { property: 'Last Login', value: currentDevice ? new Date(currentDevice.lastLogin).toLocaleString() : 'Just now', icon: 'tabler-clock' },
      { property: 'Security Status', value: 'Active Protection', icon: 'tabler-shield-check' }
    ]
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <UserProfileHeader data={profileHeaderData} />
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <AboutOverview data={profileOverviewData} />
      </Grid>
      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        {/* Placeholder for future content like Activity Timeline */}
      </Grid>
    </Grid>
  )
}

export default Profile

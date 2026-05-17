'use client'

// Next Imports
import Link from 'next/link'

// Third-party Imports
import classnames from 'classnames'

// MUI Imports
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'

// Component Imports
import NavToggle from './NavToggle'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import NotificationsDropdown from '@components/layout/shared/NotificationsDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'
import { useAuth } from '@/contexts/AuthContext'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

import { useState, useEffect } from 'react'
import { notificationService } from '@/api/adminServices'

const NavbarContent = () => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationService.getAll()
        const mapped = data.map(n => ({
          title: n.title,
          subtitle: n.message,
          time: new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: n.read || false,
          avatarIcon: n.type === 'Alert' ? 'tabler-alert-triangle' : 'tabler-bell',
          avatarColor: n.type === 'Alert' ? 'error' : 'primary'
        }))

        setNotifications(mapped)
      } catch (error) {
        console.error('Failed to fetch navbar notifications:', error)
      }
    }

    if (user && user.role !== 'admin') fetchNotifications()
  }, [user])

  return (
    <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
      <div className='flex items-center gap-2'>
        <NavToggle />
        <div className='flex items-center gap-2'>
          <Typography variant='h5' className='font-medium flex items-center gap-1'>
            Hello <span className='animate-wave'>👋</span>
          </Typography>
          <Typography variant='h6' color='textSecondary' className='hidden sm:block'>
            Welcome back, {user?.name?.split(' ')[0] || 'User'}
          </Typography>
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <Tooltip title='Back to Landing Page'>
          <Button 
            component={Link} 
            href='/' 
            variant='tonal' 
            size='small' 
            color='secondary'
            startIcon={<i className='tabler-world' />}
            className='hidden md:flex'
          >
            Back to Site
          </Button>
        </Tooltip>
        <ModeDropdown />
        {user?.role !== 'admin' && <NotificationsDropdown notifications={notifications} />}
        <UserDropdown />
      </div>
    </div>
  )
}

export default NavbarContent

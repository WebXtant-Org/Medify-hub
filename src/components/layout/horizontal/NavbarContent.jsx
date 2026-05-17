'use client'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import Typography from '@mui/material/Typography'

import NavToggle from './NavToggle'
import Logo from '@components/layout/shared/Logo'
import ModeDropdown from '@components/layout/shared/ModeDropdown'
import NotificationsDropdown from '@components/layout/shared/NotificationsDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'
import { useAuth } from '@/contexts/AuthContext'

// Hook Imports
import useHorizontalNav from '@menu/hooks/useHorizontalNav'

// Util Imports
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'


import { useState, useEffect } from 'react'
import { notificationService } from '@/api/adminServices'

const NavbarContent = () => {
  // Hooks
  const { isBreakpointReached } = useHorizontalNav()
  const { lang: locale } = useParams()
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
    <div
      className={classnames(horizontalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}
    >
      <div className='flex items-center gap-4'>
        <NavToggle />
        {/* Hide Logo on Smaller screens */}
        {!isBreakpointReached && (
          <Link href={'/'}>
            <Logo />
          </Link>
        )}
      </div>

      <div className='flex items-center gap-2'>
        <div className='flex items-center gap-2'>
          <Typography variant='h5' className='font-medium flex items-center gap-1'>
            Hello <span className='animate-wave'>👋</span>
          </Typography>
          <Typography variant='h6' color='textSecondary' className='hidden sm:block'>
            Welcome back, {user?.name?.split(' ')[0] || 'Admin'}
          </Typography>
        </div>
        <ModeDropdown />
        {user?.role !== 'admin' && <NotificationsDropdown notifications={notifications} />}
        <UserDropdown />
        {/* Notification Dropdown, quick access menu dropdown, user dropdown will be placed here */}
      </div>
    </div>
  )
}

export default NavbarContent

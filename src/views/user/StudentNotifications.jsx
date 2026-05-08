'use client'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'

import { useEffect, useState } from 'react'
import { notificationService } from '@/api/adminServices'

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true)
        const data = await notificationService.getAll()

        setNotifications(data)
      } catch (err) {
        console.error('Failed to fetch notifications:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  return (
    <div className='flex flex-col gap-6'>
      <Typography variant='h4' key='header'>Notifications & Announcements</Typography>
      
      {loading ? (
        <Typography sx={{ p: 6 }}>Loading notifications...</Typography>
      ) : notifications.length === 0 ? (
        <Typography variant='body1' className='text-center py-10 text-textSecondary'>
          No new notifications.
        </Typography>
      ) : (
        notifications.map((n, index) => (
          <Card key={n._id || index}>
            <CardContent className='flex gap-4 items-start'>
              <Avatar variant='rounded' className={n.type === 'Alert' ? 'bg-error/10 text-error' : 'bg-info/10 text-info'}>
                <i className={n.type === 'Alert' ? 'tabler-alert-triangle' : 'tabler-bell'} />
              </Avatar>
              <div className='flex flex-col gap-1'>
                <div className='flex justify-between items-center'>
                  <Typography variant='h6' className='text-base'>{n.title}</Typography>
                  <Typography variant='caption'>{new Date(n.createdAt).toLocaleDateString()}</Typography>
                </div>
                <Typography variant='body2'>{n.message}</Typography>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

export default StudentNotifications

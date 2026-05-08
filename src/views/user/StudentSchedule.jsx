'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import { studentService } from '@/api/studentServices'

const Calendar = dynamic(() => import('@views/apps/calendar/Calendar'), { ssr: false })
const CalendarWrapper = dynamic(() => import('@views/apps/calendar/CalendarWrapper'), { ssr: false })

const StudentSchedule = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const data = await studentService.getProfile()
        setProfile(data)
      } catch (err) {
        console.error('Failed to fetch schedule profile:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) return <Typography sx={{ p: 6 }}>Loading schedule...</Typography>

  const batch = profile?.batchId
  
  // Transform batch timing to calendar events
  const events = batch ? [{
    id: batch._id,
    title: `${batch.name} Class`,
    start: new Date().toISOString().split('T')[0] + 'T' + (batch.timing?.split(' - ')[0] || '09:00'),
    end: new Date().toISOString().split('T')[0] + 'T' + (batch.timing?.split(' - ')[1] || '11:00'),
    extendedProps: { calendar: 'Business' }
  }] : []

  return (
    <div className='flex flex-col gap-6'>
      <Typography variant='h4'>My Class Timetable</Typography>
      
      {!batch ? (
        <Card>
          <CardContent>
            <Typography>You are not assigned to any batch yet. Please contact admin for your schedule.</Typography>
          </CardContent>
        </Card>
      ) : (
        <CalendarWrapper>
          <Calendar 
            events={events}
            dispatch={() => {}}
            calendarApi={null}
            setCalendarApi={() => {}}
            handleLeftSidebarToggle={() => {}}
            handleAddEventSidebarToggle={() => {}}
          />
        </CalendarWrapper>
      )}
    </div>
  )
}

export default StudentSchedule

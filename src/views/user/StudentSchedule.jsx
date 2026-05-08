'use client'

import dynamic from 'next/dynamic'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

import { useAuth } from '@/contexts/AuthContext'

const Calendar = dynamic(() => import('@views/apps/calendar/Calendar'), { ssr: false })
const CalendarWrapper = dynamic(() => import('@views/apps/calendar/CalendarWrapper'), { ssr: false })

const StudentSchedule = () => {
  const { batchesList } = useAuth()
  
  // Transform batches to calendar events
  const events = batchesList.map(batch => ({
    id: batch.id,
    title: `${batch.name} - ${batch.faculty}`,
    start: new Date().toISOString().split('T')[0] + 'T' + batch.timing.split(' - ')[0],
    end: new Date().toISOString().split('T')[0] + 'T' + batch.timing.split(' - ')[1],
    extendedProps: { calendar: 'Business' }
  }))

  return (
    <div className='flex flex-col gap-6'>
      <Typography variant='h4'>My Class Timetable</Typography>
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
    </div>
  )
}

export default StudentSchedule

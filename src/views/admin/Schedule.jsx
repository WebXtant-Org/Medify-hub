'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import { batchService } from '@/api/adminServices'

// Simplified Calendar Wrapper
const Calendar = dynamic(() => import('@views/apps/calendar/Calendar'), { ssr: false })
const CalendarWrapper = dynamic(() => import('@views/apps/calendar/CalendarWrapper'), { ssr: false })

const Schedule = () => {
  const [batchesList, setBatchesList] = useState([])
  
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const data = await batchService.getAll()
        setBatchesList(data)
      } catch (error) {
        console.error('Failed to fetch batches:', error)
      }
    }
    fetchBatches()
  }, [])
  
  // Transform batches to calendar events
  const events = (batchesList || []).map(batch => ({
    id: batch._id || batch.id,
    title: `${batch.name} - ${batch.facultyId?.name || batch.faculty}`,
    start: new Date().toISOString().split('T')[0] + 'T' + (batch.timing?.split(' - ')[0] || '09:00'),
    end: new Date().toISOString().split('T')[0] + 'T' + (batch.timing?.split(' - ')[1] || '10:00'),
    extendedProps: { calendar: 'Business' }
  }))

  return (
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
  )
}

export default Schedule

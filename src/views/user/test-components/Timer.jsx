'use client'

import { useState, useEffect } from 'react'

import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'

const Timer = ({ initialMinutes, onTimeUp }) => {
  const [seconds, setSeconds] = useState(initialMinutes * 60)

  useEffect(() => {
    if (seconds <= 0) {
      onTimeUp()

      return
    }

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [seconds, onTimeUp])

  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60

    return `${hrs > 0 ? hrs.toString().padStart(2, '0') + ':' : ''}${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }


  const isLowTime = seconds < 300 // 5 minutes

  return (
    <Box className='flex items-center gap-2'>
      <Typography variant='body2' color='textSecondary'>Time Remaining:</Typography>
      <Chip 
        label={formatTime(seconds)} 
        color={isLowTime ? 'error' : 'primary'} 
        variant='tonal'
        className='font-bold text-lg px-2'
        icon={<i className='tabler-clock' />}
      />
    </Box>
  )
}

export default Timer

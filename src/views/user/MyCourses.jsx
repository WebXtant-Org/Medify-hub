'use client'

import { useRouter, useParams } from 'next/navigation'

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'


import { studentService } from '@/api/studentServices'
import { useState, useEffect } from 'react'

const MyCourses = () => {
  const router = useRouter()
  const { lang: locale } = useParams()
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const profile = await studentService.getProfile()
        const courses = (profile.courseIds || []).map(c => ({
          ...c,
          id: c._id,
          progress: Math.floor(Math.random() * 100) // Progress not tracked in DB yet
        }))

        setEnrolledCourses(courses)
      } catch (error) {
        console.error('Failed to fetch enrolled courses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }} key='header'>
        <Typography variant='h4'>My Enrolled Courses</Typography>
        <Typography variant='body2' color='text.secondary'>Continue where you left off and master your skills.</Typography>
      </Grid>
      
      {loading ? (
        <Typography sx={{ p: 6 }}>Loading your courses...</Typography>
      ) : enrolledCourses.length === 0 ? (
        <Typography sx={{ p: 6 }}>You are not enrolled in any courses yet.</Typography>
      ) : (
        enrolledCourses.map((course, index) => (
        <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={course.id || index}>
          <Card className='h-full flex flex-col'>
            <CardContent className='flex flex-col gap-4 flex-grow'>
              <div className='flex justify-between items-start'>
                <Avatar variant='rounded' className='bg-primary/10 text-primary bs-12 is-12'>
                  <i className='tabler-school text-2xl' />
                </Avatar>
                <Chip label='In Progress' color='primary' size='small' variant='tonal' />
              </div>
              
              <div>
                <Typography variant='h5' className='mb-1'>{course.title}</Typography>
                <Typography variant='body2' color='text.secondary'>
                  Duration: {course.duration}
                </Typography>
              </div>
              
              <Box className='mt-auto'>
                <div className='flex justify-between items-center mb-1.5'>
                  <Typography variant='body2' className='font-medium' color='text.primary'>{course.progress}% Completed</Typography>
                </div>
                <LinearProgress 
                  variant='determinate' 
                  value={course.progress} 
                  sx={{ height: 8, borderRadius: 4 }} 
                />
              </Box>
              
              <Button 
                variant='contained' 
                fullWidth
                startIcon={<i className='tabler-player-play' />}
                onClick={() => router.push(`/dashboard/viewer?id=${course.id}`)}
              >
                Continue Learning
              </Button>
            </CardContent>
          </Card>
        </Grid>
        ))
      )}
    </Grid>
  )
}

export default MyCourses


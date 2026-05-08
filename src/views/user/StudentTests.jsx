'use client'

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

import { useEffect, useState } from 'react'
import { testService } from '@/api/adminServices'
import { showToast } from '@/utils/toast'

const StudentTests = () => {
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true)
        const data = await testService.getAll()

        setTests(data)
      } catch (err) {
        showToast('Failed to load tests', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchTests()
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }} key='header'>
        <Typography variant='h4'>Available Tests & Exams</Typography>
      </Grid>

      {loading ? (
        <Typography sx={{ p: 6 }}>Loading tests...</Typography>
      ) : tests.length === 0 ? (
        <Typography sx={{ p: 6 }}>No tests available at the moment.</Typography>
      ) : (
        tests.map((test, index) => (
          <Grid key={test._id || index} size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent className='flex flex-col gap-4'>
                <div className='flex justify-between items-center'>
                  <Chip label={test.courseId?.title || test.course} size='small' variant='tonal' color='primary' />
                  <Typography variant='body2' color='text.secondary'>{test.questions?.length || 0} Questions</Typography>
                </div>
                <Typography variant='h5'>{test.title}</Typography>
                <div className='flex gap-4 mt-2'>
                  <Button variant='contained' fullWidth>Start Test</Button>
                  <Button variant='outlined' fullWidth>View Syllabus</Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))
      )}

      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title='Recent Test Results' />
          <CardContent>
             <div className='flex justify-between items-center p-4 border-b'>
                <div>
                   <Typography className='font-medium'>React Basics Quiz</Typography>
                   <Typography variant='body2'>Date: 25 Apr 2026</Typography>
                </div>
                <div className='text-right'>
                   <Typography variant='h6' color='success.main'>85/100</Typography>
                   <Chip label='Passed' color='success' size='small' variant='tonal' />
                </div>
             </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default StudentTests

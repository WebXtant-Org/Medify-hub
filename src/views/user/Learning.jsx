'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'

import { studentService } from '@/api/studentServices'

const Learning = () => {
  const router = useRouter()
  const [materials, setMaterials] = useState([])
  const [groupedMaterials, setGroupedMaterials] = useState({})
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true)
        const data = await studentService.getMaterials()
        setMaterials(data)
        
        // Group materials by course
        const grouped = data.reduce((acc, material) => {
          const courseId = material.courseId?._id || 'other'
          const courseTitle = material.courseId?.title || 'Other Materials'
          
          if (!acc[courseId]) {
            acc[courseId] = {
              id: courseId,
              title: courseTitle,
              materials: []
            }
          }
          acc[courseId].materials.push(material)
          return acc
        }, {})
        
        setGroupedMaterials(grouped)
      } catch (error) {
        console.error('Failed to fetch materials:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMaterials()
  }, [])

  const handleBack = () => {
    setSelectedCourse(null)
  }

  if (loading) return <Typography sx={{ p: 6 }}>Loading study materials...</Typography>

  if (materials.length === 0) {
    return (
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent className='flex flex-col items-center justify-center p-12'>
              <Avatar variant='rounded' className='bg-primary/10 text-primary bs-16 is-16 mb-4'>
                <i className='tabler-book-off text-4xl' />
              </Avatar>
              <Typography variant='h5'>No Materials Found</Typography>
              <Typography variant='body2' color='text.secondary'>You don't have any study materials assigned yet.</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  }

  // If a course is selected, show its materials
  if (selectedCourse) {
    const course = groupedMaterials[selectedCourse]
    return (
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <Box className='flex flex-col gap-2'>
            <Breadcrumbs aria-label='breadcrumb'>
              <Link
                underline='hover'
                color='inherit'
                href='#'
                onClick={(e) => { e.preventDefault(); handleBack(); }}
                className='flex items-center gap-1'
              >
                <i className='tabler-book text-lg' />
                Study Materials
              </Link>
              <Typography color='text.primary'>{course.title}</Typography>
            </Breadcrumbs>
            <Box className='flex items-center gap-2 mt-2'>
              <IconButton onClick={handleBack} color='primary' className='bg-primary/10'>
                <i className='tabler-arrow-left' />
              </IconButton>
              <Typography variant='h4'>{course.title}</Typography>
            </Box>
          </Box>
        </Grid>

        {course.materials.map((material) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={material._id}>
            <Card className='h-full flex flex-col hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-primary'>
              <CardContent className='flex flex-col gap-4 flex-grow'>
                <div className='flex justify-between items-start'>
                  <Avatar variant='rounded' className='bg-info/10 text-info bs-12 is-12'>
                    <i className={material.type === 'PDF' ? 'tabler-file-type-pdf text-2xl' : 'tabler-file text-2xl'} />
                  </Avatar>
                  <Chip label={material.type} size='small' color='primary' variant='tonal' />
                </div>
                
                <div>
                  <Typography variant='h6' className='mb-1 line-clamp-1'>{material.title}</Typography>
                  <Typography variant='body2' color='text.secondary' className='line-clamp-2 mb-3'>
                    {material.description || 'No description available.'}
                  </Typography>
                  <Box className='flex items-center gap-1 text-xs text-text-secondary'>
                    <i className='tabler-calendar-event' />
                    <span>Added: {new Date(material.createdAt).toLocaleDateString()}</span>
                  </Box>
                </div>

                <Button 
                  variant='contained' 
                  fullWidth
                  className='mt-auto'
                  startIcon={<i className='tabler-eye' />}
                  onClick={() => router.push(`/dashboard/viewer?id=${material._id}`)}
                >
                  View Material
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    )
  }

  // Initial View: Grouped by Course
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Typography variant='h4'>Study Materials</Typography>
        <Typography variant='body2' color='text.secondary'>Select a course to view its assigned study materials and resources.</Typography>
      </Grid>

      {Object.values(groupedMaterials).map((course) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={course.id}>
          <Card 
            className='h-full cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-s-4 border-s-primary'
            onClick={() => setSelectedCourse(course.id)}
          >
            <CardContent className='flex flex-col gap-4'>
              <Box className='flex justify-between items-center'>
                <Avatar variant='rounded' className='bg-primary/10 text-primary bs-14 is-14'>
                  <i className='tabler-folder text-3xl' />
                </Avatar>
                <Chip 
                  label={`${course.materials.length} Materials`} 
                  color='info' 
                  variant='tonal' 
                  size='small' 
                  icon={<i className='tabler-file-description' />}
                />
              </Box>
              
              <div>
                <Typography variant='h5' className='mb-1'>{course.title}</Typography>
                <Typography variant='body2' color='text.secondary'>
                  Click to explore resources for this course.
                </Typography>
              </div>

              <Box className='flex justify-end'>
                <Button 
                  endIcon={<i className='tabler-chevron-right' />}
                  onClick={(e) => { e.stopPropagation(); setSelectedCourse(course.id); }}
                >
                  Open Folder
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default Learning

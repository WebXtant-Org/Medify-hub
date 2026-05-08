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

import { studentService } from '@/api/studentServices'

const Learning = () => {
  const router = useRouter()
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true)
        const data = await studentService.getMaterials()
        setMaterials(data)
      } catch (error) {
        console.error('Failed to fetch materials:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMaterials()
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Typography variant='h4'>My Learning Materials</Typography>
        <Typography variant='body2' color='text.secondary'>Access your study guides, PDFs, and resources assigned by your instructors.</Typography>
      </Grid>

      {loading ? (
        <Typography sx={{ p: 6 }}>Loading materials...</Typography>
      ) : materials.length === 0 ? (
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
      ) : (
        materials.map((material) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={material._id}>
            <Card className='h-full flex flex-col hover:shadow-lg transition-shadow duration-300'>
              <CardContent className='flex flex-col gap-4 flex-grow'>
                <div className='flex justify-between items-start'>
                  <Avatar variant='rounded' className='bg-info/10 text-info bs-12 is-12'>
                    <i className={material.type === 'PDF' ? 'tabler-file-type-pdf text-2xl' : 'tabler-file text-2xl'} />
                  </Avatar>
                  <Chip label={material.type} size='small' color='primary' variant='tonal' />
                </div>
                
                <div>
                  <Typography variant='h5' className='mb-1 line-clamp-1'>{material.title}</Typography>
                  <Typography variant='body2' color='text.secondary' className='line-clamp-2'>
                    {material.description || 'No description available.'}
                  </Typography>
                </div>

                {material.courseId && (
                  <Box className='flex items-center gap-1.5'>
                    <i className='tabler-school text-info' />
                    <Typography variant='caption' color='info.main' className='font-medium'>
                      {material.courseId.title}
                    </Typography>
                  </Box>
                )}

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
        ))
      )}
    </Grid>
  )
}

export default Learning

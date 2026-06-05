'use client'

import { useEffect, useState, useMemo } from 'react'
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
import InputAdornment from '@mui/material/InputAdornment'

import { studentService } from '@/api/studentServices'
import { useAuth } from '@/contexts/AuthContext'
import CustomTextField from '@core/components/mui/TextField'

// Vibrant border/glow matching themes for each course prefix
const getCourseTheme = (title) => {
  const t = title.toUpperCase()
  if (t.includes('BMCT') || t.includes('BASIC')) {
    return { border: 'border-l-4 border-l-[#3b82f6]', glow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]', badge: 'bg-blue-500/10 text-blue-400' }
  } else if (t.includes('AMCT') || t.includes('ADVANCED')) {
    return { border: 'border-l-4 border-l-[#8b5cf6]', glow: 'hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]', badge: 'bg-purple-500/10 text-purple-400' }
  } else if (t.includes('CPC')) {
    return { border: 'border-l-4 border-l-[#10b981]', glow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]', badge: 'bg-emerald-500/10 text-emerald-400' }
  } else if (t.includes('CCS')) {
    return { border: 'border-l-4 border-l-[#6366f1]', glow: 'hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]', badge: 'bg-indigo-500/10 text-indigo-400' }
  } else if (t.includes('CRC')) {
    return { border: 'border-l-4 border-l-[#f59e0b]', glow: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]', badge: 'bg-amber-500/10 text-amber-400' }
  } else if (t.includes('UAE') || t.includes('DUBAI')) {
    return { border: 'border-l-4 border-l-[#ef4444]', glow: 'hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]', badge: 'bg-rose-500/10 text-rose-400' }
  }
  return { border: 'border-l-4 border-l-[#6b7280]', glow: 'hover:shadow-[0_0_20px_rgba(107,114,128,0.15)]', badge: 'bg-gray-500/10 text-gray-400' }
}

const Learning = () => {
  const router = useRouter()
  const { user } = useAuth()
  
  const [materials, setMaterials] = useState([])
  const [groupedMaterials, setGroupedMaterials] = useState({})
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedFolder, setSelectedFolder] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('All')

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

  const currentCourseMaterials = useMemo(() => {
    if (!selectedCourse) return []
    return materials.filter(m => (m.courseId?._id || 'other') === selectedCourse)
  }, [materials, selectedCourse])

  const foldersInCourse = useMemo(() => {
    if (!selectedCourse) return []
    
    const folderGroup = currentCourseMaterials.reduce((acc, m) => {
      const folderName = m.folder || 'General'
      if (!acc[folderName]) {
        acc[folderName] = []
      }
      acc[folderName].push(m)
      return acc
    }, {})

    return Object.entries(folderGroup).map(([name, files]) => ({
      name,
      filesCount: files.length,
      files
    }))
  }, [currentCourseMaterials, selectedCourse])

  const handleBack = () => {
    if (selectedFolder) {
      setSelectedFolder(null)
    } else {
      setSelectedCourse(null)
    }
  }

  const handleBackToCourses = () => {
    setSelectedCourse(null)
    setSelectedFolder(null)
  }

  // Master Filter: Matches both course selection, type filters, folder selection, and search query
  const getFilteredMaterials = () => {
    let list = materials
    
    if (selectedCourse) {
      list = list.filter(m => (m.courseId?._id || 'other') === selectedCourse)
    }

    if (searchQuery.trim() === '' && selectedFolder) {
      list = list.filter(m => (m.folder || 'General') === selectedFolder)
    }
    
    if (selectedType !== 'All') {
      list = list.filter(m => m.type === selectedType)
    }
    
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase()
      list = list.filter(m => 
        m.title.toLowerCase().includes(q) || 
        (m.description || '').toLowerCase().includes(q) ||
        (m.courseId?.title || '').toLowerCase().includes(q) ||
        (m.folder || '').toLowerCase().includes(q)
      )
    }
    
    return list
  }

  const filteredMaterials = getFilteredMaterials()
  const totalCoursesCount = Object.keys(groupedMaterials).length
  const totalMaterialsCount = materials.length

  if (loading) {
    return (
      <Box className='flex flex-col items-center justify-center p-12 gap-4 min-h-[50vh]'>
        <i className='tabler-loader animate-spin text-4xl text-primary' />
        <Typography variant='body1' color='text.secondary'>Unlocking study vault...</Typography>
      </Box>
    )
  }

  return (
    <Grid container spacing={6}>
      {/* 1. Ultra-Premium welcome banner (Only shown when no course is actively opened) */}
      {!selectedCourse && (
        <Grid size={{ xs: 12 }}>
          <Box 
            className='p-8 rounded-3xl relative overflow-hidden shadow-2xl border border-white/5'
            sx={{
              background: 'linear-gradient(135deg, #0f111a 0%, #16192b 100%)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-30%',
                right: '-10%',
                width: '350px',
                height: '350px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
                zIndex: 0
              }
            }}
          >
            <Box className='relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
              <div>
                <Box className='flex items-center gap-2 mb-2'>
                  <Chip label="ACADEMIC RESOURCE PORTAL" color="primary" size="small" variant="tonal" className='text-[10px] font-bold tracking-wider' />
                  <Chip label="SECURE VAULT" color="error" size="small" variant="tonal" className='text-[10px] font-bold tracking-wider' />
                </Box>
                <Typography variant='h3' className='text-white font-black leading-tight mb-2'>
                  Hello, {user?.name || 'Student'}! 👋
                </Typography>
                <Typography variant='body1' className='text-gray-400 max-w-[600px]'>
                  Welcome to your secure repository. All materials are cryptographically protected and watermarked with your professional Student ID.
                </Typography>
              </div>

              {/* Stats glass blocks */}
              <Box className='flex gap-4 self-stretch md:self-auto justify-stretch'>
                <Box className='bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[120px] backdrop-blur-md'>
                  <Typography variant='h4' className='text-white font-black'>{totalCoursesCount}</Typography>
                  <Typography variant='caption' className='text-gray-400 font-bold uppercase tracking-wider text-[8px] mt-1'>Courses</Typography>
                </Box>
                <Box className='bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[120px] backdrop-blur-md'>
                  <Typography variant='h4' className='text-white font-black'>{totalMaterialsCount}</Typography>
                  <Typography variant='caption' className='text-gray-400 font-bold uppercase tracking-wider text-[8px] mt-1'>Resources</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
      )}

      {/* 2. Interactive Search & Filter Controls */}
      <Grid size={{ xs: 12 }}>
        <Card className='shadow-md border border-white/5 bg-[#121420]/30 backdrop-blur'>
          <CardContent className='flex flex-col md:flex-row gap-4 items-center justify-between py-4'>
            <Box className='w-full md:max-w-md'>
              <CustomTextField
                fullWidth
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder='Search materials, courses, topics...'
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position='start'>
                        <i className='tabler-search text-gray-400 text-lg' />
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Box>
            
            <Box className='flex gap-2 self-stretch md:self-auto justify-end overflow-x-auto'>
              {['All', 'PDF', 'Video'].map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? 'contained' : 'tonal'}
                  color={selectedType === type ? 'primary' : 'secondary'}
                  size='small'
                  onClick={() => setSelectedType(type)}
                  className='rounded-xl px-4 py-1.5 text-xs font-bold'
                >
                  {type === 'All' ? 'All Types' : type}
                </Button>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* 3. Folder/Deck Presentation */}
      {!selectedCourse && searchQuery.trim() === '' && (
        <>
          <Grid size={{ xs: 12 }} className='-mbe-2'>
            <Typography variant='h5' className='font-bold flex items-center gap-2'>
              <i className='tabler-folders text-primary' /> Assigned Course Decks
            </Typography>
          </Grid>
          {totalMaterialsCount === 0 ? (
            <Grid size={{ xs: 12 }}>
              <Card className='border border-white/5 shadow-xl bg-[#121420]/20'>
                <CardContent className='flex flex-col items-center justify-center p-12 text-center'>
                  <Avatar variant='rounded' className='bg-primary/10 text-primary bs-16 is-16 mb-4'>
                    <i className='tabler-book-off text-4xl' />
                  </Avatar>
                  <Typography variant='h5' className='font-bold mb-1'>No resources assigned</Typography>
                  <Typography variant='body2' color='text.secondary'>You don't have any secure study materials registered at the moment.</Typography>
                </CardContent>
              </Card>
            </Grid>
          ) : (
            Object.values(groupedMaterials).map((course) => {
              const theme = getCourseTheme(course.title)
              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={course.id}>
                  <Card 
                    className={`h-full cursor-pointer transition-all duration-300 transform hover:-translate-y-2 border border-white/5 shadow-md bg-[#121420]/30 hover:bg-[#121420]/60 ${theme.border} ${theme.glow}`}
                    onClick={() => setSelectedCourse(course.id)}
                  >
                    <CardContent className='flex flex-col gap-5 p-6 h-full justify-between'>
                      <Box className='flex justify-between items-center'>
                        <Avatar variant='rounded' className={`${theme.badge} bs-14 is-14 border border-white/5`}>
                          <i className='tabler-folder text-2xl' />
                        </Avatar>
                        <Chip 
                          label={`${course.materials.length} Resource${course.materials.length > 1 ? 's' : ''}`}
                          color='secondary' 
                          variant='tonal' 
                          size='small' 
                          className='font-bold text-[10px]'
                          icon={<i className='tabler-file-description text-xs' />}
                        />
                      </Box>
                      
                      <div>
                        <Typography variant='h6' className='font-black line-clamp-2 leading-snug mb-1 text-white hover:text-primary transition-colors'>
                          {course.title}
                        </Typography>
                        <Typography variant='caption' color='text.secondary' className='line-clamp-2'>
                          Click to enter the encrypted catalog of this course.
                        </Typography>
                      </div>

                      <Box className='flex justify-between items-center mt-2 pt-2 border-t border-white/5'>
                        <span className='text-[10px] text-gray-500 uppercase tracking-widest font-mono font-bold'>DRM Secured</span>
                        <Button 
                          size='small'
                          endIcon={<i className='tabler-chevron-right text-xs' />}
                          onClick={(e) => { e.stopPropagation(); setSelectedCourse(course.id); }}
                          className='text-xs font-bold text-primary p-0 min-w-0 hover:bg-transparent'
                        >
                          Explore Deck
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })
          )}
        </>
      )}

      {/* 4. Active Material list inside Folder (or Search matches) */}
      {(selectedCourse || searchQuery.trim() !== '') && (
        <>
          <Grid size={{ xs: 12 }}>
            <Box className='flex flex-col gap-2'>
              {selectedCourse && (
                <Breadcrumbs aria-label='breadcrumb'>
                  <Link
                    underline='hover'
                    color='inherit'
                    href='#'
                    onClick={(e) => { e.preventDefault(); handleBackToCourses(); }}
                    className='flex items-center gap-1 text-xs'
                  >
                    <i className='tabler-book text-sm' />
                    Study Vault
                  </Link>
                  {selectedFolder ? (
                    <Link
                      underline='hover'
                      color='inherit'
                      href='#'
                      onClick={(e) => { e.preventDefault(); setSelectedFolder(null); }}
                      className='flex items-center gap-1 text-xs'
                    >
                      {groupedMaterials[selectedCourse]?.title || 'Course'}
                    </Link>
                  ) : (
                    <Typography sx={{ fontSize: '12px' }} color='text.primary'>
                      {groupedMaterials[selectedCourse]?.title || 'Course'}
                    </Typography>
                  )}
                  {selectedFolder && (
                    <Typography sx={{ fontSize: '12px' }} color='text.primary'>
                      {selectedFolder}
                    </Typography>
                  )}
                </Breadcrumbs>
              )}
              
              <Box className='flex flex-wrap items-center justify-between gap-4 mt-2'>
                <Box className='flex items-center gap-3'>
                  {selectedCourse && (
                    <IconButton onClick={handleBack} color='primary' className='bg-primary/10 hover:bg-primary/20 rounded-xl'>
                      <i className='tabler-arrow-left' />
                    </IconButton>
                  )}
                  <div>
                    <Typography variant='h4' className='font-black leading-none mb-1'>
                      {selectedCourse ? (
                        selectedFolder ? `${groupedMaterials[selectedCourse]?.title || 'Materials'} - ${selectedFolder}` : (groupedMaterials[selectedCourse]?.title || 'Materials')
                      ) : 'Search Results'}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {selectedCourse && !selectedFolder && searchQuery.trim() === '' ? (
                        `Select a folder to view resources`
                      ) : (
                        `Found ${filteredMaterials.length} materials matching filters`
                      )}
                    </Typography>
                  </div>
                </Box>
                
                {selectedCourse && (
                  <Chip 
                    label="Cryptographically Shielded" 
                    color="error" 
                    variant="tonal" 
                    size="small" 
                    className="font-bold text-[10px]"
                    icon={<i className='tabler-shield-lock text-xs' />} 
                  />
                )}
              </Box>
            </Box>
          </Grid>

          {/* Render Folders Grid if course is selected, not searching, and no folder selected */}
          {selectedCourse && !selectedFolder && searchQuery.trim() === '' ? (
            foldersInCourse.length === 0 ? (
              <Grid size={{ xs: 12 }}>
                <Card className='border border-white/5 shadow-xl bg-[#121420]/20'>
                  <CardContent className='flex flex-col items-center justify-center p-12 text-center'>
                    <Avatar variant='rounded' className='bg-primary/10 text-primary bs-16 is-16 mb-4'>
                      <i className='tabler-folder-off text-4xl' />
                    </Avatar>
                    <Typography variant='h5' className='font-bold mb-1'>No Folders Assigned</Typography>
                    <Typography variant='body2' color='text.secondary'>You don't have any secure study folders registered in this course at the moment.</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ) : (
              foldersInCourse.map((folder) => {
                const theme = getCourseTheme(groupedMaterials[selectedCourse]?.title || '')
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={folder.name}>
                    <Card 
                      className={`h-full cursor-pointer transition-all duration-300 transform hover:-translate-y-2 border border-white/5 shadow-md bg-[#121420]/30 hover:bg-[#121420]/60 ${theme.border} ${theme.glow}`}
                      onClick={() => setSelectedFolder(folder.name)}
                    >
                      <CardContent className='flex flex-col gap-5 p-6 h-full justify-between'>
                        <Box className='flex justify-between items-center'>
                          <Avatar variant='rounded' className={`${theme.badge} bs-14 is-14 border border-white/5`}>
                            <i className='tabler-folder-open text-2xl' />
                          </Avatar>
                          <Chip 
                            label={`${folder.filesCount} File${folder.filesCount > 1 ? 's' : ''}`}
                            color='secondary' 
                            variant='tonal' 
                            size='small' 
                            className='font-bold text-[10px]'
                            icon={<i className='tabler-file-description text-xs' />}
                          />
                        </Box>
                        
                        <div>
                          <Typography variant='h6' className='font-black line-clamp-2 leading-snug mb-1 text-white hover:text-primary transition-colors'>
                            {folder.name}
                          </Typography>
                          <Typography variant='caption' color='text.secondary' className='line-clamp-2'>
                            Explore secure materials in this folder.
                          </Typography>
                        </div>

                        <Box className='flex justify-between items-center mt-2 pt-2 border-t border-white/5'>
                          <span className='text-[10px] text-gray-500 uppercase tracking-widest font-mono font-bold'>DRM Secured</span>
                          <Button 
                            size='small'
                            endIcon={<i className='tabler-chevron-right text-xs' />}
                            onClick={(e) => { e.stopPropagation(); setSelectedFolder(folder.name); }}
                            className='text-xs font-bold text-primary p-0 min-w-0 hover:bg-transparent'
                          >
                            Open Folder
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              })
            )
          ) : (
            /* Otherwise, render materials list (Level 3 or Search results) */
            filteredMaterials.length === 0 ? (
              <Grid size={{ xs: 12 }}>
                <Card className='border border-white/5 shadow-xl bg-[#121420]/20'>
                  <CardContent className='flex flex-col items-center justify-center p-12 text-center'>
                    <Avatar variant='rounded' className='bg-secondary/10 text-secondary bs-16 is-16 mb-4'>
                      <i className='tabler-search-off text-4xl' />
                    </Avatar>
                    <Typography variant='h5' className='font-bold mb-1'>No Matching Resources</Typography>
                    <Typography variant='body2' color='text.secondary'>No study material matched your active search query or type filters.</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ) : (
              filteredMaterials.map((material) => {
                const isPDF = material.type === 'PDF'
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={material._id}>
                    <Card className='h-full flex flex-col hover:shadow-xl transition-all duration-300 border border-white/5 bg-[#121420]/30 rounded-2xl hover:bg-[#121420]/60 relative overflow-hidden'>
                      <CardContent className='flex flex-col gap-4 flex-grow p-6 justify-between'>
                        <div>
                          {/* Material Card Top */}
                          <div className='flex justify-between items-start mb-4'>
                            <Avatar variant='rounded' className={`bs-12 is-12 border border-white/5 ${isPDF ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'}`}>
                              <i className={isPDF ? 'tabler-file-type-pdf text-2xl' : 'tabler-player-play text-2xl'} />
                            </Avatar>
                            <Chip 
                              label={material.type} 
                              size='small' 
                              color={isPDF ? 'error' : 'primary'} 
                              variant='tonal' 
                              className='font-bold text-[9px] uppercase tracking-wider' 
                            />
                          </div>
                          
                          {/* Title & Info */}
                          <Typography variant='h6' className='font-black leading-snug line-clamp-1 mb-2 text-white'>
                            {material.title}
                          </Typography>
                          <Typography variant='body2' color='text.secondary' className='line-clamp-2 mb-4 text-xs leading-relaxed'>
                            {material.description || 'No summary registered for this file.'}
                          </Typography>
                        </div>

                        {/* Launch Vault footer block */}
                        <Box className='mt-auto flex flex-col gap-3'>
                          <Box className='flex items-center justify-between text-[10px] text-gray-500 font-mono pt-2 border-t border-white/5'>
                            <span className='flex items-center gap-1'>
                              <i className='tabler-calendar-event text-xs' />
                              {new Date(material.createdAt).toLocaleDateString()}
                            </span>
                            <span className='text-gray-400 font-bold'>DRM-SECURE</span>
                          </Box>
                          
                          <Button 
                            variant='contained' 
                            color='primary'
                            fullWidth
                            startIcon={<i className='tabler-shield-lock' />}
                            onClick={() => router.push(`/dashboard/viewer?id=${material._id}`)}
                            className='rounded-xl font-bold text-xs py-2 shadow-md hover:shadow-lg transition-all'
                            sx={{
                              background: 'linear-gradient(90deg, #6366f1 0%, #4f46e5 100%)',
                              '&:hover': {
                                boxShadow: '0 0 15px rgba(99,102,241,0.5)'
                              }
                            }}
                          >
                            Launch Secure Vault
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              })
            )
          )}
        </>
      )}
    </Grid>
  )
}

export default Learning

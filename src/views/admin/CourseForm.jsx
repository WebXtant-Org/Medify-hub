'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import { useForm, useFieldArray, Controller } from 'react-hook-form'

import CustomTextField from '@core/components/mui/TextField'
import CustomAutocomplete from '@components/CustomAutocomplete'
import { courseService, materialService } from '@/api/adminServices'
import { showToast } from '@/utils/toast'
import CustomDataTable from '@components/CustomDataTable'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'

const columnHelper = createColumnHelper()

const CourseForm = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [isLoading, setIsLoading] = useState(false)
  const [materials, setMaterials] = useState([])
  const [isMaterialsLoading, setIsMaterialsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [newMaterial, setNewMaterial] = useState({ title: '', description: '' })
  const [file, setFile] = useState(null)

  const router = useRouter()
  const { id } = useParams()
  const isEdit = !!id

  const { control, register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      description: '',
      duration: '',
      price: 0,
      status: 'active',
      fullDescription: '',
      highlights: [''],
      focusAreas: [''],
      details: {
        eligibility: '',
        curriculum: [''],
        careerPath: ''
      },
      examOverview: {
        duration: '',
        pattern: '',
        passingScore: '',
        subjects: ['']
      }
    }
  })

  // Dynamic Fields
  const { fields: highlights, append: appendHighlight, remove: removeHighlight } = useFieldArray({ control, name: 'highlights' })
  const { fields: focusAreas, append: appendFocusArea, remove: removeFocusArea } = useFieldArray({ control, name: 'focusAreas' })
  const { fields: curriculum, append: appendCurriculum, remove: removeCurriculum } = useFieldArray({ control, name: 'details.curriculum' })
  const { fields: examSubjects, append: appendExamSubject, remove: removeExamSubject } = useFieldArray({ control, name: 'examOverview.subjects' })

  const fetchCourse = useCallback(async () => {
    if (!isEdit) return
    try {
      setIsLoading(true)
      const data = await courseService.getById(id)
      reset(data)
    } catch (err) {
      showToast('Failed to load course details', 'error')
      router.push('/admin/courses')
    } finally {
      setIsLoading(false)
    }
  }, [id, isEdit, reset, router])

  const fetchMaterials = useCallback(async () => {
    if (!isEdit) return
    try {
      setIsMaterialsLoading(true)
      const allMaterials = await materialService.getAll()
      // Filter for this course
      const courseSpecific = allMaterials.filter(m => (m.courseId?._id || m.courseId) === id)
      setMaterials(courseSpecific)
    } catch (err) {
      console.error('Failed to fetch materials:', err)
    } finally {
      setIsMaterialsLoading(false)
    }
  }, [id, isEdit])

  useEffect(() => {
    fetchCourse()
    if (isEdit) fetchMaterials()
  }, [fetchCourse, fetchMaterials, isEdit])

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      // Clean up empty strings from arrays
      data.highlights = data.highlights.filter(i => i.trim() !== '')
      data.focusAreas = data.focusAreas.filter(i => i.trim() !== '')
      data.details.curriculum = data.details.curriculum.filter(i => i.trim() !== '')
      data.examOverview.subjects = data.examOverview.subjects.filter(i => i.trim() !== '')

      if (isEdit) {
        await courseService.update(id, data)
        showToast('Course updated successfully')
      } else {
        const created = await courseService.create(data)
        showToast('Course created successfully')
        router.push(`/admin/courses/edit/${created._id}`)
        return
      }
      router.push('/admin/courses')
    } catch (err) {
      showToast(err.message || 'Failed to save course', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUploadMaterial = async () => {
    if (!file || !newMaterial.title) {
      showToast('Please provide title and file', 'error')
      return
    }

    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('title', newMaterial.title)
      formData.append('description', newMaterial.description)
      formData.append('type', 'PDF')
      formData.append('courseId', id)
      formData.append('file', file)

      const res = await materialService.create(formData)
      setMaterials(prev => [...prev, res])
      setNewMaterial({ title: '', description: '' })
      setFile(null)
      showToast('Material uploaded successfully!')
    } catch (err) {
      showToast(err.message || 'Upload failed', 'error')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteMaterial = async (mId) => {
    try {
      await materialService.delete(mId)
      setMaterials(prev => prev.filter(m => m._id !== mId))
      showToast('Material deleted', 'error', { icon: <i className='tabler-trash' /> })
    } catch (err) {
      showToast('Failed to delete material', 'error')
    }
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const materialColumns = useMemo(() => [
    {
      id: 'serialNumber',
      header: 'S.No',
      cell: ({ row }) => <Typography color='text.primary'>{row.index + 1}</Typography>
    },
    columnHelper.accessor('title', {
      header: 'Title',
      cell: ({ row }) => (
        <Box>
          <Typography color='text.primary' className='font-medium'>{row.original.title}</Typography>
          <Typography variant='caption'>{row.original.description}</Typography>
        </Box>
      )
    }),
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <IconButton color='error' size='small' onClick={() => handleDeleteMaterial(row.original._id)}>
          <i className='tabler-trash' />
        </IconButton>
      )
    }
  ], [materials])

  const materialTable = useReactTable({
    data: materials,
    columns: materialColumns,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <Card>
      <CardHeader 
        title={isEdit ? 'Edit Course' : 'Create New Course'} 
        subheader="Manage course details, curriculum, and settings"
        action={
          <Button variant="outlined" color="secondary" onClick={() => router.push('/admin/courses')}>
            Back to List
          </Button>
        }
      />
      <Divider />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TabContext value={activeTab}>
            <TabList onChange={handleTabChange} variant='scrollable' scrollButtons='auto' className='border-be'>
              <Tab label="General Info" value="general" icon={<i className='tabler-info-circle' />} iconPosition='start' />
              <Tab label="Detailed Desc" value="details" icon={<i className='tabler-file-description' />} iconPosition='start' />
              <Tab label="Curriculum" value="curriculum" icon={<i className='tabler-list-details' />} iconPosition='start' />
              <Tab label="Highlights" value="highlights" icon={<i className='tabler-star' />} iconPosition='start' />
              <Tab label="Exam Info" value="exam" icon={<i className='tabler-certificate' />} iconPosition='start' />
              {isEdit && <Tab label="Materials" value="materials" icon={<i className='tabler-files' />} iconPosition='start' />}
            </TabList>

            <TabPanel value="general" className='p-0 pt-6'>
              <Grid container spacing={6}>
                <Grid item xs={12} md={8}>
                  <CustomTextField
                    fullWidth
                    label="Course Title"
                    {...register('title', { required: 'Title is required' })}
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    name='status'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <CustomAutocomplete
                        options={['active', 'draft', 'archived']}
                        value={value}
                        onChange={onChange}
                        label='Status'
                        placeholder='Select Status'
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomTextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Short Description"
                    {...register('description', { required: 'Description is required' })}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <CustomTextField
                    fullWidth
                    label="Duration"
                    placeholder="e.g. 45 Days, 3 Months"
                    {...register('duration', { required: 'Duration is required' })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <CustomTextField
                    fullWidth
                    type="number"
                    label="Price (₹)"
                    {...register('price', { required: 'Price is required' })}
                  />
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value="details" className='p-0 pt-6'>
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <CustomTextField
                    fullWidth
                    multiline
                    rows={6}
                    label="Full Detailed Description"
                    placeholder="Provide a comprehensive overview of the course..."
                    {...register('fullDescription')}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <CustomTextField
                    fullWidth
                    label="Eligibility"
                    placeholder="e.g. Life Science Graduates"
                    {...register('details.eligibility')}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <CustomTextField
                    fullWidth
                    label="Career Path"
                    placeholder="e.g. Junior Medical Coder"
                    {...register('details.careerPath')}
                  />
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value="curriculum" className='p-0 pt-6'>
              <Typography variant="h6" className='mbe-4'>Course Modules</Typography>
              {curriculum.map((field, index) => (
                <Box key={field.id} className='flex gap-2 mbe-4'>
                  <CustomTextField
                    fullWidth
                    label={`Module ${index + 1}`}
                    {...register(`details.curriculum.${index}`)}
                  />
                  <IconButton color='error' onClick={() => removeCurriculum(index)}>
                    <i className='tabler-trash' />
                  </IconButton>
                </Box>
              ))}
              <Button startIcon={<i className='tabler-plus' />} onClick={() => appendCurriculum('')}>
                Add Module
              </Button>
            </TabPanel>

            <TabPanel value="highlights" className='p-0 pt-6'>
              <Grid container spacing={6}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" className='mbe-4'>Key Highlights & Benefits</Typography>
                  {highlights.map((field, index) => (
                    <Box key={field.id} className='flex gap-2 mbe-4'>
                      <CustomTextField
                        fullWidth
                        label={`Highlight ${index + 1}`}
                        {...register(`highlights.${index}`)}
                      />
                      <IconButton color='error' onClick={() => removeHighlight(index)}>
                        <i className='tabler-trash' />
                      </IconButton>
                    </Box>
                  ))}
                  <Button startIcon={<i className='tabler-plus' />} onClick={() => appendHighlight('')}>
                    Add Highlight
                  </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" className='mbe-4'>Focus Areas</Typography>
                  {focusAreas.map((field, index) => (
                    <Box key={field.id} className='flex gap-2 mbe-4'>
                      <CustomTextField
                        fullWidth
                        label={`Focus Area ${index + 1}`}
                        {...register(`focusAreas.${index}`)}
                      />
                      <IconButton color='error' onClick={() => removeFocusArea(index)}>
                        <i className='tabler-trash' />
                      </IconButton>
                    </Box>
                  ))}
                  <Button startIcon={<i className='tabler-plus' />} onClick={() => appendFocusArea('')}>
                    Add Focus Area
                  </Button>
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value="exam" className='p-0 pt-6'>
              <Grid container spacing={6}>
                <Grid item xs={12} md={4}>
                  <CustomTextField
                    fullWidth
                    label="Exam Duration"
                    {...register('examOverview.duration')}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTextField
                    fullWidth
                    label="Exam Pattern"
                    {...register('examOverview.pattern')}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomTextField
                    fullWidth
                    label="Passing Score"
                    {...register('examOverview.passingScore')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" className='mbe-4'>Subjects Covered</Typography>
                  {examSubjects.map((field, index) => (
                    <Box key={field.id} className='flex gap-2 mbe-4'>
                      <CustomTextField
                        fullWidth
                        label={`Subject ${index + 1}`}
                        {...register(`examOverview.subjects.${index}`)}
                      />
                      <IconButton color='error' onClick={() => removeExamSubject(index)}>
                        <i className='tabler-trash' />
                      </IconButton>
                    </Box>
                  ))}
                  <Button startIcon={<i className='tabler-plus' />} onClick={() => appendExamSubject('')}>
                    Add Subject
                  </Button>
                </Grid>
              </Grid>
            </TabPanel>

            {isEdit && (
              <TabPanel value="materials" className='p-0 pt-6'>
                <Grid container spacing={6}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="h6" className='mbe-4'>Upload New Material</Typography>
                    <Box className='flex flex-col gap-4'>
                      <CustomTextField 
                        label="Material Title" 
                        fullWidth 
                        value={newMaterial.title}
                        onChange={e => setNewMaterial({...newMaterial, title: e.target.value})}
                      />
                      <CustomTextField 
                        label="Description" 
                        fullWidth 
                        multiline 
                        rows={2}
                        value={newMaterial.description}
                        onChange={e => setNewMaterial({...newMaterial, description: e.target.value})}
                      />
                      <Button variant="tonal" component="label" fullWidth color='secondary'>
                        {file ? file.name : 'Select PDF'}
                        <input type="file" hidden accept=".pdf" onChange={e => setFile(e.target.files[0])} />
                      </Button>
                      <Button 
                        variant="contained" 
                        fullWidth 
                        disabled={isUploading}
                        onClick={handleUploadMaterial}
                      >
                        {isUploading ? 'Uploading...' : 'Upload to this Course'}
                      </Button>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography variant="h6" className='mbe-4'>Current Course Materials ({materials.length})</Typography>
                    <CustomDataTable 
                      table={materialTable} 
                      isLoading={isMaterialsLoading} 
                      columns={materialColumns} 
                    />
                  </Grid>
                </Grid>
              </TabPanel>
            )}

            <Box className='flex justify-end gap-4 mt-8'>
              <Button variant='outlined' color='secondary' onClick={() => router.push('/admin/courses')}>
                Cancel
              </Button>
              <Button type='submit' variant='contained' disabled={isLoading}>
                {isLoading ? 'Saving...' : isEdit ? 'Update Course' : 'Create Course'}
              </Button>
            </Box>
          </TabContext>
        </form>
      </CardContent>
    </Card>
  )
}

export default CourseForm

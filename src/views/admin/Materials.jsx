'use client'

import { useMemo, useState, useCallback } from 'react'

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import { createColumnHelper, getCoreRowModel, useReactTable, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table'

import { useAuth } from '@/contexts/AuthContext'
import CustomDataTable from '@components/CustomDataTable'
import CustomButton from '@components/CustomButton'
import { showToast } from '@/utils/toast'
import DeleteConfirmationDialog from '@components/DeleteConfirmationDialog'
import CustomTextField from '@core/components/mui/TextField'
import CustomAutocomplete from '@components/CustomAutocomplete'
import { materialService, courseService } from '@/api/adminServices'

const columnHelper = createColumnHelper()

const Materials = () => {
  const [materialsList, setMaterialsList] = useState([])
  const [courses, setCourses] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [newMaterial, setNewMaterial] = useState({ title: '', description: '', type: 'PDF', courseId: '' })
  const [file, setFile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  
  // Delete Dialog States
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [materialToDelete, setMaterialToDelete] = useState(null)

  const fetchMaterials = useCallback(async () => {
    try {
      setIsLoading(true)
      const [materialsData, coursesData] = await Promise.all([
        materialService.getAll(),
        courseService.getAll()
      ])
      setMaterialsList(materialsData)
      setCourses(coursesData)
    } catch (err) {
      console.error('Failed to fetch data:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useMemo(() => {
    fetchMaterials()
  }, [fetchMaterials])

  const handleUpload = async e => {
    e.preventDefault()
    if (!selectedMaterial && !file) {
      showToast('Please select a file', 'error')
      return
    }

    if (!newMaterial.courseId) {
      showToast('Please select a course', 'error')
      return
    }

    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('title', newMaterial.title)
      formData.append('description', newMaterial.description)
      formData.append('type', newMaterial.type)
      formData.append('courseId', newMaterial.courseId)
      if (file) formData.append('file', file)

      if (selectedMaterial) {
        const res = await materialService.update(selectedMaterial._id, formData)
        setMaterialsList(prev => prev.map(m => m._id === res._id ? res : m))
        showToast('Material updated successfully!')
        handleCancelEdit()
      } else {
        const res = await materialService.create(formData)
        setMaterialsList(prev => [...prev, res])
        setNewMaterial({ title: '', description: '', type: 'PDF', courseId: '' })
        setFile(null)
        showToast('Material uploaded successfully!')
      }
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error')
    } finally {
      setIsUploading(false)
    }
  }

  const handleEdit = (material) => {
    setSelectedMaterial(material)
    setNewMaterial({
      title: material.title,
      description: material.description,
      type: material.type,
      courseId: material.courseId?._id || material.courseId
    })
    setFile(null)
  }

  const handleCancelEdit = () => {
    setSelectedMaterial(null)
    setNewMaterial({ title: '', description: '', type: 'PDF', courseId: '' })
    setFile(null)
  }

  const handleDeleteClick = (id) => {
    setMaterialToDelete(id)
    setOpenDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!materialToDelete) return
    
    try {
      await materialService.delete(materialToDelete)
      setMaterialsList(prev => prev.filter(m => m._id !== materialToDelete))
      showToast('Material deleted', 'error', { icon: <i className='tabler-trash' /> })
      setOpenDeleteDialog(false)
      setMaterialToDelete(null)
    } catch (err) {
      showToast('Failed to delete material', 'error')
    }
  }

  const columns = useMemo(() => [
    {
      id: 'serialNumber',
      header: 'S.No',
      cell: ({ row }) => <Typography color='text.primary'>{row.index + 1}</Typography>
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className='flex items-center gap-1'>
          <IconButton size='small' color='primary' onClick={() => handleEdit(row.original)}>
            <i className='tabler-edit' />
          </IconButton>
          <IconButton size='small' color='error' onClick={() => handleDeleteClick(row.original._id)}>
            <i className='tabler-trash' />
          </IconButton>
        </div>
      )
    },
    columnHelper.accessor('title', {
      header: 'Title',
      cell: ({ row }) => (
        <div>
          <Typography variant='body1' className='font-medium' color='text.primary'>{row.original.title}</Typography>
          <Typography variant='body2' color='text.secondary'>{row.original.description}</Typography>
        </div>
      )
    }),
    columnHelper.accessor('courseId', {
      header: 'Course',
      cell: ({ row }) => (
        <Typography color='primary' className='font-medium'>
          {row.original.courseId?.title || 'General'}
        </Typography>
      )
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      cell: ({ row }) => (
        <Chip label={row.original.type} color={row.original.type === 'PDF' ? 'primary' : 'warning'} size='small' variant='tonal' />
      )
    })
  ], [materialsList])


  const table = useReactTable({
    data: materialsList,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  })

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader 
              title={selectedMaterial ? 'Update Material' : 'Upload Material'} 
              action={selectedMaterial && (
                <IconButton size='small' onClick={handleCancelEdit}>
                  <i className='tabler-x' />
                </IconButton>
              )}
            />
            <CardContent>
              <form onSubmit={handleUpload} className='flex flex-col gap-4'>
                <CustomTextField
                  label='Title'
                  fullWidth
                  value={newMaterial.title}
                  onChange={e => setNewMaterial({ ...newMaterial, title: e.target.value })}
                  required
                />
                <CustomAutocomplete
                  options={['PDF']}
                  value={newMaterial.type}
                  onChange={val => setNewMaterial({ ...newMaterial, type: val })}
                  label='Type'
                  placeholder='Select Type'
                />
                <CustomAutocomplete
                  options={courses}
                  value={newMaterial.courseId}
                  onChange={val => setNewMaterial({ ...newMaterial, courseId: val })}
                  label='Course'
                  placeholder='Select Course'
                  required
                />
                <CustomTextField
                  label='Description'
                  fullWidth
                  multiline
                  rows={3}
                  value={newMaterial.description}
                  onChange={e => setNewMaterial({ ...newMaterial, description: e.target.value })}
                  required
                />
                <Box>
                  <CustomButton variant='tonal' component='label' color='secondary' fullWidth disabled={isUploading}>
                    {file ? 'Change File' : 'Select File'}
                    <input type='file' hidden onChange={e => setFile(e.target.files[0])} />
                  </CustomButton>
                  {file && (
                    <Typography variant='caption' className='block mt-2 text-center'>
                      Selected: {file.name}
                    </Typography>
                  )}
                </Box>
                <CustomButton type='submit' fullWidth disabled={isUploading}>
                  {isUploading ? (selectedMaterial ? 'Updating...' : 'Uploading...') : (selectedMaterial ? 'Update Material' : 'Upload')}
                </CustomButton>
              </form>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader 
              title='Manage Materials' 
              action={
                <CustomTextField
                  value={globalFilter ?? ''}
                  onChange={e => setGlobalFilter(e.target.value)}
                  placeholder='Search Material'
                  size='small'
                />
              }
            />
            <CustomDataTable table={table} isLoading={isLoading} columns={columns} />
          </Card>
        </Grid>
      </Grid>

      <DeleteConfirmationDialog 
        open={openDeleteDialog}
        handleClose={() => setOpenDeleteDialog(false)}
        handleConfirm={handleConfirmDelete}
        title="Delete Material"
        message="Are you sure you want to delete this study material? This will remove access for all assigned students."
      />
    </>
  )
}

export default Materials

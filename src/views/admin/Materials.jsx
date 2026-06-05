'use client'

import { useMemo, useState, useCallback, useEffect } from 'react'

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { createColumnHelper, getCoreRowModel, useReactTable, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table'

import { useAuth } from '@/contexts/AuthContext'
import CustomDataTable from '@components/CustomDataTable'
import CustomButton from '@components/CustomButton'
import { showToast } from '@/utils/toast'
import DeleteConfirmationDialog from '@components/DeleteConfirmationDialog'
import CustomTextField from '@core/components/mui/TextField'
import CustomAutocomplete from '@components/CustomAutocomplete'
import { materialService, courseService, folderService } from '@/api/adminServices'

const columnHelper = createColumnHelper()

const Materials = () => {
  const [materialsList, setMaterialsList] = useState([])
  const [courses, setCourses] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [newMaterial, setNewMaterial] = useState({ title: '', description: '', type: 'PDF', courseId: '', folderId: '' })
  const [file, setFile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  
  // Folder States
  const [folders, setFolders] = useState([])
  const [foldersLoading, setFoldersLoading] = useState(false)
  const [openFolderDialog, setOpenFolderDialog] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)

  // Delete Dialog States
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [materialToDelete, setMaterialToDelete] = useState(null)

  // Delete Folder States
  const [openFolderDeleteDialog, setOpenFolderDeleteDialog] = useState(false)
  const [folderToDelete, setFolderToDelete] = useState(null)

  // Fetch folders for the selected course
  const fetchFolders = useCallback(async (courseId) => {
    if (!courseId) {
      setFolders([])
      return
    }
    try {
      setFoldersLoading(true)
      const data = await folderService.getAll(courseId)
      setFolders(data)
    } catch (err) {
      console.error('Failed to fetch folders:', err)
      showToast('Failed to load folders for this course', 'error')
    } finally {
      setFoldersLoading(false)
    }
  }, [])

  // Refetch folders when the selected course ID changes
  useEffect(() => {
    const courseId = typeof newMaterial.courseId === 'object' ? newMaterial.courseId?._id : newMaterial.courseId
    fetchFolders(courseId)
  }, [newMaterial.courseId, fetchFolders])

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
      showToast('Failed to load materials and courses', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMaterials()
  }, [fetchMaterials])

  const handleUpload = async e => {
    e.preventDefault()
    if (!selectedMaterial && !file) {
      showToast('Please select a file', 'error')
      return
    }

    const courseId = typeof newMaterial.courseId === 'object' ? newMaterial.courseId?._id : newMaterial.courseId
    if (!courseId) {
      showToast('Please select a course', 'error')
      return
    }

    const folderId = typeof newMaterial.folderId === 'object' ? newMaterial.folderId?._id : newMaterial.folderId
    if (!folderId) {
      showToast('Please select a folder', 'error')
      return
    }

    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('title', newMaterial.title)
      formData.append('description', newMaterial.description)
      formData.append('type', newMaterial.type)
      formData.append('folderId', folderId)
      formData.append('courseId', courseId)
      if (file) formData.append('file', file)

      if (selectedMaterial) {
        const res = await materialService.update(selectedMaterial._id, formData)
        const oldFolderId = selectedMaterial.folderId?._id || selectedMaterial.folderId
        
        setMaterialsList(prev => prev.map(m => m._id === res._id ? res : m))

        if (oldFolderId && oldFolderId !== (res.folderId?._id || res.folderId)) {
          const otherMaterialsInOldFolder = materialsList.filter(m => {
            const mFolderId = m.folderId?._id || m.folderId
            return mFolderId === oldFolderId && m._id !== selectedMaterial._id
          })
          if (otherMaterialsInOldFolder.length === 0) {
            setFolders(prev => prev.filter(f => f._id !== oldFolderId))
          }
        }

        showToast('Material updated successfully!')
        handleCancelEdit()
      } else {
        const res = await materialService.create(formData)
        setMaterialsList(prev => [...prev, res])
        setNewMaterial({ title: '', description: '', type: 'PDF', courseId: '', folderId: '' })
        setFile(null)
        showToast('Material uploaded successfully!')
      }
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error')
    } finally {
      setIsUploading(false)
    }
  }

  const handleCreateFolder = async (e) => {
    e.preventDefault()
    if (!newFolderName.trim()) return

    const courseId = typeof newMaterial.courseId === 'object' ? newMaterial.courseId?._id : newMaterial.courseId
    if (!courseId) {
      showToast('Please select a course first', 'error')
      return
    }

    try {
      setIsCreatingFolder(true)
      const res = await folderService.create({
        courseId,
        folderName: newFolderName.trim()
      })
      
      // Update local folders list and select the newly created folder
      setFolders(prev => [...prev, res])
      setNewMaterial(prev => ({ ...prev, folderId: res._id }))
      
      showToast('Folder created successfully!')
      setOpenFolderDialog(false)
      setNewFolderName('')
    } catch (err) {
      showToast(err.message || 'Failed to create folder', 'error')
    } finally {
      setIsCreatingFolder(false)
    }
  }

  const handleEdit = (material) => {
    setSelectedMaterial(material)
    setNewMaterial({
      title: material.title,
      description: material.description,
      type: material.type,
      courseId: material.courseId?._id || material.courseId,
      folderId: material.folderId?._id || material.folderId || ''
    })
    setFile(null)
  }

  const handleCancelEdit = () => {
    setSelectedMaterial(null)
    setNewMaterial({ title: '', description: '', type: 'PDF', courseId: '', folderId: '' })
    setFile(null)
  }

  const handleDeleteClick = (id) => {
    setMaterialToDelete(id)
    setOpenDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!materialToDelete) return
    
    try {
      const materialObj = materialsList.find(m => m._id === materialToDelete)
      await materialService.delete(materialToDelete)
      setMaterialsList(prev => prev.filter(m => m._id !== materialToDelete))

      if (materialObj && materialObj.folderId) {
        const folderId = materialObj.folderId?._id || materialObj.folderId
        const otherMaterialsInFolder = materialsList.filter(m => {
          const mFolderId = m.folderId?._id || m.folderId
          return mFolderId === folderId && m._id !== materialToDelete
        })
        if (otherMaterialsInFolder.length === 0) {
          setFolders(prev => prev.filter(f => f._id !== folderId))
          const currentFolderId = typeof newMaterial.folderId === 'object' ? newMaterial.folderId?._id : newMaterial.folderId
          if (currentFolderId === folderId) {
            setNewMaterial(prev => ({ ...prev, folderId: '' }))
          }
        }
      }

      showToast('Material deleted', 'error', { icon: <i className='tabler-trash' /> })
      setOpenDeleteDialog(false)
      setMaterialToDelete(null)
    } catch (err) {
      showToast('Failed to delete material', 'error')
    }
  }

  const handleDeleteFolderClick = (folder) => {
    setFolderToDelete(folder)
    setOpenFolderDeleteDialog(true)
  }

  const handleConfirmDeleteFolder = async () => {
    if (!folderToDelete) return
    
    try {
      await folderService.delete(folderToDelete._id)
      setFolders(prev => prev.filter(f => f._id !== folderToDelete._id))
      
      const currentFolderId = typeof newMaterial.folderId === 'object' ? newMaterial.folderId?._id : newMaterial.folderId
      if (currentFolderId === folderToDelete._id) {
        setNewMaterial(prev => ({ ...prev, folderId: '' }))
      }
      
      setMaterialsList(prev => prev.filter(m => {
        const mFolderId = m.folderId?._id || m.folderId
        return mFolderId !== folderToDelete._id
      }))

      showToast('Folder and associated materials deleted successfully!')
      setOpenFolderDeleteDialog(false)
      setFolderToDelete(null)
    } catch (err) {
      console.error(err)
      showToast(err.message || 'Failed to delete folder', 'error')
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
    columnHelper.accessor('folder', {
      header: 'Folder',
      cell: ({ row }) => (
        <Chip 
          label={row.original.folderId?.folderName || row.original.folder || 'General'} 
          color='secondary' 
          size='small' 
          variant='tonal' 
          icon={<i className='tabler-folder text-xs' />}
          className='font-medium'
        />
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
                  onChange={val => {
                    setNewMaterial({ ...newMaterial, courseId: val, folderId: '' })
                  }}
                  label='Course'
                  placeholder='Select Course'
                  required
                />
                <Box className='flex gap-2 items-end w-full'>
                  <Box className='flex-grow'>
                    <CustomAutocomplete
                      options={folders}
                      value={newMaterial.folderId}
                      onChange={val => setNewMaterial({ ...newMaterial, folderId: val })}
                      label='Folder'
                      placeholder={newMaterial.courseId ? 'Select Folder' : 'Please select course first'}
                      getOptionLabel={(option) => typeof option === 'string' ? option : (option.folderName || '')}
                      disabled={!newMaterial.courseId || foldersLoading}
                      required
                      renderOption={(props, option) => {
                        const { key, ...optionProps } = props
                        return (
                          <li key={key} {...optionProps}>
                            <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                              <Typography variant='body2'>{option.folderName}</Typography>
                              <IconButton
                                size='small'
                                color='error'
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteFolderClick(option)
                                }}
                                style={{ padding: '4px' }}
                                title={`Delete ${option.folderName}`}
                              >
                                <i className='tabler-trash text-sm' />
                              </IconButton>
                            </Box>
                          </li>
                        )
                      }}
                    />
                  </Box>
                  <IconButton 
                    color='primary' 
                    onClick={() => {
                      const courseId = typeof newMaterial.courseId === 'object' ? newMaterial.courseId?._id : newMaterial.courseId
                      if (!courseId) {
                        showToast('Please select a course first', 'warning')
                        return
                      }
                      setOpenFolderDialog(true)
                    }}
                    disabled={!newMaterial.courseId}
                    className='bg-primary/10 hover:bg-primary/20 rounded-xl p-2.5 mb-[3px] h-[38px] w-[38px] flex items-center justify-center'
                    title='Create New Folder'
                  >
                    <i className='tabler-folder-plus text-lg' />
                  </IconButton>
                </Box>
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

      {/* Delete Dialogue */}
      <DeleteConfirmationDialog 
        open={openDeleteDialog}
        handleClose={() => setOpenDeleteDialog(false)}
        handleConfirm={handleConfirmDelete}
        title="Delete Material"
        message="Are you sure you want to delete this study material? This will remove access for all assigned students."
      />

      {/* Delete Folder Dialogue */}
      <DeleteConfirmationDialog 
        open={openFolderDeleteDialog}
        handleClose={() => setOpenFolderDeleteDialog(false)}
        handleConfirm={handleConfirmDeleteFolder}
        title="Delete Folder"
        message="Are you sure you want to delete this folder? This will delete the folder AND all study materials inside it."
      />

      {/* Create Folder Dialogue */}
      <Dialog open={openFolderDialog} onClose={() => setOpenFolderDialog(false)} maxWidth='xs' fullWidth>
        <DialogTitle>Create New Folder</DialogTitle>
        <form onSubmit={handleCreateFolder}>
          <DialogContent>
            <Box className='flex flex-col gap-4 pt-1'>
              <CustomTextField
                label='Folder Name'
                fullWidth
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                placeholder='e.g., CPC Mock Tests'
                required
                autoFocus
              />
            </Box>
          </DialogContent>
          <DialogActions className='pb-4 px-6'>
            <Button onClick={() => setOpenFolderDialog(false)} color='secondary'>Cancel</Button>
            <Button type='submit' variant='contained' disabled={isCreatingFolder}>
              {isCreatingFolder ? 'Creating...' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

export default Materials

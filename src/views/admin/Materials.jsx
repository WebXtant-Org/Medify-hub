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
import CustomTextField from '@core/components/mui/TextField'
import { showToast } from '@/utils/toast'
import DeleteConfirmationDialog from '@components/DeleteConfirmationDialog'

const columnHelper = createColumnHelper()

const Materials = () => {
  const { materialsList, setMaterialsList } = useAuth()
  const [globalFilter, setGlobalFilter] = useState('')
  const [newMaterial, setNewMaterial] = useState({ title: '', description: '', type: 'PDF' })
  const [file, setFile] = useState(null)
  
  // Delete Dialog States
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [materialToDelete, setMaterialToDelete] = useState(null)

  const handleUpload = e => {
    e.preventDefault()

    if (newMaterial.title && newMaterial.description) {
      const updated = [
        ...materialsList,
        {
          id: Date.now(),
          title: newMaterial.title,
          description: newMaterial.description,
          type: newMaterial.type,
          assignedCount: 0,
          file: file ? file.name : 'No file'
        }
      ]

      setMaterialsList(updated)
      setNewMaterial({ title: '', description: '', type: 'PDF' })
      setFile(null)
      showToast('Material uploaded successfully!')
    }
  }

  const handleDeleteClick = (id) => {
    setMaterialToDelete(id)
    setOpenDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    if (!materialToDelete) return
    setMaterialsList(materialsList.filter(m => m.id !== materialToDelete))
    showToast('Material deleted', 'error')
    setOpenDeleteDialog(false)
    setMaterialToDelete(null)
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
          <IconButton size='small' color='primary'>
            <i className='tabler-users-plus' />
          </IconButton>
          <IconButton size='small' color='primary'>
            <i className='tabler-edit' />
          </IconButton>
          <IconButton size='small' color='error' onClick={() => handleDeleteClick(row.original.id)}>
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
    columnHelper.accessor('type', {
      header: 'Type',
      cell: ({ row }) => (
        <Chip label={row.original.type} color={row.original.type === 'PDF' ? 'primary' : 'warning'} size='small' variant='tonal' />
      )
    }),
    columnHelper.accessor('assignedCount', {
      header: 'Assigned Users',
      cell: ({ row }) => <Typography variant='h6' align='center'>{row.original.assignedCount}</Typography>
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
            <CardHeader title='Upload Material' />
            <CardContent>
              <form onSubmit={handleUpload} className='flex flex-col gap-4'>
                <CustomTextField
                  label='Title'
                  fullWidth
                  value={newMaterial.title}
                  onChange={e => setNewMaterial({ ...newMaterial, title: e.target.value })}
                  required
                />
                <CustomTextField
                  select
                  fullWidth
                  label='Type'
                  value={newMaterial.type}
                  onChange={e => setNewMaterial({ ...newMaterial, type: e.target.value })}
                >
                  <MenuItem value='PDF'>PDF</MenuItem>
                  <MenuItem value='Video'>Video</MenuItem>
                  <MenuItem value='Audio'>Audio</MenuItem>
                </CustomTextField>
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
                  <CustomButton variant='tonal' component='label' color='secondary' fullWidth>
                    Select File (Mock)
                    <input type='file' hidden onChange={e => setFile(e.target.files[0])} />
                  </CustomButton>
                  {file && (
                    <Typography variant='caption' className='block mt-2 text-center'>
                      Selected: {file.name}
                    </Typography>
                  )}
                </Box>
                <CustomButton type='submit' fullWidth>
                  Upload
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
            <CustomDataTable table={table} isLoading={false} columns={columns} />
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

'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import { createColumnHelper, getCoreRowModel, useReactTable, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table'

import { useAuth } from '@/contexts/AuthContext'
import { testService } from '@/api/adminServices'
import { showToast } from '@/utils/toast'
import CustomTextField from '@core/components/mui/TextField'
import CustomDataTable from '@components/CustomDataTable'
import CustomButton from '@components/CustomButton'
import TestDialog from './TestDialog'
import DeleteConfirmationDialog from '@components/DeleteConfirmationDialog'

const columnHelper = createColumnHelper()

const Tests = () => {
  const [testsList, setTestsList] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedTest, setSelectedTest] = useState(null)
  
  // Delete Dialog States
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [testToDelete, setTestToDelete] = useState(null)

  const fetchTests = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await testService.getAll()

      setTestsList(data)
    } catch (err) {
      console.error('Failed to fetch tests:', err)
      showToast('Failed to load tests', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [setTestsList])

  useEffect(() => {
    fetchTests()
  }, [fetchTests])

  const handleDeleteClick = (id) => {
    setTestToDelete(id)
    setOpenDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!testToDelete) return
    
    try {
      await testService.delete(testToDelete)
      setTestsList(prev => prev.filter(t => t._id !== testToDelete))
      showToast('Test deleted successfully!')
      setOpenDeleteDialog(false)
      setTestToDelete(null)
    } catch (err) {
      showToast('Failed to delete test', 'error')
    }
  }

  const handleEdit = (test) => {
    setSelectedTest(test)
    setOpenDialog(true)
  }

  const handleAdd = () => {
    setSelectedTest(null)
    setOpenDialog(true)
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
        <div className='flex items-center'>
          <IconButton onClick={() => handleEdit(row.original)}>
            <i className='tabler-edit text-primary' />
          </IconButton>
          <IconButton onClick={() => handleDeleteClick(row.original._id)}>
            <i className='tabler-trash text-error' />
          </IconButton>
        </div>
      )
    },
    columnHelper.accessor('title', {
      header: 'Test Title',
      cell: ({ row }) => (
        <Typography color='text.primary' className='font-medium'>
          {row.original.title}
        </Typography>
      )
    }),
    columnHelper.accessor('course', {
      header: 'Course',
      cell: ({ row }) => <Typography>{row.original.courseId?.title || row.original.course}</Typography>
    }),
    columnHelper.accessor('questions', {
      header: 'Questions',
      cell: ({ row }) => <Typography>{row.original.questions?.length || 0}</Typography>
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ row }) => (
        <Chip
          label={row.original.status}
          variant='tonal'
          size='small'
          color={row.original.status === 'published' ? 'success' : 'secondary'}
          className='capitalize'
        />
      )
    })
  ], [handleEdit])


  const table = useReactTable({
    data: testsList,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  })

  return (
    <Card>
      <CardHeader 
        title='Test Management' 
        action={
          <div className='flex gap-4'>
            <CustomTextField
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder='Search Test'
              size='small'
            />
            <CustomButton startIcon={<i className='tabler-plus' />} onClick={handleAdd}>
              Create New Test
            </CustomButton>
          </div>
        }
      />
      <CustomDataTable table={table} isLoading={isLoading} columns={columns} />
      
      <TestDialog 
        open={openDialog} 
        handleClose={() => setOpenDialog(false)} 
        test={selectedTest}
        refreshData={fetchTests}
      />

      <DeleteConfirmationDialog 
        open={openDeleteDialog}
        handleClose={() => setOpenDeleteDialog(false)}
        handleConfirm={handleConfirmDelete}
        title="Delete Test"
        message="Are you sure you want to delete this test? This will permanently remove all questions and student results."
      />
    </Card>
  )
}

export default Tests

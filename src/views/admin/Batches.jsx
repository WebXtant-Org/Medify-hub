'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { createColumnHelper, getCoreRowModel, useReactTable, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table'

import { useAuth } from '@/contexts/AuthContext'
import { batchService } from '@/api/adminServices'
import CustomTextField from '@core/components/mui/TextField'
import CustomDataTable from '@components/CustomDataTable'
import CustomButton from '@components/CustomButton'
import BatchDialog from './BatchDialog'
import DeleteConfirmationDialog from '@components/DeleteConfirmationDialog'

const columnHelper = createColumnHelper()

const Batches = () => {
  const [batchesList, setBatchesList] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState(null)
  
  // Delete Dialog States
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [batchToDelete, setBatchToDelete] = useState(null)

  const fetchBatches = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await batchService.getAll()

      setBatchesList(data)
    } catch (err) {
      console.error('Failed to fetch batches:', err)
    } finally {
      setIsLoading(false)
    }
  }, [setBatchesList])

  useEffect(() => {
    fetchBatches()
  }, [fetchBatches])

  const handleDeleteClick = (id) => {
    setBatchToDelete(id)
    setOpenDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!batchToDelete) return
    
    try {
      await batchService.delete(batchToDelete)
      setBatchesList(prev => prev.filter(b => b._id !== batchToDelete))
      setOpenDeleteDialog(false)
      setBatchToDelete(null)
    } catch (err) {
      alert('Failed to delete batch')
    }
  }

  const handleEdit = (batch) => {
    setSelectedBatch(batch)
    setOpenDialog(true)
  }

  const handleAdd = () => {
    setSelectedBatch(null)
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
    columnHelper.accessor('name', {
      header: 'Batch Name',
      cell: ({ row }) => (
        <Typography color='text.primary' className='font-medium'>
          {row.original.name}
        </Typography>
      )
    }),
    columnHelper.accessor('course', {
      header: 'Course',
      cell: ({ row }) => <Typography>{row.original.courseId?.title || row.original.course}</Typography>
    }),
    columnHelper.accessor('timing', {
      header: 'Timing',
      cell: ({ row }) => <Typography>{row.original.timing}</Typography>
    }),
    columnHelper.accessor('faculty', {
      header: 'Faculty',
      cell: ({ row }) => <Typography>{row.original.facultyId?.name || row.original.faculty}</Typography>
    })
  ], [handleEdit])


  const table = useReactTable({
    data: batchesList,
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
        title='Active Batches' 
        action={
          <div className='flex gap-4'>
            <CustomTextField
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder='Search Batch'
              size='small'
            />
            <CustomButton startIcon={<i className='tabler-plus' />} onClick={handleAdd}>
              Add Batch
            </CustomButton>
          </div>
        }
      />
      <CustomDataTable table={table} isLoading={isLoading} columns={columns} />
      
      <BatchDialog 
        open={openDialog} 
        handleClose={() => setOpenDialog(false)} 
        batch={selectedBatch}
        refreshData={fetchBatches}
      />

      <DeleteConfirmationDialog 
        open={openDeleteDialog}
        handleClose={() => setOpenDeleteDialog(false)}
        handleConfirm={handleConfirmDelete}
        title="Delete Batch"
        message="Are you sure you want to delete this batch? This will permanently remove it from the system."
      />
    </Card>
  )
}

export default Batches

'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { createColumnHelper, getCoreRowModel, useReactTable, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table'

import { useAuth } from '@/contexts/AuthContext'
import { facultyService } from '@/api/adminServices'
import CustomTextField from '@core/components/mui/TextField'
import CustomDataTable from '@components/CustomDataTable'
import CustomButton from '@components/CustomButton'
import FacultyDialog from './FacultyDialog'
import DeleteConfirmationDialog from '@components/DeleteConfirmationDialog'

const columnHelper = createColumnHelper()

const Faculty = () => {
  const [facultyList, setFacultyList] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState(null)
  
  // Delete Dialog States
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [staffToDelete, setStaffToDelete] = useState(null)

  const fetchFaculty = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await facultyService.getAll()

      setFacultyList(data)
    } catch (err) {
      console.error('Failed to fetch faculty:', err)
    } finally {
      setIsLoading(false)
    }
  }, [setFacultyList])

  useEffect(() => {
    fetchFaculty()
  }, [fetchFaculty])

  const handleDeleteClick = (id) => {
    setStaffToDelete(id)
    setOpenDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!staffToDelete) return
    
    try {
      await facultyService.delete(staffToDelete)
      setFacultyList(prev => prev.filter(s => s._id !== staffToDelete))
      setOpenDeleteDialog(false)
      setStaffToDelete(null)
    } catch (err) {
      alert('Failed to delete staff member')
    }
  }

  const handleEdit = (staff) => {
    setSelectedStaff(staff)
    setOpenDialog(true)
  }

  const handleAdd = () => {
    setSelectedStaff(null)
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
      header: 'Name',
      cell: ({ row }) => (
        <Typography color='text.primary' className='font-medium'>
          {row.original.name}
        </Typography>
      )
    }),
    columnHelper.accessor('specialty', {
      header: 'Specialty',
      cell: ({ row }) => <Typography>{row.original.specialty}</Typography>
    }),
    columnHelper.accessor('salary', {
      header: 'Salary',
      cell: ({ row }) => <Typography color='primary' className='font-medium'>${row.original.salary}</Typography>
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ row }) => (
        <Chip
          label={row.original.status}
          variant='tonal'
          size='small'
          color={row.original.status === 'Active' ? 'success' : row.original.status === 'On Leave' ? 'warning' : 'error'}
          className='capitalize'
        />
      )
    })
  ], [handleEdit])


  const table = useReactTable({
    data: facultyList,
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
        title='Faculty Management' 
        action={
          <div className='flex gap-4'>
            <CustomTextField
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder='Search Staff'
              size='small'
            />
            <CustomButton startIcon={<i className='tabler-plus' />} onClick={handleAdd}>
              Add Staff
            </CustomButton>
          </div>
        }
      />
      <CustomDataTable table={table} isLoading={isLoading} columns={columns} />
      
      <FacultyDialog 
        open={openDialog} 
        handleClose={() => setOpenDialog(false)} 
        staff={selectedStaff}
        refreshData={fetchFaculty}
      />

      <DeleteConfirmationDialog 
        open={openDeleteDialog}
        handleClose={() => setOpenDeleteDialog(false)}
        handleConfirm={handleConfirmDelete}
        title="Delete Staff Member"
        message="Are you sure you want to delete this staff member? This will remove their profile and association with any batches."
      />
    </Card>
  )
}

export default Faculty

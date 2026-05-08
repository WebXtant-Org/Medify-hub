'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'

import { createColumnHelper, useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table'

import { useAuth } from '@/contexts/AuthContext'
import { studentService } from '@/api/adminServices'
import { formatDate } from '@/utils/date'
import CustomTextField from '@core/components/mui/TextField'
import CustomDataTable from '@components/CustomDataTable'
import CustomButton from '@components/CustomButton'
import StudentDialog from './StudentDialog'
import DeleteConfirmationDialog from '@components/DeleteConfirmationDialog'


const columnHelper = createColumnHelper()

const Students = () => {
  const [studentsList, setStudentsList] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  
  // Delete Dialog States
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState(null)

  const fetchStudents = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await studentService.getAll()

      setStudentsList(data)
    } catch (err) {
      console.error('Failed to fetch students:', err)
    } finally {
      setIsLoading(false)
    }
  }, [setStudentsList])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  const handleDeleteClick = (id) => {
    setStudentToDelete(id)
    setOpenDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return
    
    try {
      await studentService.delete(studentToDelete)
      setStudentsList(prev => prev.filter(s => s._id !== studentToDelete))
      setOpenDeleteDialog(false)
      setStudentToDelete(null)
    } catch (err) {
      alert('Failed to delete student')
    }
  }

  const handleEdit = (student) => {
    setSelectedStudent(student)
    setOpenDialog(true)
  }

  const handleAdd = () => {
    setSelectedStudent(null)
    setOpenDialog(true)
  }

  const statusObj = useMemo(() => ({
    Active: 'success',
    Hold: 'warning',
    Terminated: 'error'
  }), [])

  const feesStatusObj = useMemo(() => ({
    Paid: 'success',
    Pending: 'error',
    Partial: 'info'
  }), [])

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
      header: 'Student Name',
      cell: ({ row }) => (
        <Typography color='text.primary' className='font-medium'>
          {row.original.name}
        </Typography>
      )
    }),
    columnHelper.accessor('mobile', {
      header: 'Mobile',
      cell: ({ row }) => <Typography>{row.original.mobile}</Typography>
    }),
    columnHelper.accessor('personalEmail', {
      header: 'Personal Email',
      cell: ({ row }) => <Typography variant='body2'>{row.original.personalEmail || 'N/A'}</Typography>
    }),
    columnHelper.accessor('courseIds', {
      header: 'Course',
      cell: ({ row }) => {
        const courses = row.original.courseIds || []
        
        return <Typography>{courses.map(c => c.title || c.name).join(', ') || 'N/A'}</Typography>
      }
    }),
    columnHelper.accessor('batchId', {
      header: 'Batch',
      cell: ({ row }) => <Typography>{row.original.batchId?.name || 'N/A'}</Typography>
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ row }) => (
        <Chip
          label={row.original.status}
          variant='tonal'
          size='small'
          color={statusObj[row.original.status]}
          className='capitalize'
        />
      )
    }),
    columnHelper.accessor('feesStatus', {
      header: 'Fees Status',
      cell: ({ row }) => {
        const status = row.original.feesStatus || 'Pending'
        
        return (
          <Chip
            label={status}
            variant='tonal'
            size='small'
            color={feesStatusObj[status] || 'secondary'}
          />
        )
      }
    }),
    columnHelper.accessor('lastLogin', {
      header: 'Last Login',
      cell: ({ row }) => <Typography variant='body2'>{formatDate(row.original.lastLogin)}</Typography>
    })
  ], [statusObj, feesStatusObj])


  const table = useReactTable({
    data: studentsList,
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
        title='Students Management' 
        action={
          <div className='flex gap-4'>
            <CustomTextField
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder='Search Student'
              size='small'
            />
            <CustomButton startIcon={<i className='tabler-plus' />} onClick={handleAdd}>
              Add Student
            </CustomButton>
          </div>
        }
      />
      <CustomDataTable table={table} isLoading={isLoading} columns={columns} />
      
      <StudentDialog 
        open={openDialog} 
        handleClose={() => setOpenDialog(false)} 
        student={selectedStudent}
        refreshData={fetchStudents}
      />

      <DeleteConfirmationDialog 
        open={openDeleteDialog}
        handleClose={() => setOpenDeleteDialog(false)}
        handleConfirm={handleConfirmDelete}
        title="Delete Student"
        message="Are you sure you want to delete this student? This will permanently remove their record from the system."
      />
    </Card>
  )
}

export default Students

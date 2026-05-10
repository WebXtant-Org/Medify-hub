'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import { createColumnHelper, getCoreRowModel, useReactTable, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table'

import { useAuth } from '@/contexts/AuthContext'
import { courseService } from '@/api/adminServices'
import CustomTextField from '@core/components/mui/TextField'
import CustomDataTable from '@components/CustomDataTable'
import CustomButton from '@components/CustomButton'
import CourseDialog from './CourseDialog'
import CourseAssignmentDialog from './CourseAssignmentDialog'
import DeleteConfirmationDialog from '@components/DeleteConfirmationDialog'

const columnHelper = createColumnHelper()

const Courses = () => {
  const [coursesList, setCoursesList] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [openAssignDialog, setOpenAssignDialog] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  
  // Delete Dialog States
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState(null)

  const fetchCourses = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await courseService.getAll()

      setCoursesList(data)
    } catch (err) {
      console.error('Failed to fetch courses:', err)
    } finally {
      setIsLoading(false)
    }
  }, [setCoursesList])

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  const handleDeleteClick = (id) => {
    setCourseToDelete(id)
    setOpenDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!courseToDelete) return
    
    try {
      await courseService.delete(courseToDelete)
      setCoursesList(prev => prev.filter(c => c._id !== courseToDelete))
      setOpenDeleteDialog(false)
      setCourseToDelete(null)
    } catch (err) {
      alert('Failed to delete course')
    }
  }

  const handleEdit = (course) => {
    setSelectedCourse(course)
    setOpenDialog(true)
  }

  const handleAssign = (course) => {
    setSelectedCourse(course)
    setOpenAssignDialog(true)
  }

  const handleAdd = () => {
    setSelectedCourse(null)
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
        <div className='flex items-center gap-1'>
          <IconButton size='small' color='primary' onClick={() => handleAssign(row.original)}>
            <i className='tabler-users-plus' />
          </IconButton>
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
      header: 'Course Title',
      cell: ({ row }) => (
        <Typography color='text.primary' className='font-medium'>
          {row.original.title}
        </Typography>
      )
    }),
    columnHelper.accessor('duration', {
      header: 'Duration',
      cell: ({ row }) => <Typography>{row.original.duration}</Typography>
    }),
    columnHelper.accessor('price', {
      header: 'Price',
      cell: ({ row }) => <Typography color='primary' className='font-medium'>${row.original.price}</Typography>
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ row }) => (
        <Chip
          label={row.original.status}
          variant='tonal'
          size='small'
          color={row.original.status === 'active' ? 'success' : 'error'}
          className='capitalize'
        />
      )
    })
  ], [])


  const table = useReactTable({
    data: coursesList,
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
        title='Course Management' 
        action={
          <div className='flex gap-4'>
            <CustomTextField
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder='Search Course'
              size='small'
            />
            <CustomButton startIcon={<i className='tabler-plus' />} onClick={handleAdd}>
              Create Course
            </CustomButton>
          </div>
        }
      />
      <CustomDataTable table={table} isLoading={isLoading} columns={columns} />
      
      <CourseDialog 
        open={openDialog} 
        handleClose={() => setOpenDialog(false)} 
        course={selectedCourse}
        refreshData={fetchCourses}
      />

      <CourseAssignmentDialog
        open={openAssignDialog}
        handleClose={() => setOpenAssignDialog(false)}
        course={selectedCourse}
        refreshData={fetchCourses}
      />

      <DeleteConfirmationDialog 
        open={openDeleteDialog}
        handleClose={() => setOpenDeleteDialog(false)}
        handleConfirm={handleConfirmDelete}
        title="Delete Course"
        message="Are you sure you want to delete this course? This will permanently remove it and its associated materials."
      />
    </Card>
  )
}

export default Courses

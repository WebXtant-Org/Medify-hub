'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { createColumnHelper, getCoreRowModel, useReactTable, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table'

import { achieverService } from '@/api/adminServices'
import { showToast } from '@/utils/toast'
import CustomTextField from '@core/components/mui/TextField'
import CustomDataTable from '@components/CustomDataTable'
import CustomButton from '@components/CustomButton'
import MediaPreview from '@components/MediaPreview'
import AchieverDialog from './AchieverDialog'
import DeleteConfirmationDialog from '@components/DeleteConfirmationDialog'

const columnHelper = createColumnHelper()

const Achievers = () => {
  const [items, setItems] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedAchiever, setSelectedAchiever] = useState(null)
  
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  const fetchItems = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await achieverService.getAll()
      setItems(data)
    } catch (err) {
      console.error('Failed to fetch achievers:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handleEdit = (achiever) => {
    setSelectedAchiever(achiever)
    setOpenDialog(true)
  }

  const handleAdd = () => {
    setSelectedAchiever(null)
    setOpenDialog(true)
  }

  const handleDeleteClick = (id) => {
    setItemToDelete(id)
    setOpenDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return
    try {
      await achieverService.delete(itemToDelete)
      setItems(prev => prev.filter(i => i._id !== itemToDelete))
      showToast('Achiever record deleted', 'info', { icon: <i className='tabler-trash' /> })
      setOpenDeleteDialog(false)
      setItemToDelete(null)
    } catch (err) {
      showToast('Failed to delete achiever', 'error')
    }
  }

  const columns = useMemo(() => [
    {
      id: 'serialNumber',
      header: 'S.No',
      cell: ({ row }) => <Typography color='text.primary'>{row.index + 1}</Typography>
    },
    columnHelper.accessor('imageUrl', {
      header: 'Photo',
      cell: ({ row }) => (
        <MediaPreview src={row.original.imageUrl} alt={row.original.name} className='rounded-full shadow-sm' />
      )
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: ({ row }) => <Typography color='text.primary' className='font-medium'>{row.original.name}</Typography>
    }),
    columnHelper.accessor('year', {
      header: 'Year',
      cell: ({ row }) => <Typography>{row.original.year}</Typography>
    }),
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
    }
  ], [])

  const table = useReactTable({
    data: items,
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
        title='Achievers Management' 
        action={
          <div className='flex gap-4'>
            <CustomTextField
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder='Search Achiever'
              size='small'
            />
            <CustomButton startIcon={<i className='tabler-plus' />} onClick={handleAdd}>
              Add Achiever
            </CustomButton>
          </div>
        }
      />
      <CustomDataTable table={table} isLoading={isLoading} columns={columns} />
      
      <AchieverDialog 
        open={openDialog} 
        handleClose={() => setOpenDialog(false)} 
        achiever={selectedAchiever}
        refreshData={fetchItems}
      />

      <DeleteConfirmationDialog 
        open={openDeleteDialog}
        handleClose={() => setOpenDeleteDialog(false)}
        handleConfirm={handleConfirmDelete}
        title="Delete Achiever"
        message="Are you sure you want to delete this achiever record?"
      />
    </Card>
  )
}

export default Achievers

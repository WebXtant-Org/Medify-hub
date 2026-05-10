'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { createColumnHelper, getCoreRowModel, useReactTable, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table'

import { galleryService } from '@/api/adminServices'
import CustomTextField from '@core/components/mui/TextField'
import CustomDataTable from '@components/CustomDataTable'
import CustomButton from '@components/CustomButton'
import MediaPreview from '@components/MediaPreview'
import GalleryDialog from './GalleryDialog'
import DeleteConfirmationDialog from '@components/DeleteConfirmationDialog'

const columnHelper = createColumnHelper()

const Gallery = () => {
  const [items, setItems] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  const fetchItems = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await galleryService.getAll()
      setItems(data)
    } catch (err) {
      console.error('Failed to fetch gallery items:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handleDeleteClick = (id) => {
    setItemToDelete(id)
    setOpenDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return
    try {
      await galleryService.delete(itemToDelete)
      setItems(prev => prev.filter(i => i._id !== itemToDelete))
      setOpenDeleteDialog(false)
      setItemToDelete(null)
    } catch (err) {
      alert('Failed to delete item')
    }
  }

  const columns = useMemo(() => [
    {
      id: 'serialNumber',
      header: 'S.No',
      cell: ({ row }) => <Typography color='text.primary'>{row.index + 1}</Typography>
    },
    columnHelper.accessor('imageUrl', {
      header: 'Preview',
      cell: ({ row }) => (
        <MediaPreview src={row.original.imageUrl} alt={row.original.title} />
      )
    }),
    columnHelper.accessor('title', {
      header: 'Title',
      cell: ({ row }) => <Typography color='text.primary' className='font-medium'>{row.original.title}</Typography>
    }),
    columnHelper.accessor('category', {
      header: 'Category',
      cell: ({ row }) => <Typography className='capitalize'>{row.original.category}</Typography>
    }),
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <IconButton onClick={() => handleDeleteClick(row.original._id)}>
          <i className='tabler-trash text-error' />
        </IconButton>
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
        title='Gallery Management' 
        action={
          <div className='flex gap-4'>
            <CustomTextField
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder='Search Item'
              size='small'
            />
            <CustomButton startIcon={<i className='tabler-plus' />} onClick={() => setOpenDialog(true)}>
              Add Image
            </CustomButton>
          </div>
        }
      />
      <CustomDataTable table={table} isLoading={isLoading} columns={columns} />
      
      <GalleryDialog 
        open={openDialog} 
        handleClose={() => setOpenDialog(false)} 
        refreshData={fetchItems}
      />

      <DeleteConfirmationDialog 
        open={openDeleteDialog}
        handleClose={() => setOpenDeleteDialog(false)}
        handleConfirm={handleConfirmDelete}
        title="Delete Gallery Item"
        message="Are you sure you want to delete this image?"
      />
    </Card>
  )
}

export default Gallery

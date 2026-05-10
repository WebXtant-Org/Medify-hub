'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'

import dynamic from 'next/dynamic'

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import { createColumnHelper, getCoreRowModel, useReactTable, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table'

import { useAuth } from '@/contexts/AuthContext'
import { paymentService } from '@/api/adminServices'
import CustomTextField from '@core/components/mui/TextField'
import CustomDataTable from '@components/CustomDataTable'
import CustomButton from '@components/CustomButton'
import DeleteConfirmationDialog from '@components/DeleteConfirmationDialog'

const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const columnHelper = createColumnHelper()

const Payments = () => {
  const { reportsData } = useAuth()
  const [paymentsList, setPaymentsList] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  
  // Delete Dialog States
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [paymentToDelete, setPaymentToDelete] = useState(null)

  const fetchPayments = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await paymentService.getAll()

      setPaymentsList(data)
    } catch (err) {
      console.error('Failed to fetch payments:', err)
    } finally {
      setIsLoading(false)
    }
  }, [setPaymentsList])

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  const handleDeleteClick = (id) => {
    setPaymentToDelete(id)
    setOpenDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (!paymentToDelete) return
    
    try {
      await paymentService.delete(paymentToDelete)
      setPaymentsList(prev => prev.filter(p => p._id !== paymentToDelete))
      setOpenDeleteDialog(false)
      setPaymentToDelete(null)
    } catch (err) {
      alert('Failed to delete transaction')
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
        <div className='flex items-center'>
          <IconButton size='small'>
            <i className='tabler-eye text-primary' />
          </IconButton>
          <IconButton size='small' onClick={() => handleDeleteClick(row.original._id)}>
            <i className='tabler-trash text-error' />
          </IconButton>
        </div>
      )
    },
    columnHelper.accessor('student', {
      header: 'Student',
      cell: ({ row }) => (
        <Typography color='text.primary' className='font-medium'>
          {row.original.student}
        </Typography>
      )
    }),
    columnHelper.accessor('amount', {
      header: 'Amount',
      cell: ({ row }) => <Typography color='primary' className='font-medium'>₹{row.original.amount}</Typography>
    }),
    columnHelper.accessor('date', {
      header: 'Date',
      cell: ({ row }) => <Typography variant='body2'>{row.original.date}</Typography>
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ row }) => (
        <Chip 
          label={row.original.status} 
          size='small' 
          variant='tonal' 
          color={row.original.status === 'Paid' ? 'success' : 'error'} 
        />
      )
    }),
    columnHelper.accessor('emi', {
      header: 'EMI',
      cell: ({ row }) => <Typography variant='body2'>{row.original.emi}</Typography>
    })
  ], [paymentsList])

  const table = useReactTable({
    data: paymentsList,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  })

  const revenueOptions = {
    chart: { toolbar: { show: false } },
    stroke: { curve: 'smooth' },
    colors: ['var(--mui-palette-primary-main)'],
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] }
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardHeader 
              title='Fee Transactions' 
              action={
                <CustomTextField
                  value={globalFilter ?? ''}
                  onChange={e => setGlobalFilter(e.target.value)}
                  placeholder='Search Transaction'
                  size='small'
                />
              }
            />
            <CustomDataTable table={table} isLoading={isLoading} columns={columns} />
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardHeader title='New Fee Entry' />
            <CardContent className='flex flex-col gap-4'>
              <CustomTextField fullWidth label='Student Name' placeholder='Search student...' />
              <CustomTextField fullWidth label='Amount' type='number' />
              <CustomTextField fullWidth label='Payment Date' type='date' slotProps={{ inputLabel: { shrink: true } }} />
              <CustomTextField fullWidth select label='Payment Method'>
                <MenuItem value='Cash'>Cash</MenuItem>
                <MenuItem value='Online'>Online</MenuItem>
                <MenuItem value='Bank Transfer'>Bank Transfer</MenuItem>
              </CustomTextField>
              <CustomButton fullWidth>Record Payment</CustomButton>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Revenue Analytics' />
            <CardContent>
              <AppReactApexCharts 
                type='line' 
                height={350} 
                series={[{ name: 'Revenue', data: reportsData?.revenue || [] }]} 
                options={revenueOptions} 
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <DeleteConfirmationDialog 
        open={openDeleteDialog}
        handleClose={() => setOpenDeleteDialog(false)}
        handleConfirm={handleConfirmDelete}
        title="Delete Transaction"
        message="Are you sure you want to delete this payment transaction? This action cannot be undone and will affect financial reports."
      />
    </>
  )
}

export default Payments

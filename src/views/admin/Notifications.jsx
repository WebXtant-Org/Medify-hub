'use client'

import { useEffect, useMemo, useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import { createColumnHelper, getCoreRowModel, useReactTable, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from '@tanstack/react-table'

import { notificationService } from '@/api/adminServices'
import { showToast } from '@/utils/toast'
import CustomTextField from '@core/components/mui/TextField'
import CustomButton from '@components/CustomButton'
import CustomDataTable from '@components/CustomDataTable'

const columnHelper = createColumnHelper()

const Notifications = () => {
  const [notificationsList, setNotificationsList] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  const fetchNotifications = async () => {
    try {
      setIsLoading(true)
      const data = await notificationService.getAll()

      setNotificationsList(data)
    } catch (err) {
      showToast('Failed to load notifications', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const handleSend = async () => {
    if (!title || !message) return showToast('Please fill all fields', 'error')
    
    try {
      setIsSending(true)
      await notificationService.send({ title, message, type: 'Announcement', isGlobal: true })
      showToast('Announcement sent successfully!')
      setTitle('')
      setMessage('')
      fetchNotifications()
    } catch (err) {
      showToast(err.message || 'Failed to send announcement', 'error')
    } finally {
      setIsSending(false)
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
            <i className='tabler-trash text-error' />
          </IconButton>
        </div>
      )
    },
    columnHelper.accessor('title', {
      header: 'Title',
      cell: ({ row }) => (
        <Typography color='text.primary' className='font-medium'>
          {row.original.title}
        </Typography>
      )
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      cell: ({ row }) => <Chip label={row.original.type} size='small' variant='tonal' color='primary' />
    }),
    columnHelper.accessor('createdAt', {
      header: 'Date',
      cell: ({ row }) => <Typography variant='body2'>{new Date(row.original.createdAt).toLocaleDateString()}</Typography>
    }),
    {
      id: 'status',
      header: 'Status',
      cell: () => <Typography variant='body2' color='success.main'>Sent</Typography>
    }
  ], [])

  const table = useReactTable({
    data: notificationsList,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  })

  return (
    <div className='flex flex-col gap-6'>
      <Card>
        <CardHeader title='Send Announcement' />
        <CardContent className='flex flex-col gap-4'>
          <CustomTextField 
            fullWidth 
            label='Title' 
            placeholder='Announcement Title' 
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <CustomTextField 
            fullWidth 
            multiline 
            rows={3} 
            label='Message' 
            placeholder='Type your message here...' 
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <div className='flex gap-4'>
            <CustomButton onClick={handleSend} loading={isSending}>
              Send to All
            </CustomButton>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader 
          title='Sent Notifications' 
          action={
            <CustomTextField
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder='Search Notifications'
              size='small'
            />
          }
        />
        <CustomDataTable table={table} isLoading={isLoading} columns={columns} />
      </Card>
    </div>
  )
}

export default Notifications

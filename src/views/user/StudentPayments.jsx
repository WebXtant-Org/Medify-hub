'use client'

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import { useAuth } from '@/contexts/AuthContext'
import CardStatsHorizontal from '@components/card-statistics/Horizontal'

import { useEffect, useState } from 'react'
import { paymentService } from '@/api/adminServices'

const StudentPayments = () => {
  const { user } = useAuth()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true)
        const data = await paymentService.getAll()

        setPayments(data)
      } catch (err) {
        console.error('Failed to fetch payments:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [])

  const totalPaid = payments.reduce((acc, curr) => acc + (curr.paidAmount || 0), 0)
  const pendingBalance = payments[0]?.pendingAmount || 0

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }} key='header'>
        <Typography variant='h4'>Payment History & Status</Typography>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <CardStatsHorizontal
          title='Total Paid'
          stats={`$${totalPaid}`}
          avatarIcon='tabler-wallet'
          avatarColor='success'
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <CardStatsHorizontal
          title='Pending Balance'
          stats={`$${pendingBalance}`}
          avatarIcon='tabler-alert-circle'
          avatarColor='error'
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <CardStatsHorizontal
          title='Status'
          stats={payments[0]?.status || 'N/A'}
          avatarIcon='tabler-info-circle'
          avatarColor='info'
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Card>
          <CardHeader title='Transaction History' />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Amount</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                   <TableRow><TableCell colSpan={3} align='center'>Loading transactions...</TableCell></TableRow>
                ) : payments[0]?.installments.map((inst, index) => (
                  <TableRow key={`payment-${index}`}>
                    <TableCell className='font-medium'>${inst.amount}</TableCell>
                    <TableCell>{new Date(inst.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip label={inst.status} size='small' color={inst.status === 'paid' ? 'success' : 'warning'} variant='tonal' />
                    </TableCell>
                  </TableRow>
                ))}
                {(!loading && (!payments[0] || payments[0].installments.length === 0)) && (
                  <TableRow>
                    <TableCell colSpan={3} align='center'>No payment records found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>
    </Grid>
  )
}

export default StudentPayments

'use client'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import { useEffect, useState } from 'react'
import { logService } from '@/api/adminServices'
import Typography from '@mui/material/Typography'

const Logs = () => {
  const [auditLogs, setAuditLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true)
        const data = await logService.getAudit()

        setAuditLogs(data)
      } catch (err) {
        console.error('Failed to fetch audit logs:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [])

  if (loading) return <Typography sx={{ p: 4 }}>Loading Audit Logs...</Typography>

  return (
    <Card>
      <CardHeader title='Audit Logs' />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Admin</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {auditLogs.map((log, index) => (
              <TableRow key={`audit-${log._id}-${index}`}>
                <TableCell className='font-medium'>{log.userId?.name || 'Admin'}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell className='max-w-xs truncate' title={log.details}>{log.details}</TableCell>
                <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
            {auditLogs.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align='center'>No audit logs recorded yet.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}

export default Logs

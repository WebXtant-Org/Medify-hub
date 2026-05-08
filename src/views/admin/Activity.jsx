'use client'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Chip from '@mui/material/Chip'

import { useEffect, useState } from 'react'
import { logService } from '@/api/adminServices'
import Typography from '@mui/material/Typography'

const Activity = () => {
  const [activityLogs, setActivityLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true)
        const data = await logService.getActivity()

        setActivityLogs(data)
      } catch (err) {
        console.error('Failed to fetch activity logs:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [])

  if (loading) return <Typography sx={{ p: 4 }}>Loading Activity Logs...</Typography>

  return (
    <Card>
      <CardHeader title='User Activity Logs' />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activityLogs.map((log, index) => (
              <TableRow key={`activity-${log._id}-${index}`}>
                <TableCell className='font-medium'>{log.userId?.name || 'System'}</TableCell>
                <TableCell>
                  <Chip 
                    label={log.action} 
                    color={log.action.includes('LOGIN') ? 'success' : 'info'} 
                    size='small' 
                    variant='tonal' 
                  />
                </TableCell>
                <TableCell>{log.details}</TableCell>
                <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
            {activityLogs.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align='center'>No activity recorded yet.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}

export default Activity

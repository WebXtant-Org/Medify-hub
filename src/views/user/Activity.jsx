'use client'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import { useAuth } from '@/contexts/AuthContext'

const UserActivity = () => {
  const { user, activityLogs } = useAuth()
  
  // Filter activity logs to only show actions for the current user
  const userLogs = activityLogs.filter(log => log.user === user?.name)

  return (
    <Card>
      <CardHeader title='My Activity History' />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Action</TableCell>
              <TableCell>Device</TableCell>
              <TableCell>Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userLogs.map(log => (
              <TableRow key={log.id}>
                <TableCell className='font-medium'>{log.action}</TableCell>
                <TableCell>{log.device}</TableCell>
                <TableCell>{new Date(log.time).toLocaleString()}</TableCell>
              </TableRow>
            ))}
            {userLogs.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align='center'>No activity recorded yet.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}

export default UserActivity

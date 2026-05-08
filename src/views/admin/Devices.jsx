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
import Button from '@mui/material/Button'

import { useAuth } from '@/contexts/AuthContext'

const Devices = () => {
  const { devices, setDevices, logAudit } = useAuth()

  const handleForceLogout = (deviceId, userName) => {
    // Simulate force logout by marking it Inactive
    const updated = devices.map(d => 
      d.deviceId === deviceId ? { ...d, status: 'Inactive' } : d
    )

    setDevices(updated)
    logAudit('Admin', 'Forced Device Logout', `User: ${userName}, Device ID: ${deviceId}`)
  }

  return (
    <Card>
      <CardHeader title='Device Management' />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Device Name</TableCell>
              <TableCell>Last Login</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {devices.map(device => (
              <TableRow key={device.id}>
                <TableCell className='font-medium'>{device.user}</TableCell>
                <TableCell>{device.deviceName}</TableCell>
                <TableCell>{new Date(device.lastLogin).toLocaleString()}</TableCell>
                <TableCell>
                  <Chip 
                    label={device.status} 
                    color={device.status === 'Active' ? 'success' : 'secondary'} 
                    size='small' 
                    variant='tonal' 
                  />
                </TableCell>
                <TableCell>
                  <Button 
                    variant='outlined' 
                    color='error' 
                    size='small'
                    disabled={device.status !== 'Active'}
                    onClick={() => handleForceLogout(device.deviceId, device.user)}
                  >
                    Force Logout
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {devices.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align='center'>No devices registered.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}

export default Devices

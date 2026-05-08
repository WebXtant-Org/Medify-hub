'use client'

import { useState, useEffect, useCallback } from 'react'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Switch from '@mui/material/Switch'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'

import { useAuth } from '@/contexts/AuthContext'
import { showToast } from '@/utils/toast'


const Users = () => {
  const { materialsList } = useAuth()
  
  const [usersList, setUsersList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [openAdd, setOpenAdd] = useState(false)
  const [openAssign, setOpenAssign] = useState(false)
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'admin', status: 'Active' })
  const [selectedUser, setSelectedUser] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [assignedMaterials, setAssignedMaterials] = useState([])

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true)


      // Fetch both admins and faculty for this view
      const [admins, faculty] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users?role=admin`).then(res => res.json()),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users?role=faculty`).then(res => res.json())
      ])

      setUsersList([...admins, ...faculty])
    } catch (err) {
      console.error('Failed to fetch users:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleDelete = id => {
    setUsersList(usersList.filter(u => u.id !== id))
  }

  const handleToggleStatus = (id, currentStatus) => {
    const updated = usersList.map(u => {
      if (u.id === id) {
        return { ...u, status: currentStatus === 'Active' ? 'Inactive' : 'Active' }
      }

      
return u
    })

    setUsersList(updated)
  }

  const handleAddUser = async () => {
    if (newUser.name && newUser.email) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ ...newUser, password: 'password123' }) // Default password
        })
        fetchUsers()
        setOpenAdd(false)
        setNewUser({ name: '', email: '', role: 'admin', status: 'Active' })
        showToast('User added successfully!')
      } catch (err) {
        console.error('Failed to add user:', err)
        showToast('Failed to add user', 'error')
      }
    }
  }

  const handleMenuClick = (event, user) => {
    setAnchorEl(event.currentTarget)
    setSelectedUser(user)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const openAssignModal = () => {
    setOpenAssign(true)
    handleMenuClose()
  }

  const handleAssignSave = () => {
    // In a real app, save to backend. For now, just close.
    setOpenAssign(false)
  }

  const handleMaterialToggle = (materialId) => {
    setAssignedMaterials(prev => 
      prev.includes(materialId) 
        ? prev.filter(id => id !== materialId)
        : [...prev, materialId]
    )
  }

  return (
    <>
      <Card>
        <CardHeader
          title='User Management'
          action={
            <Button variant='contained' onClick={() => setOpenAdd(true)} startIcon={<i className='tabler-plus' />}>
              Add User
            </Button>
          }
        />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell>Device</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align='center'>Loading users...</TableCell>
                </TableRow>
              ) : usersList.map(user => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email} <Chip label={user.role} size='small' variant='tonal' className='ml-2 capitalize' /></TableCell>
                  <TableCell>
                    <Switch 
                      checked={user.status?.toLowerCase() === 'active'} 
                      onChange={() => handleToggleStatus(user._id, user.status)} 
                      color="success"
                    />
                  </TableCell>
                  <TableCell>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</TableCell>
                  <TableCell>{user.deviceId || 'None'}</TableCell>
                  <TableCell>
                    <IconButton size='small' onClick={(e) => handleMenuClick(e, user)}>
                      <i className='tabler-dots-vertical' />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && usersList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align='center'>
                    No administrative users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose}><i className='tabler-eye mr-2' /> View Details</MenuItem>
        <MenuItem onClick={openAssignModal}><i className='tabler-book mr-2' /> Assign Materials</MenuItem>
        <MenuItem onClick={() => { handleDelete(selectedUser?.id); handleMenuClose(); }} className='text-error'>
          <i className='tabler-trash mr-2' /> Delete
        </MenuItem>
      </Menu>

      {/* Add User Modal */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent className='flex flex-col gap-4 pt-4'>
          <TextField
            label='Name'
            fullWidth
            value={newUser.name}
            onChange={e => setNewUser({ ...newUser, name: e.target.value })}
            className='mt-2'
          />
          <TextField
            label='Email'
            fullWidth
            type='email'
            value={newUser.email}
            onChange={e => setNewUser({ ...newUser, email: e.target.value })}
          />
          <TextField
            select
            label='Role'
            fullWidth
            value={newUser.role}
            onChange={e => setNewUser({ ...newUser, role: e.target.value })}
          >
            <MenuItem value='admin'>Admin</MenuItem>
            <MenuItem value='faculty'>Faculty</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)} color='secondary'>
            Cancel
          </Button>
          <Button onClick={handleAddUser} variant='contained'>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Materials Modal */}
      <Dialog open={openAssign} onClose={() => setOpenAssign(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Assign Materials to {selectedUser?.name}</DialogTitle>
        <DialogContent className='pt-4'>
          <FormGroup>
            {materialsList.map(mat => (
              <FormControlLabel 
                key={mat.id} 
                control={<Checkbox checked={assignedMaterials.includes(mat.id)} onChange={() => handleMaterialToggle(mat.id)} />} 
                label={mat.title} 
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssign(false)} color='secondary'>Cancel</Button>
          <Button onClick={handleAssignSave} variant='contained'>Assign</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Users

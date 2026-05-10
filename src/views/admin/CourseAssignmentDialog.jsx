'use client'

import { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Box from '@mui/material/Box'

import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import { studentService, courseService } from '@/api/adminServices'
import { showToast } from '@/utils/toast'

const CourseAssignmentDialog = ({ open, handleClose, course, refreshData }) => {
  const [students, setStudents] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await studentService.getAll()
        setStudents(data)
      } catch (err) {
        console.error('Failed to fetch students:', err)
      }
    }

    if (open) fetchStudents()
  }, [open])

  useEffect(() => {
    if (course && open) {
      setSelectedIds(course.assignedUserIds || [])
    }
  }, [course, open])

  const handleToggle = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredStudents.map(s => s._id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await courseService.assignUsers(course._id, selectedIds)
      showToast('Course access updated successfully!')
      refreshData()
      handleClose()
    } catch (err) {
      showToast(err.message || 'Failed to update access', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const filteredStudents = students.filter(s => 
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth='md' 
      fullWidth 
      scroll='body'
      PaperProps={{ sx: { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={handleClose} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      
      <DialogTitle sx={{ textAlign: 'center', pbe: 4 }}>
        <Typography variant='h5' component='span'>Course Access Management</Typography>
        <Typography variant='body2' color='text.secondary'>
          Assign which students can access <strong>{course?.title}</strong>
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pbs: 0 }}>
        <Box sx={{ mb: 4 }}>
          <CustomTextField
            fullWidth
            placeholder='Search students by name or ID...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: <i className='tabler-search mr-2 text-textSecondary' />
              }
            }}
          />
        </Box>

        <TableContainer sx={{ border: '1px solid var(--mui-palette-divider)', borderRadius: '8px', maxHeight: '400px' }}>
          <Table stickyHeader size='small'>
            <TableHead>
              <TableRow>
                <TableCell padding='checkbox'>
                  <Checkbox 
                    indeterminate={selectedIds.length > 0 && selectedIds.length < filteredStudents.length}
                    checked={filteredStudents.length > 0 && selectedIds.length === filteredStudents.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>STUDENT NAME</TableCell>
                <TableCell>LOGIN ID</TableCell>
                <TableCell>BATCH</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student._id} hover selected={selectedIds.includes(student._id)}>
                  <TableCell padding='checkbox'>
                    <Checkbox 
                      checked={selectedIds.includes(student._id)}
                      onChange={() => handleToggle(student._id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2' color='text.primary' className='font-medium'>
                      {student.name}
                    </Typography>
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.batchId?.name || 'N/A'}</TableCell>
                </TableRow>
              ))}
              {filteredStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align='center' sx={{ py: 4 }}>
                    <Typography variant='body2' color='text.secondary'>No students found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Typography variant='caption' color='text.secondary'>
            {selectedIds.length} students selected for access
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', pbe: 8 }}>
        <Button variant='contained' onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Update Access'}
        </Button>
        <Button variant='tonal' color='secondary' onClick={handleClose}>
          Discard
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CourseAssignmentDialog

'use client'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

const DeleteConfirmationDialog = ({ open, handleClose, handleConfirm, title, message }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='delete-dialog-title'
      aria-describedby='delete-dialog-description'
    >
      <DialogTitle id='delete-dialog-title'>
        <div className='flex items-center gap-2'>
          <i className='tabler-alert-triangle text-error text-2xl' />
          <span>{title || 'Delete Confirmation'}</span>
        </div>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id='delete-dialog-description' component='div'>
          <Typography color='text.primary' className='mb-2'>
            {message || 'Are you sure you want to delete this item? This action cannot be undone.'}
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions className='pb-6 px-6'>
        <Button onClick={handleClose} variant='outlined' color='secondary'>
          Cancel
        </Button>
        <Button 
          onClick={handleConfirm} 
          variant='contained' 
          color='error' 
          autoFocus
          startIcon={<i className='tabler-trash' />}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteConfirmationDialog

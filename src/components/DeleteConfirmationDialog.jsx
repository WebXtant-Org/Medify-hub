'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

const DeleteConfirmationDialog = ({ open, handleClose, handleConfirm, title, message }) => {
  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          handleClose()
        }
      }}
      closeAfterTransition={false}
    >
      <DialogTitle id='alert-dialog-title'>{title || 'Confirm Delete'}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          {message || 'Are you sure you want to delete this item? This action cannot be undone.'}
        </DialogContentText>
      </DialogContent>
      <DialogActions className='dialog-actions-dense'>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleConfirm} color='error' variant='contained'>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteConfirmationDialog

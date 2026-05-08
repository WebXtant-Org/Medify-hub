'use client'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

const SubmitConfirmationDialog = ({ open, handleClose, handleSubmit, stats }) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth='xs' fullWidth>
      <DialogTitle className='text-center pt-8'>
        <i className='tabler-alert-circle text-5xl text-warning mb-4' />
        <Typography variant='h4'>Finish Test?</Typography>
      </DialogTitle>
      <DialogContent>
        <Typography className='text-center mb-6'>
          Are you sure you want to submit the test? You won{"'"}t be able to change your answers after submission.
        </Typography>

        <Box className='bg-actionHover p-4 rounded-lg flex justify-around'>
          <Box className='text-center'>
            <Typography variant='h6'>{stats.total}</Typography>
            <Typography variant='caption'>Total</Typography>
          </Box>
          <Box className='text-center'>
            <Typography variant='h6' color='success.main'>{stats.answered}</Typography>
            <Typography variant='caption'>Answered</Typography>
          </Box>
          <Box className='text-center'>
            <Typography variant='h6' color='error.main'>{stats.unanswered}</Typography>
            <Typography variant='caption'>Unanswered</Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions className='justify-center pb-8 gap-4'>
        <Button variant='outlined' color='secondary' onClick={handleClose}>
          Cancel
        </Button>
        <Button variant='contained' color='primary' onClick={handleSubmit}>
          Yes, Submit Test
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SubmitConfirmationDialog

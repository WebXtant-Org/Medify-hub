'use client'

import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { styled } from '@mui/material/styles'

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 500,
  padding: '8px 20px',
  position: 'relative',
  '&.MuiButton-containedPrimary': {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  '&.MuiButton-tonal': {
    backgroundColor: theme.palette.primary.lighterOpacity,
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.lightOpacity,
    },
  },
  '&:disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
}))

const CustomButton = ({ children, variant = 'contained', color = 'primary', loading = false, disabled, ...props }) => {
  return (
    <StyledButton 
      variant={variant} 
      color={color} 
      disabled={disabled || loading} 
      {...props}
    >
      {loading && (
        <CircularProgress
          size={20}
          color="inherit"
          sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            marginLeft: '-10px',
            marginTop: '-10px',
          }}
        />
      )}
      <span style={{ visibility: loading ? 'hidden' : 'visible', display: 'flex', alignItems: 'center', gap: '8px' }}>
        {children}
      </span>
    </StyledButton>
  )
}

export default CustomButton

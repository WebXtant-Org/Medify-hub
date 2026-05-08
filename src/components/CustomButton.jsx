'use client'

import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 500,
  padding: '8px 20px',
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
}))

const CustomButton = ({ children, variant = 'contained', color = 'primary', ...props }) => {
  return (
    <StyledButton variant={variant} color={color} {...props}>
      {children}
    </StyledButton>
  )
}

export default CustomButton

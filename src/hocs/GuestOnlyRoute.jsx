'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import CircularProgress from '@mui/material/CircularProgress'

import Box from '@mui/material/Box'

import { useAuth } from '@/contexts/AuthContext'


const GuestOnlyRoute = ({ children }) => {
  const { token, role, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && token) {
      if (role === 'admin') {
        router.replace('/admin/dashboard')
      } else {
        router.replace('/dashboard/courses')
      }
    }
  }, [loading, token, role, router])

  if (loading || token) {
    return (
      <Box className="flex items-center justify-center min-bs-[100dvh]">
        <CircularProgress />
      </Box>
    )
  }

  return <>{children}</>
}

export default GuestOnlyRoute

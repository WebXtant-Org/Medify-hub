'use client'

import { useEffect } from 'react'

import { useRouter, usePathname, useParams } from 'next/navigation'

import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

import { useAuth } from '@/contexts/AuthContext'


export default function RoleGuard({ children, allowedRoles }) {
  const { role, loading, token } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const { lang: locale } = useParams()

  useEffect(() => {
    if (!loading) {
      if (!token || !role) {
        router.replace('/login')
      } else if (allowedRoles && !allowedRoles.includes(role)) {
        // User is logged in but doesn't have the right role
        if (role === 'admin') {
          router.replace('/admin/dashboard')
        } else if (role === 'student' || role === 'user') {
          router.replace('/dashboard/courses')
        } else {
          router.replace('/login')
        }
      }
    }
  }, [role, loading, token, router, allowedRoles, pathname])

  if (loading || !token || !role || (allowedRoles && !allowedRoles.includes(role))) {
    return (
      <Box className="flex items-center justify-center min-bs-[100dvh]">
        <CircularProgress />
      </Box>
    )
  }

  return <>{children}</>
}

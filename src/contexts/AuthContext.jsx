'use client'

// React Imports
import { createContext, useContext, useEffect, useState } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// API Imports
import { settingsService, reportService } from '@/api/adminServices'

// Create Context
export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  // States
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [appSettings, setAppSettings] = useState(null)
  const [reportsData, setReportsData] = useState({ revenue: [], admissions: [] })

  // Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token')
      const storedUser = localStorage.getItem('userData')

      if (token && storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          
          // Fetch settings and reports if logged in
          settingsService.get().then(setAppSettings).catch(console.error)
          if (userData.role === 'admin') {
            reportService.getCharts().then(setReportsData).catch(console.error)
          }
        } catch (e) {
          localStorage.removeItem('token')
          localStorage.removeItem('userData')
        }
      }

      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password, 
          deviceId: localStorage.getItem('deviceId') || 'web-client-' + Math.random().toString(36).substring(7) 
        })
      })

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response. Please check if backend is running.')
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password')
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('userData', JSON.stringify(data))
      setUser(data)

      // Fetch app settings after login
      try {
        const settings = await settingsService.get()
        setAppSettings(settings)
      } catch (err) {
        console.error('Failed to load settings:', err)
      }

      // Fetch reports data if admin
      if (data.role === 'admin') {
        try {
          const charts = await reportService.getCharts()
          setReportsData(charts)
        } catch (err) {
          console.error('Failed to load reports:', err)
        }
      }

      return data
    } catch (err) {
      throw err
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userData')
    setUser(null)
    router.push('/login')
  }

  const sendOTP = async (studentId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP')
      }

      return data
    } catch (err) {
      throw err
    }
  }

  const verifyOTP = async (studentId, otp) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          studentId, 
          otp,
          deviceId: localStorage.getItem('deviceId') || 'web-client-' + Math.random().toString(36).substring(7)
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed')
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('userData', JSON.stringify(data))
      setUser(data)

      // Fetch app settings after login
      try {
        const settings = await settingsService.get()
        setAppSettings(settings)
      } catch (err) {
        console.error('Failed to load settings:', err)
      }

      // Fetch reports data if admin
      if (data.role === 'admin') {
        try {
          const charts = await reportService.getCharts()
          setReportsData(charts)
        } catch (err) {
          console.error('Failed to load reports:', err)
        }
      }

      return data
    } catch (err) {
      throw err
    }
  }

  const verifyCredentials = async (studentId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-credentials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Invalid Student ID')
      }

      return data
    } catch (err) {
      throw err
    }
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        role: user?.role, 
        token: user?.token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null),
        loading, 
        login, 
        logout, 
        sendOTP, 
        verifyOTP, 
        verifyCredentials, 
        appSettings,
        reportsData 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

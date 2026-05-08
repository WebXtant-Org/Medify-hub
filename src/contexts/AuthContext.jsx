'use client'

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'

import { useRouter, useParams } from 'next/navigation'



import { settingsService } from '@/api/adminServices'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deviceId, setDeviceId] = useState(null)
  const [appSettings, setAppSettings] = useState({ singleDeviceLogin: true, watermarkEnable: true, platformName: 'Medify Hub' })
  const [activityLogs, setActivityLogs] = useState([])
  const [auditLogs, setAuditLogs] = useState([])
  const [devices, setDevices] = useState([])
  const [studentsList, setStudentsList] = useState([])
  const [coursesList, setCoursesList] = useState([])
  const [batchesList, setBatchesList] = useState([])
  const [facultyList, setFacultyList] = useState([])
  const [paymentsList, setPaymentsList] = useState([])
  const [testsList, setTestsList] = useState([])
  const [notificationsList, setNotificationsList] = useState([])
  const [reportsData, setReportsData] = useState({ revenue: [], admissions: [] })

  const router = useRouter()
  const { lang: locale } = useParams()

  useEffect(() => {
    // Check if token exists in localStorage
    const storedToken = localStorage.getItem('token')
    const storedRole = localStorage.getItem('role')
    const storedUser = localStorage.getItem('user')
    const storedDeviceId = localStorage.getItem('deviceId')

    // Safe JSON Parse Helper
    const safeParse = (key, fallback) => {
      const value = localStorage.getItem(key)

      if (value && value !== 'undefined') {
        try {
          return JSON.parse(value)
        } catch (e) {
          return fallback
        }
      }

      
return fallback
    }

    if (storedToken && storedRole) {
      const expectedDeviceId = localStorage.getItem('expectedDeviceId')
      const savedSettingsStr = localStorage.getItem('appSettings')
      let isSingleDeviceEnabled = true
      
      if (savedSettingsStr && savedSettingsStr !== 'undefined') {
        try {
          isSingleDeviceEnabled = JSON.parse(savedSettingsStr)?.singleDeviceLogin !== false
        } catch (e) {}
      }

      if (isSingleDeviceEnabled && expectedDeviceId && storedDeviceId !== expectedDeviceId) {
        handleLogout('Device Mismatch - AuthContext Effect')
      } else {
        setToken(storedToken)
        setRole(storedRole)
        setDeviceId(storedDeviceId)

        if (storedUser && storedUser !== 'undefined') {
          try {
            setUser(JSON.parse(storedUser))
            
            // Fetch settings if logged in
            settingsService.get().then(setAppSettings).catch(console.error)
          } catch (e) {}
        }
      }
    }

    setLoading(false)
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

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password')
      }

      // Store in localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.role)
      localStorage.setItem('user', JSON.stringify({ 
        id: data._id, 
        name: data.name, 
        email: data.email 
      }))
      
      if (data.deviceId) {
        localStorage.setItem('deviceId', data.deviceId)
        localStorage.setItem('expectedDeviceId', data.deviceId)
      }

      // Update state
      setToken(data.token)
      setRole(data.role)
      setUser({ id: data._id, name: data.name, email: data.email })
      setDeviceId(data.deviceId)
      setLoading(false)
      
      return { role: data.role }
    } catch (error) {
      console.error('Login Error:', error)
      throw error
    }
  }

  const sendOTP = async (email) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP')
      }

      return data
    } catch (error) {
      console.error('Send OTP Error:', error)
      throw error
    }
  }

  const verifyOTP = async (email, otp) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          otp,
          deviceId: localStorage.getItem('deviceId') || 'web-client-' + Math.random().toString(36).substring(7) 
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Invalid or expired OTP')
      }

      // Store in localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.role)
      localStorage.setItem('user', JSON.stringify({ 
        id: data._id, 
        name: data.name, 
        email: data.email 
      }))
      
      if (data.deviceId) {
        localStorage.setItem('deviceId', data.deviceId)
        localStorage.setItem('expectedDeviceId', data.deviceId)
      }

      // Update state
      setToken(data.token)
      setRole(data.role)
      setUser({ id: data._id, name: data.name, email: data.email })
      setDeviceId(data.deviceId)
      setLoading(false)
      
      return { role: data.role }
    } catch (error) {
      console.error('Verify OTP Error:', error)
      throw error
    }
  }

  const verifyCredentials = async (email, password) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-credentials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password')
      }

      return data
    } catch (error) {
      console.error('Verify Credentials Error:', error)
      throw error
    }
  }

  const logActivity = (userName, action, deviceName) => {
    const newLog = { id: Date.now(), user: userName, action, device: deviceName, time: new Date().toISOString() }

    setActivityLogs(prev => {
      const updated = [newLog, ...prev]

      localStorage.setItem('activityLogs', JSON.stringify(updated))
      
return updated
    })
  }

  const logAudit = (adminName, action, target) => {
    const newLog = { id: Date.now(), admin: adminName, action, target, time: new Date().toISOString() }

    setAuditLogs(prev => {
      const updated = [newLog, ...prev]

      localStorage.setItem('auditLogs', JSON.stringify(updated))
      
return updated
    })
  }

  const updateSettings = async (newSettings) => {
    try {
      const updated = await settingsService.update(newSettings)

      setAppSettings(updated)
      logAudit(user?.name || 'Admin', 'Updated Settings', JSON.stringify(newSettings))
    } catch (error) {
      console.error('Failed to update settings:', error)
    }
  }

  const handleLogout = (reason = 'Manual Logout') => {
    console.log('Logging out. Reason:', reason)

    if (user && deviceId) {
      logActivity(user.name, 'Logged out', 'Current Device')
    }

    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('user')
    localStorage.removeItem('deviceId')
    
    setToken(null)
    setRole(null)
    setUser(null)
    setDeviceId(null)
    
    router.push('/login')
  }

  const logout = useCallback(() => handleLogout(), [handleLogout])

  const values = useMemo(() => ({
    user,
    role,
    token,
    loading,
    deviceId,
    appSettings,
    activityLogs,
    auditLogs,
    devices,
    studentsList,
    coursesList,
    batchesList,
    facultyList,
    paymentsList,
    testsList,
    notificationsList,
    reportsData,
    setStudentsList,
    setCoursesList,
    setBatchesList,
    setFacultyList,
    setPaymentsList,
    setTestsList,
    setNotificationsList,
    setDevices,
    login,
    sendOTP,
    verifyOTP,
    verifyCredentials,
    logout,
    logActivity,
    logAudit,
    updateSettings
  }), [
    user, role, token, loading, deviceId, appSettings, 
    activityLogs, auditLogs, devices, studentsList, 
    coursesList, batchesList, facultyList, paymentsList, 
    testsList, notificationsList, reportsData, 
    login, sendOTP, verifyOTP, verifyCredentials, logout, updateSettings
  ])

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

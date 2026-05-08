'use client'

import { useState } from 'react'

import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { email, object, minLength, string, pipe, nonEmpty } from 'valibot'
import classnames from 'classnames'

import { useAuth } from '@/contexts/AuthContext'
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'
import themeConfig from '@configs/themeConfig'
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

import { showToast } from '@/utils/toast'


// Styled Custom Components
const IllustrationWrapper = styled('div')(({ theme }) => ({
  zIndex: 2,
  position: 'relative',
  blockSize: '100%',
  inlineSize: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: theme.spacing(6)
}))

const FloatingCard = styled(Card)(({ theme }) => ({
  position: 'absolute',
  width: 200,
  zIndex: 3,
  boxShadow: theme.shadows[10],
  animation: 'float 6s ease-in-out infinite',
  '@keyframes float': {
    '0%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-20px)' },
    '100%': { transform: 'translateY(0px)' }
  }
}))

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 355,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

const WavingEmoji = styled('span')({
  display: 'inline-block',
  animation: 'wave 2.5s infinite',
  transformOrigin: '70% 70%',
  '@keyframes wave': {
    '0%': { transform: 'rotate(0deg)' },
    '10%': { transform: 'rotate(14deg)' },
    '20%': { transform: 'rotate(-8deg)' },
    '30%': { transform: 'rotate(14deg)' },
    '40%': { transform: 'rotate(-4deg)' },
    '50%': { transform: 'rotate(10deg)' },
    '60%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(0deg)' }
  }
})

const schema = object({
  email: pipe(string(), minLength(1, 'This field is required'), email('Email is invalid')),
  password: pipe(
    string(),
    nonEmpty('This field is required'),
    minLength(1, 'Password is required')
  )
})

const Login = ({ mode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [errorState, setErrorState] = useState(null)
  const [roleTab, setRoleTab] = useState(0)
  
  // Student Login Steps: 1 (Credentials), 2 (Email/OTP Send), 3 (OTP Verify)
  const [studentStep, setStudentStep] = useState(1)
  const [emailValue, setEmailValue] = useState('MH-JEGAN-MORNINGBATCH-2026@medifyhub.com')
  const [passwordValue, setPasswordValue] = useState('JEGAN@MH2026')
  const [targetEmail, setTargetEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [resendTimer, setResendTimer] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Vars
  const darkImg = '/images/pages/auth-mask-dark.png'
  const lightImg = '/images/pages/auth-mask-light.png'
  
  // Hooks
  const router = useRouter()
  const searchParams = useSearchParams()
  const { lang: locale } = useParams()
  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors }
  } = useForm({
    resolver: valibotResolver(schema),
    defaultValues: {
      email: 'medifyhub@gmail.com',
      password: 'medify_hub@2026'
    }
  })

  const { login, sendOTP, verifyOTP, verifyCredentials } = useAuth()

  const adminIllustration = '/images/illustrations/characters-with-objects/2.png'
  const studentIllustration = '/images/illustrations/characters/7.png'

  const characterIllustration = roleTab === 0 ? adminIllustration : studentIllustration

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleStudentStep1 = async () => {
    if (!emailValue || !passwordValue) {
      showToast('Please enter both email and password', 'error')
      
return
    }

    try {
      setIsLoading(true)
      await verifyCredentials(emailValue, passwordValue)
      
      // Automatically trigger OTP sending after credentials verification
      await handleSendOTP()
    } catch (err) {
      showToast(err.message || 'Invalid credentials', 'error')
      setIsLoading(false)
    }
  }

  const handleSendOTP = async () => {
    try {
      setIsLoading(true)
      const res = await sendOTP(emailValue)

      setTargetEmail(res.email)
      setStudentStep(3)
      setResendTimer(30)

      const timer = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      if (res.devOTP) {
        setOtp(res.devOTP)
        showToast(`DEV MODE: OTP ${res.devOTP} pre-filled!`)
      } else {
        showToast('OTP sent to your email! 📧')
      }
    } catch (err) {
      showToast(err.message || 'Failed to send OTP', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      showToast('Please enter 6 digit OTP', 'error')
      
return
    }

    try {
      setIsLoading(true)
      const res = await verifyOTP(emailValue, otp)

      showToast('Login successful! Welcome back.')
      handleRedirect(res)
    } catch (err) {
      showToast(err.message || 'OTP Verification failed', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRedirect = (res) => {
    const { role } = res
    const redirectURL = searchParams.get('redirectTo')
    
    // If we have a redirect URL, use it UNLESS it's pointing to the old template CRM dashboard for an admin
    if (redirectURL && !(role === 'admin' && redirectURL.includes('dashboards/crm'))) {
      const path = redirectURL

      router.replace(path)
    } else {
      if (role === 'admin') {
        router.replace('/admin/dashboard')
      } else if (role === 'student' || role === 'user') {
        router.replace('/dashboard/courses')
      } else {
        router.replace('/')
      }
    }
  }

  const onSubmit = async data => {
    if (roleTab === 1) {
      // Student flow handled by separate functions
      return
    }

    // Admin Login
    try {
      setIsLoading(true)
      const res = await login(data.email, data.password)

      handleRedirect(res)
    } catch (err) {
      setErrorState({ message: [err.message] })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex bs-full justify-center overflow-hidden'>
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden bg-[#F8F7FA]',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <IllustrationWrapper>
          <img src={characterIllustration} alt='character-illustration' className='max-bs-[500px]' />
          
          {roleTab === 0 ? (
            <>
              <FloatingCard style={{ top: '20%', left: '5%' }}>
                <CardContent className='flex flex-col items-center gap-2'>
                  <div className='p-2 bg-primary/10 rounded-lg text-primary'>
                    <i className='tabler-users text-2xl' />
                  </div>
                  <Typography variant='h5' className='font-bold'>1,200+</Typography>
                  <Typography variant='body2' color='text.secondary'>Active Students</Typography>
                </CardContent>
              </FloatingCard>

              <FloatingCard style={{ bottom: '25%', right: '5%' }}>
                <CardContent className='flex flex-col items-center gap-2'>
                  <div className='p-2 bg-success/10 rounded-lg text-success'>
                    <i className='tabler-certificate text-2xl' />
                  </div>
                  <Typography variant='h5' className='font-bold'>98%</Typography>
                  <Typography variant='body2' color='text.secondary'>Course Success</Typography>
                </CardContent>
              </FloatingCard>
            </>
          ) : (
            <>
              <FloatingCard style={{ top: '20%', left: '10%' }}>
                <CardContent className='flex flex-col items-center gap-2'>
                  <div className='p-2 bg-info/10 rounded-lg text-info'>
                    <i className='tabler-book text-2xl' />
                  </div>
                  <Typography variant='h5' className='font-bold'>50+</Typography>
                  <Typography variant='body2' color='text.secondary'>Premium Courses</Typography>
                </CardContent>
              </FloatingCard>

              <FloatingCard style={{ bottom: '25%', right: '10%' }}>
                <CardContent className='flex flex-col items-center gap-2'>
                  <div className='p-2 bg-warning/10 rounded-lg text-warning'>
                    <i className='tabler-device-laptop text-2xl' />
                  </div>
                  <Typography variant='h5' className='font-bold'>100%</Typography>
                  <Typography variant='body2' color='text.secondary'>Placement Support</Typography>
                </CardContent>
              </FloatingCard>
            </>
          )}
        </IllustrationWrapper>
        {!hidden && <MaskImg alt='mask' src={authBackground} />}
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <div className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </div>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-8 sm:mbs-11 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>
              {`Welcome to ${themeConfig.templateName}! `}
              <WavingEmoji>👋🏻</WavingEmoji>
            </Typography>
            <Typography>Please sign-in to your account and start the adventure</Typography>
          </div>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={roleTab} 
              onChange={(e, newVal) => {
                setRoleTab(newVal)
                setStudentStep(1)
                setEmailValue('')
                setPasswordValue('')
                setOtp('')

                if (newVal === 0) {
                  setValue('email', 'medifyhub@gmail.com')
                  setValue('password', 'medify_hub@2026')
                } else {
                  setEmailValue('MH-JEGAN-MORNINGBATCH-2026@medifyhub.com')
                  setPasswordValue('JEGAN@MH2026')
                }
              }} 
              variant="fullWidth"
            >
              <Tab label="Admin Login" />
              <Tab label="Student Login" />
            </Tabs>
          </Box>

          {roleTab === 0 ? (
            <form
              noValidate
              autoComplete='off'
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-col gap-6'
            >
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    autoFocus
                    fullWidth
                    type='email'
                    label='Email'
                    placeholder='Enter your email'
                    error={!!errors.email || !!errorState}
                    helperText={errors?.email?.message || errorState?.message[0]}
                  />
                )}
              />
              <Controller
                name='password'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Password'
                    placeholder='············'
                    type={isPasswordShown ? 'text' : 'password'}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton edge='end' onClick={handleClickShowPassword}>
                              <i className={isPasswordShown ? 'tabler-eye' : 'tabler-eye-off'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }
                    }}
                  />
                )}
              />
              <Button fullWidth variant='contained' type='submit' disabled={isLoading}>
                {isLoading ? 'Please wait...' : 'Login'}
              </Button>
            </form>
          ) : (
            <div className='flex flex-col gap-6'>
              {studentStep === 1 ? (
                <>
                  <CustomTextField
                    fullWidth
                    label='Email'
                    placeholder='student@example.com'
                    value={emailValue}
                    onChange={e => setEmailValue(e.target.value)}
                    autoFocus
                  />
                  <CustomTextField
                    fullWidth
                    label='Password'
                    placeholder='············'
                    type={isPasswordShown ? 'text' : 'password'}
                    value={passwordValue}
                    onChange={e => setPasswordValue(e.target.value)}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton edge='end' onClick={handleClickShowPassword}>
                              <i className={isPasswordShown ? 'tabler-eye' : 'tabler-eye-off'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }
                    }}
                  />
                  <Button 
                    fullWidth 
                    variant='contained' 
                    onClick={handleStudentStep1}
                    disabled={isLoading || !emailValue || !passwordValue}
                  >
                    {isLoading ? 'Verifying...' : 'Verify & Send OTP'}
                  </Button>
                </>
              ) : studentStep === 2 ? (

                // Step 2 is now bypassed by auto-send, but kept for transition logic
                <div className='flex justify-center p-4'>
                  <Typography>Sending OTP...</Typography>
                </div>
              ) : (
                <>
                  <div className='flex flex-col gap-2'>
                    <Typography variant='h6' className='text-center'>Step 3: Enter OTP</Typography>
                    <Typography variant='body2' className='text-center'>
                      We sent a 6-digit code to your personal email: <strong>{targetEmail}</strong>
                    </Typography>
                  </div>
                  
                  <CustomTextField
                    fullWidth
                    label='6-Digit OTP'
                    placeholder='······'
                    value={otp}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 6)

                      setOtp(val)
                    }}
                    autoFocus
                    slotProps={{
                      input: {
                        style: { letterSpacing: '0.5rem', textAlign: 'center', fontSize: '1.25rem' }
                      }
                    }}
                  />
                  
                  <Button 
                    fullWidth 
                    variant='contained' 
                    onClick={handleVerifyOTP}
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? 'Verifying...' : 'Verify & Login'}
                  </Button>

                  <div className='flex items-center justify-center gap-2'>
                    <Typography variant='body2'>Didn{"'"}t get the code?</Typography>

                    <Button 
                      variant='text' 
                      size='small' 
                      onClick={handleSendOTP} 
                      disabled={resendTimer > 0 || isLoading}
                    >
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend'}
                    </Button>
                  </div>

                  <Button variant='text' size='small' onClick={() => setStudentStep(2)} disabled={isLoading}>
                    Go Back
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login

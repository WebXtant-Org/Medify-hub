// MUI Imports

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

export const metadata = {
  title: 'Medify Hub - Coaching Institute Management System',
  description: 'Medify Hub - Comprehensive Coaching Institute Management System and Learning Platform.',
  icons: {
    icon: '/images/logos/institute-logo.jpeg',
    apple: '/images/logos/institute-logo.jpeg'
  }
}

const RootLayout = async props => {
  const { children } = props

  // Vars
  const systemMode = await getSystemMode()

  return (
    <html id='__next' lang='en' dir='ltr' suppressHydrationWarning>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
        {children}
      </body>
    </html>
  )
}

export default RootLayout

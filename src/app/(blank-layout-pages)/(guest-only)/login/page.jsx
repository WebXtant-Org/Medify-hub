// Component Imports
import Login from '@views/Login'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata = {
  title: 'Login - Medify Hub',
  description: 'Login to your Medify Hub account'
}

const LoginPage = async () => {
  // Vars
  const mode = await getServerMode()

  return <Login mode={mode} />
}

export default LoginPage

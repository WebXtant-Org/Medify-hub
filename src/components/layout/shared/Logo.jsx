'use client'

// React Imports
import { useColorScheme } from '@mui/material/styles'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'

const Logo = () => {
  // Hooks
  const { isHovered, isBreakpointReached } = useVerticalNav()
  const { settings } = useSettings()
  const { mode, systemMode } = useColorScheme()

  // Vars
  const { layout } = settings
  const currentMode = mode === 'system' ? systemMode : mode

  return (
    <div className='flex items-center justify-center is-full'>
      <img
        src='/images/logos/medify-hub-logo.png'
        alt='Logo'
        className={`${
          !isBreakpointReached && layout === 'collapsed' && !isHovered ? 'max-is-[40px]' : 'max-is-[180px]'
        } max-bs-[45px] bs-auto object-contain transition-all duration-300`}
      />
    </div>
  )
}

export default Logo

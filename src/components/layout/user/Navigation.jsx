'use client'

import { useEffect, useRef } from 'react'

import Link from 'next/link'
import { useParams } from 'next/navigation'

import { styled, useColorScheme, useTheme } from '@mui/material/styles'

import VerticalNav, { NavHeader, NavCollapseIcons } from '@menu/vertical-menu'
import UserMenu from './UserMenu'
import Logo from '@components/layout/shared/Logo'

import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'

import navigationCustomStyles from '@core/styles/vertical/navigationCustomStyles'

const StyledBoxForShadow = styled('div')(({ theme }) => ({
  top: 60,
  left: -8,
  zIndex: 2,
  opacity: 0,
  position: 'absolute',
  pointerEvents: 'none',
  width: 'calc(100% + 15px)',
  height: theme.mixins.toolbar.minHeight,
  transition: 'opacity .15s ease-in-out',
  background: `linear-gradient(var(--mui-palette-background-paper) ${theme.direction === 'rtl' ? '95%' : '5%'}, rgb(var(--mui-palette-background-paperChannel) / 0.85) 30%, rgb(var(--mui-palette-background-paperChannel) / 0.5) 65%, rgb(var(--mui-palette-background-paperChannel) / 0.3) 75%, transparent)`,
  '&.scrolled': {
    opacity: 1
  }
}))

const Navigation = props => {
  const { dictionary, mode } = props
  const verticalNavOptions = useVerticalNav()
  const { updateSettings, settings } = useSettings()
  const { lang: locale } = useParams()
  const { mode: muiMode, systemMode: muiSystemMode } = useColorScheme()
  const theme = useTheme()
  const shadowRef = useRef(null)

  const { isCollapsed, isHovered, collapseVerticalNav, isBreakpointReached } = verticalNavOptions
  const isSemiDark = settings.semiDark
  const currentMode = muiMode === 'system' ? muiSystemMode : muiMode || mode
  const isDark = currentMode === 'dark'

  const scrollMenu = (container, isPerfectScrollbar) => {
    container = isBreakpointReached || !isPerfectScrollbar ? container.target : container

    if (shadowRef && container.scrollTop > 0) {
      if (!shadowRef.current.classList.contains('scrolled')) {
        shadowRef.current.classList.add('scrolled')
      }
    } else {
      shadowRef.current.classList.remove('scrolled')
    }
  }

  useEffect(() => {
    if (settings.layout === 'collapsed') {
      collapseVerticalNav(true)
    } else {
      collapseVerticalNav(false)
    }
  }, [settings.layout])

  return (
    <VerticalNav
      customStyles={navigationCustomStyles(verticalNavOptions, theme)}
      collapsedWidth={71}
      backgroundColor='var(--mui-palette-background-paper)'
      {...(isSemiDark &&
        !isDark && {
          'data-dark': ''
        })}
    >
      <NavHeader>
        <Link href={'/'}>
          <Logo />
        </Link>
        {!(isCollapsed && !isHovered) && (
          <NavCollapseIcons
            lockedIcon={<i className='tabler-circle-dot text-xl' />}
            unlockedIcon={<i className='tabler-circle text-xl' />}
            closeIcon={<i className='tabler-x text-xl' />}
            onClick={() => updateSettings({ layout: !isCollapsed ? 'collapsed' : 'vertical' })}
          />
        )}
      </NavHeader>
      <StyledBoxForShadow ref={shadowRef} />
      <UserMenu dictionary={dictionary} scrollMenu={scrollMenu} />
    </VerticalNav>
  )
}

export default Navigation

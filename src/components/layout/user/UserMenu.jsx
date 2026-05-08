'use client'

import { useTheme } from '@mui/material/styles'
import PerfectScrollbar from 'react-perfect-scrollbar'

import { Menu, MenuItem, MenuSection } from '@menu/vertical-menu'
import useVerticalNav from '@menu/hooks/useVerticalNav'
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

const UserMenu = ({ dictionary, scrollMenu }) => {
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const { isBreakpointReached } = verticalNavOptions
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <MenuSection label="Learning">
          <MenuItem href="/dashboard/courses" icon={<i className='tabler-books' />}>
            My Courses
          </MenuItem>
          <MenuItem href="/dashboard/viewer" icon={<i className='tabler-file-text' />}>
            Viewer
          </MenuItem>
          <MenuItem href="/dashboard/payments" icon={<i className='tabler-currency-dollar' />}>
            Payments
          </MenuItem>
          <MenuItem href="/dashboard/tests" icon={<i className='tabler-clipboard-check' />}>
            Tests
          </MenuItem>
          <MenuItem href="/dashboard/schedule" icon={<i className='tabler-calendar' />}>
            Schedule
          </MenuItem>
          <MenuItem href="/dashboard/profile" icon={<i className='tabler-user' />}>
            Profile
          </MenuItem>
          <MenuItem href="/dashboard/notifications" icon={<i className='tabler-bell' />}>
            Notifications
          </MenuItem>
        </MenuSection>
      </Menu>
    </ScrollWrapper>
  )
}

export default UserMenu

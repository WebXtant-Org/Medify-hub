'use client'

import { useTheme } from '@mui/material/styles'
import PerfectScrollbar from 'react-perfect-scrollbar'

import { Menu, MenuItem, MenuSection } from '@menu/vertical-menu'
import useVerticalNav from '@menu/hooks/useVerticalNav'
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

const AdminMenu = ({ dictionary, scrollMenu }) => {
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
        <MenuSection label="Admin">
          <MenuItem href="/admin/dashboard" icon={<i className='tabler-smart-home' />}>
            Dashboard
          </MenuItem>
          <MenuItem href="/admin/students" icon={<i className='tabler-users' />}>
            Students
          </MenuItem>
          <MenuItem href="/admin/payments" icon={<i className='tabler-currency-dollar' />}>
            Payments
          </MenuItem>
          <MenuItem href="/admin/courses" icon={<i className='tabler-book' />}>
            Courses
          </MenuItem>
          <MenuItem href="/admin/batches" icon={<i className='tabler-stack-2' />}>
            Batches
          </MenuItem>
          <MenuItem href="/admin/faculty" icon={<i className='tabler-user-star' />}>
            Faculty
          </MenuItem>
          <MenuItem href="/admin/tests" icon={<i className='tabler-clipboard-check' />}>
            Tests
          </MenuItem>
          <MenuItem href="/admin/reports" icon={<i className='tabler-chart-bar' />}>
            Reports
          </MenuItem>
          <MenuItem href="/admin/schedule" icon={<i className='tabler-calendar' />}>
            Schedule
          </MenuItem>
          <MenuItem href="/admin/notifications" icon={<i className='tabler-bell' />}>
            Notifications
          </MenuItem>
          <MenuItem href="/admin/settings" icon={<i className='tabler-settings' />}>
            Settings
          </MenuItem>
        </MenuSection>
      </Menu>
    </ScrollWrapper>
  )
}

export default AdminMenu

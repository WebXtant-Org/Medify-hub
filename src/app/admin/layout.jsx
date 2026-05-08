// MUI Imports
import Button from '@mui/material/Button'

// Layout Imports
import LayoutWrapper from '@layouts/LayoutWrapper'
import VerticalLayout from '@layouts/VerticalLayout'
import HorizontalLayout from '@layouts/HorizontalLayout'

// Component Imports
import Providers from '@components/Providers'
import Navigation from '@components/layout/admin/Navigation'
import Header from '@components/layout/horizontal/Header'
import Navbar from '@components/layout/vertical/Navbar'
import VerticalFooter from '@components/layout/vertical/Footer'
import HorizontalFooter from '@components/layout/horizontal/Footer'
import Customizer from '@core/components/customizer'
import ScrollToTop from '@core/components/scroll-to-top'

// HOC Imports
import RoleGuard from '@/hocs/RoleGuard'

// Util Imports
import { getDictionary } from '@/utils/getDictionary'
import { getMode, getSystemMode } from '@core/utils/serverHelpers'

const Layout = async props => {
  const { children } = props

  // Vars
  const direction = 'ltr'
  const dictionary = await getDictionary('en')
  const mode = await getMode()
  const systemMode = await getSystemMode()

  return (
    <Providers direction={direction}>
      <RoleGuard allowedRoles={['admin']}>
        <LayoutWrapper
          systemMode={systemMode}
          verticalLayout={
            <VerticalLayout
              navigation={<Navigation dictionary={dictionary} mode={mode} />}
              navbar={<Navbar />}
              footer={<VerticalFooter />}
            >
              {children}
            </VerticalLayout>
          }
          horizontalLayout={
            <HorizontalLayout header={<Header dictionary={dictionary} />} footer={<HorizontalFooter />}>
              {children}
            </HorizontalLayout>
          }
        />
        <ScrollToTop className='mui-fixed'>
          <Button
            variant='contained'
            className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'
          >
            <i className='tabler-arrow-up' />
          </Button>
        </ScrollToTop>
        <Customizer dir={direction} />
      </RoleGuard>
    </Providers>
  )
}

export default Layout

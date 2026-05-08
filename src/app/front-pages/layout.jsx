// MUI Imports
import Button from '@mui/material/Button'

// Context Imports
import { IntersectionProvider } from '@/contexts/intersectionContext'

// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'
import FrontLayout from '@components/layout/front-pages'
import ScrollToTop from '@core/components/scroll-to-top'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

const Layout = async ({ children }) => {
  // Vars
  const systemMode = await getSystemMode()

  return (
    <Providers direction='ltr'>
      <BlankLayout systemMode={systemMode}>
        <IntersectionProvider>
          <FrontLayout>
            {children}
            <ScrollToTop className='mui-fixed'>
              <Button
                variant='contained'
                className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'
              >
                <i className='tabler-arrow-up' />
              </Button>
            </ScrollToTop>
          </FrontLayout>
        </IntersectionProvider>
      </BlankLayout>
    </Providers>
  )
}

export default Layout

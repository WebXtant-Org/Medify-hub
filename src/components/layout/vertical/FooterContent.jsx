'use client'

// Next Imports
import Link from 'next/link'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

const FooterContent = () => {
  // Hooks
  const { isBreakpointReached } = useVerticalNav()

  return (
    <div
      className={classnames(verticalLayoutClasses.footerContent, 'flex items-center justify-between flex-wrap gap-4')}
    >
      <p>
        <span className='text-textSecondary'>{`© ${new Date().getFullYear()}, Made with `}</span>
        <span>{`❤️`}</span>
        <span className='text-textSecondary'>{` by `}</span>
        <Link href='https://www.medifyhubhealthcaresolution.com' target='_blank' className='text-primary uppercase'>
          Medify Hub
        </Link>
      </p>
      {!isBreakpointReached && (
        <div className='flex items-center gap-1'>
          <span className='text-textSecondary text-sm'>
            Design and Developed by
          </span>
          <span className='text-primary font-bold uppercase text-sm'>
            WEBXTANT
          </span>
        </div>
      )}
    </div>
  )
}

export default FooterContent

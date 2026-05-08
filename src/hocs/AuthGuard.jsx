'use client'

import RoleGuard from '@/hocs/RoleGuard'

export default function AuthGuard({ children }) {
  // If we just want a generic AuthGuard (any logged in user), we can use RoleGuard without allowedRoles
  return <RoleGuard>{children}</RoleGuard>
}

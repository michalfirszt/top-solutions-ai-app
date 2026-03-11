import { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { clearStoredEmail, getStoredEmail } from '../lib/auth'
import { useCurrentUser } from '../hooks/useTopSolutionsData'

export function ProtectedRoute() {
  const email = getStoredEmail()
  const { data: currentUser, isLoading } = useCurrentUser(email)

  useEffect(() => {
    if (!isLoading && !currentUser) {
      clearStoredEmail()
    }
  }, [currentUser, isLoading])

  if (!email) {
    return <Navigate to="/login" replace />
  }

  if (isLoading) {
    return <p className="p-6 text-center text-slate-600">Loading user...</p>
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

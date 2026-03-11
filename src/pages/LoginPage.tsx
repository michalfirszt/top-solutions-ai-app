import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useEnsureUserByEmail } from '../hooks/useTopSolutionsData'
import { getStoredEmail, normalizeEmail, setStoredEmail } from '../lib/auth'
import { ThemeToggleButton } from '../components/ThemeToggleButton'

export function LoginPage() {
  const navigate = useNavigate()
  const ensureUser = useEnsureUserByEmail()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)

  const storedEmail = getStoredEmail()
  if (storedEmail) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const normalized = normalizeEmail(email)

    if (!normalized) {
      setError('Email is required.')
      return
    }

    try {
      await ensureUser.mutateAsync(normalized)
      setStoredEmail(normalized)
      navigate('/', { replace: true })
    } catch {
      setError('Unable to log in. Please try again.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 dark:bg-slate-900">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Top Solutions</h1>
          <ThemeToggleButton />
        </div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Sign in with your email to access solutions.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-slate-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              placeholder="name@example.com"
              required
            />
          </div>
          <button
            type="submit"
            disabled={ensureUser.isPending}
            className="w-full rounded-md bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            {ensureUser.isPending ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

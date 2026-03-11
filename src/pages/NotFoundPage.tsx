import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-6 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-2 text-slate-600">The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="mt-4 inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
      >
        Go to solutions
      </Link>
    </div>
  )
}

import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-6 text-center dark:border-slate-700 dark:bg-slate-800">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Page not found</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="mt-4 inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
      >
        Go to solutions
      </Link>
    </div>
  )
}

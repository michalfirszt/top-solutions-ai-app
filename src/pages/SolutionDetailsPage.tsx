import ReactMarkdown from 'react-markdown'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useCategories, useCurrentUser, useSolution } from '../hooks/useTopSolutionsData'
import { formatDateTime } from '../lib/date'
import { getStoredEmail } from '../lib/auth'

const estimateLabels = {
  frontend: 'Front-end',
  backend: 'Back-end',
  mobile: 'Mobile',
  devops: 'DevOps',
  design: 'Design',
} as const

export function SolutionDetailsPage() {
  const { id } = useParams()
  const email = getStoredEmail()
  const { data: currentUser } = useCurrentUser(email)
  const { data: solution, isLoading, error } = useSolution(id)
  const { data: categories } = useCategories()

  if (!id) {
    return <Navigate to="/" replace />
  }

  if (isLoading) {
    return <p className="text-slate-600">Loading solution...</p>
  }

  if (error || !solution) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Solution not found.
      </div>
    )
  }

  const categoriesById = new Map((categories ?? []).map((category) => [category.id, category]))

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{solution.title}</h1>
          <p className="mt-1 text-sm text-slate-600">Author: {solution.authorEmail}</p>
        </div>
        {currentUser?.id === solution.authorId ? (
          <Link
            to={`/solutions/${solution.id}/edit`}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Edit Solution
          </Link>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {solution.categoryIds.map((categoryId) => (
          <span key={categoryId} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
            {categoriesById.get(categoryId)?.name ?? 'Unknown'}
          </span>
        ))}
        {solution.categoryIds.length === 0 ? <p className="text-sm text-slate-500">No categories</p> : null}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-slate-900">Description</h2>
        <div className="markdown-body mt-3">
          {solution.descriptionMarkdown.trim() ? (
            <ReactMarkdown>{solution.descriptionMarkdown}</ReactMarkdown>
          ) : (
            <p className="text-slate-500">No description provided.</p>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-slate-900">Estimation</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {Object.entries(solution.estimates).map(([key, value]) => (
            <div key={key} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {estimateLabels[key as keyof typeof estimateLabels]}
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{value}h</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
        <p>Created: {formatDateTime(solution.createdAt)}</p>
        <p>Updated: {formatDateTime(solution.updatedAt)}</p>
      </div>
    </section>
  )
}

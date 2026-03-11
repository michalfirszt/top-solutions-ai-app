import { Link } from 'react-router-dom'
import { useCategories, useCurrentUser, useSolutions } from '../hooks/useTopSolutionsData'
import { formatDateTime } from '../lib/date'
import { getStoredEmail } from '../lib/auth'

export function SolutionsListPage() {
  const email = getStoredEmail()
  const { data: currentUser } = useCurrentUser(email)
  const { data: solutions, isLoading: isLoadingSolutions, error: solutionsError } = useSolutions()
  const { data: categories, isLoading: isLoadingCategories, error: categoriesError } = useCategories()

  if (isLoadingSolutions || isLoadingCategories) {
    return <p className="text-slate-600">Loading solutions...</p>
  }

  if (solutionsError || categoriesError || !solutions || !categories) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Could not load data. Please refresh the page.
      </div>
    )
  }

  const categoriesById = new Map(categories.map((category) => [category.id, category]))

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">All Solutions</h1>
        <Link
          to="/solutions/new"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          New Solution
        </Link>
      </div>

      {solutions.length === 0 ? (
        <div className="rounded-md border border-slate-200 bg-white p-6 text-slate-600">
          No solutions yet. Create the first one.
        </div>
      ) : (
        <div className="grid gap-4">
          {solutions.map((solution) => (
            <article key={solution.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link
                    to={`/solutions/${solution.id}`}
                    className="text-lg font-semibold text-slate-900 hover:text-slate-700"
                  >
                    {solution.title}
                  </Link>
                  <p className="mt-1 text-sm text-slate-600">Author: {solution.authorEmail}</p>
                </div>
                {currentUser?.id === solution.authorId ? (
                  <Link
                    to={`/solutions/${solution.id}/edit`}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    Edit
                  </Link>
                ) : null}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {solution.categoryIds.map((categoryId) => {
                  const category = categoriesById.get(categoryId)
                  return (
                    <span
                      key={categoryId}
                      className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                    >
                      {category?.name ?? 'Unknown'}
                    </span>
                  )
                })}
                {solution.categoryIds.length === 0 ? (
                  <span className="text-sm text-slate-500">No categories</span>
                ) : null}
              </div>

              <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                <p>Created: {formatDateTime(solution.createdAt)}</p>
                <p>Updated: {formatDateTime(solution.updatedAt)}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

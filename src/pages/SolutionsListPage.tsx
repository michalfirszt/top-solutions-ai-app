import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCategories, useCurrentUser, useSolutions } from '../hooks/useTopSolutionsData'
import { formatDateTime } from '../lib/date'
import { getStoredEmail } from '../lib/auth'
import type { Category, Solution } from '../types'

type ViewMode = 'list' | 'grouped'

export function SolutionsListPage() {
  const email = getStoredEmail()
  const { data: currentUser } = useCurrentUser(email)
  const { data: solutions, isLoading: isLoadingSolutions, error: solutionsError } = useSolutions()
  const { data: categories, isLoading: isLoadingCategories, error: categoriesError } = useCategories()
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('grouped')
  const [openCategoryIds, setOpenCategoryIds] = useState<string[]>([])
  const loadedSolutions = solutions ?? []
  const loadedCategories = categories ?? []
  const categoriesById = new Map(loadedCategories.map((category) => [category.id, category]))
  const selectedCategorySet = new Set(selectedCategoryIds)
  const activeCategories = loadedCategories.filter((category) => selectedCategorySet.has(category.id))
  const filteredSolutions =
    selectedCategoryIds.length === 0
      ? loadedSolutions
      : loadedSolutions.filter((solution) =>
          solution.categoryIds.some((categoryId) => selectedCategorySet.has(categoryId)),
        )
  const groupedCategories = selectedCategoryIds.length === 0 ? loadedCategories : activeCategories
  const groupedSections = groupedCategories
    .map((category) => ({
      category,
      solutions: filteredSolutions.filter((solution) => solution.categoryIds.includes(category.id)),
    }))
    .filter((section) => section.solutions.length > 0)
  const groupedSectionIds = groupedSections.map((section) => section.category.id).join('|')
  const firstVisibleId = groupedSections[0]?.category.id
  const visibleOpenCategoryIds = openCategoryIds.filter((id) =>
    groupedSectionIds ? groupedSectionIds.split('|').includes(id) : false,
  )
  const effectiveOpenCategoryIds =
    visibleOpenCategoryIds.length > 0 ? visibleOpenCategoryIds : firstVisibleId ? [firstVisibleId] : []

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

  function toggleCategory(categoryId: string) {
    setSelectedCategoryIds((current) => {
      if (current.includes(categoryId)) {
        return current.filter((id) => id !== categoryId)
      }

      return [...current, categoryId]
    })
  }

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

      <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-800">Category Filters</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                viewMode === 'list' ? 'bg-slate-900 text-white' : 'border border-slate-300 text-slate-700'
              }`}
            >
              List View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grouped')}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                viewMode === 'grouped'
                  ? 'bg-slate-900 text-white'
                  : 'border border-slate-300 text-slate-700'
              }`}
            >
              Grouped View
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const isSelected = selectedCategorySet.has(category.id)

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => toggleCategory(category.id)}
                className={`rounded-full border px-3 py-1 text-sm ${
                  isSelected
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-300 bg-white text-slate-700'
                }`}
              >
                {category.name}
              </button>
            )
          })}
          <button
            type="button"
            onClick={() => setSelectedCategoryIds([])}
            className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm text-slate-700"
          >
            Clear
          </button>
        </div>
      </div>

      {solutions.length === 0 ? (
        <div className="rounded-md border border-slate-200 bg-white p-6 text-slate-600">
          No solutions yet. Create the first one.
        </div>
      ) : filteredSolutions.length === 0 ? (
        <div className="rounded-md border border-slate-200 bg-white p-6 text-slate-600">
          No solutions match selected filters.
        </div>
      ) : viewMode === 'list' ? (
        <div className="grid gap-4">
          {filteredSolutions.map((solution) => (
            <SolutionCard
              key={solution.id}
              solution={solution}
              currentUserId={currentUser?.id}
              categoriesById={categoriesById}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {groupedSections.map((section) => {
            const isOpen = effectiveOpenCategoryIds.includes(section.category.id)

            return (
              <section key={section.category.id} className="rounded-lg border border-slate-200 bg-white">
                <button
                  type="button"
                  onClick={() =>
                    setOpenCategoryIds((current) => {
                      const visibleIds = new Set(groupedSectionIds ? groupedSectionIds.split('|') : [])
                      const normalized = current.filter((id) => visibleIds.has(id))
                      const effective =
                        normalized.length > 0 ? normalized : firstVisibleId ? [firstVisibleId] : []

                      if (effective.includes(section.category.id)) {
                        return normalized.filter((id) => id !== section.category.id)
                      }

                      return [...normalized, section.category.id]
                    })
                  }
                  className="flex w-full items-center justify-between px-4 py-3 text-left"
                >
                  <span className="text-lg font-semibold text-slate-900">{section.category.name}</span>
                  <span className="text-sm text-slate-600">
                    {section.solutions.length} solution{section.solutions.length === 1 ? '' : 's'}
                  </span>
                </button>
                <div className={isOpen ? 'block border-t border-slate-200 p-4' : 'hidden'}>
                  <div className="grid gap-4">
                    {section.solutions.map((solution) => (
                      <SolutionCard
                        key={`${section.category.id}-${solution.id}`}
                        solution={solution}
                        currentUserId={currentUser?.id}
                        categoriesById={categoriesById}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )
          })}
        </div>
      )}
    </section>
  )
}

function SolutionCard({
  solution,
  currentUserId,
  categoriesById,
}: {
  solution: Solution
  currentUserId: string | undefined
  categoriesById: Map<string, Category>
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link to={`/solutions/${solution.id}`} className="text-lg font-semibold text-slate-900 hover:text-slate-700">
            {solution.title}
          </Link>
          <p className="mt-1 text-sm text-slate-600">Author: {solution.authorEmail}</p>
        </div>
        {currentUserId === solution.authorId ? (
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
            <span key={categoryId} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              {category?.name ?? 'Unknown'}
            </span>
          )
        })}
        {solution.categoryIds.length === 0 ? <span className="text-sm text-slate-500">No categories</span> : null}
      </div>

      <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
        <p>Created: {formatDateTime(solution.createdAt)}</p>
        <p>Updated: {formatDateTime(solution.updatedAt)}</p>
      </div>
    </article>
  )
}

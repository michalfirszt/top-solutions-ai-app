import { useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import type { Category, SolutionEstimates } from '../types'

type SolutionFormValues = {
  title: string
  descriptionMarkdown: string
  categoryIds: string[]
  estimates: SolutionEstimates
}

type SolutionFormProps = {
  categories: Category[]
  initialValues?: SolutionFormValues
  submitLabel: string
  isSubmitting: boolean
  onCreateCategory: (name: string) => Promise<Category>
  onSubmit: (values: SolutionFormValues) => Promise<void>
}

const defaultEstimates: SolutionEstimates = {
  frontend: 0,
  backend: 0,
  mobile: 0,
  devops: 0,
  design: 0,
}

const estimateFields: Array<{ key: keyof SolutionEstimates; label: string }> = [
  { key: 'frontend', label: 'Front-end' },
  { key: 'backend', label: 'Back-end' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'devops', label: 'DevOps' },
  { key: 'design', label: 'Design' },
]

export function SolutionForm({
  categories,
  initialValues,
  submitLabel,
  isSubmitting,
  onCreateCategory,
  onSubmit,
}: SolutionFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [descriptionMarkdown, setDescriptionMarkdown] = useState(initialValues?.descriptionMarkdown ?? '')
  const [categoryIds, setCategoryIds] = useState<string[]>(initialValues?.categoryIds ?? [])
  const [estimates, setEstimates] = useState<SolutionEstimates>(
    initialValues?.estimates ?? defaultEstimates,
  )
  const [newCategoryName, setNewCategoryName] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)

  const sortedCategories = useMemo(
    () => [...categories].sort((left, right) => left.name.localeCompare(right.name)),
    [categories],
  )

  function toggleCategory(categoryId: string) {
    setCategoryIds((currentIds) => {
      if (currentIds.includes(categoryId)) {
        return currentIds.filter((id) => id !== categoryId)
      }

      return [...currentIds, categoryId]
    })
  }

  function updateEstimate(key: keyof SolutionEstimates, value: string) {
    const parsed = Number.parseInt(value, 10)
    setEstimates((current) => ({
      ...current,
      [key]: Number.isNaN(parsed) || parsed < 0 ? 0 : parsed,
    }))
  }

  async function handleCreateCategory() {
    if (!newCategoryName.trim()) {
      return
    }

    setFormError(null)
    setIsCreatingCategory(true)

    try {
      const category = await onCreateCategory(newCategoryName)
      setCategoryIds((currentIds) => {
        if (currentIds.includes(category.id)) {
          return currentIds
        }

        return [...currentIds, category.id]
      })
      setNewCategoryName('')
    } catch {
      setFormError('Could not create category. Please try again.')
    } finally {
      setIsCreatingCategory(false)
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    if (!title.trim()) {
      setFormError('Title is required.')
      return
    }

    try {
      await onSubmit({
        title: title.trim(),
        descriptionMarkdown,
        categoryIds,
        estimates,
      })
    } catch {
      setFormError('Could not save solution. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formError ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          {formError}
        </div>
      ) : null}

      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-slate-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          placeholder="e.g. Stripe Integration Layer"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Description (Markdown)
        </label>
        <textarea
          id="description"
          value={descriptionMarkdown}
          onChange={(event) => setDescriptionMarkdown(event.target.value)}
          rows={8}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-slate-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          placeholder="Write Markdown description..."
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Categories</p>
          <div className="rounded-md border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
            {sortedCategories.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No categories available.</p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {sortedCategories.map((category) => (
                  <label key={category.id} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={categoryIds.includes(category.id)}
                      onChange={() => toggleCategory(category.id)}
                      className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                    />
                    {category.name}
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={newCategoryName}
              onChange={(event) => setNewCategoryName(event.target.value)}
              placeholder="Create a custom category"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
            <button
              type="button"
              onClick={handleCreateCategory}
              disabled={isCreatingCategory || !newCategoryName.trim()}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              {isCreatingCategory ? 'Adding...' : 'Add Category'}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Estimation (hours)</p>
          <div className="rounded-md border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
            <div className="grid gap-3">
              {estimateFields.map(({ key, label }) => (
                <label key={key} className="grid gap-1 text-sm text-slate-700 dark:text-slate-200">
                  {label}
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={estimates[key]}
                    onChange={(event) => updateEstimate(key, event.target.value)}
                    className="rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-slate-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Markdown Preview</p>
        <div className="markdown-body min-h-36 rounded-md border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          {descriptionMarkdown.trim() ? (
            <ReactMarkdown>{descriptionMarkdown}</ReactMarkdown>
          ) : (
            <p className="text-slate-400 dark:text-slate-500">Preview will appear here.</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}

export type { SolutionFormValues }

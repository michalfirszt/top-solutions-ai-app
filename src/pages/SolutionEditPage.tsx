import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { SolutionForm } from '../components/SolutionForm'
import {
  useCategories,
  useCreateCategory,
  useCurrentUser,
  useSolution,
  useUpdateSolution,
} from '../hooks/useTopSolutionsData'
import { getStoredEmail } from '../lib/auth'

export function SolutionEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const email = getStoredEmail()
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser(email)
  const { data: solution, isLoading: isLoadingSolution, error } = useSolution(id)
  const { data: categories, isLoading: isLoadingCategories } = useCategories()
  const createCategory = useCreateCategory()
  const updateSolution = useUpdateSolution(id ?? '')

  if (!id) {
    return <Navigate to="/" replace />
  }

  if (isLoadingUser || isLoadingSolution || isLoadingCategories) {
    return <p className="text-slate-600 dark:text-slate-300">Loading form...</p>
  }

  if (error || !solution || !currentUser || !categories) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
        Could not load solution for editing.
      </div>
    )
  }

  if (solution.authorId !== currentUser.id) {
    return <Navigate to={`/solutions/${solution.id}`} replace />
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Edit Solution</h1>
      <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-6 dark:border-slate-700 dark:bg-slate-800">
        <SolutionForm
          categories={categories}
          initialValues={{
            title: solution.title,
            descriptionMarkdown: solution.descriptionMarkdown,
            categoryIds: solution.categoryIds,
            estimates: solution.estimates,
          }}
          submitLabel="Save Changes"
          isSubmitting={updateSolution.isPending}
          onCreateCategory={(name) => createCategory.mutateAsync(name)}
          onSubmit={async (values) => {
            await updateSolution.mutateAsync({
              ...values,
              authorId: solution.authorId,
              authorEmail: solution.authorEmail,
            })
            navigate(`/solutions/${solution.id}`)
          }}
        />
      </div>
    </section>
  )
}

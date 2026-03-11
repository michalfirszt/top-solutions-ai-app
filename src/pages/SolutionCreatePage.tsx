import { useNavigate } from 'react-router-dom'
import { SolutionForm } from '../components/SolutionForm'
import {
  useCategories,
  useCreateCategory,
  useCreateSolution,
  useCurrentUser,
} from '../hooks/useTopSolutionsData'
import { getStoredEmail } from '../lib/auth'

export function SolutionCreatePage() {
  const navigate = useNavigate()
  const email = getStoredEmail()
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser(email)
  const { data: categories, isLoading: isLoadingCategories } = useCategories()
  const createCategory = useCreateCategory()
  const createSolution = useCreateSolution()

  if (isLoadingUser || isLoadingCategories || !currentUser || !categories) {
    return <p className="text-slate-600">Loading form...</p>
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create Solution</h1>
      <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-6">
        <SolutionForm
          categories={categories}
          submitLabel="Create Solution"
          isSubmitting={createSolution.isPending}
          onCreateCategory={(name) => createCategory.mutateAsync(name)}
          onSubmit={async (values) => {
            const created = await createSolution.mutateAsync({
              ...values,
              authorId: currentUser.id,
              authorEmail: currentUser.email,
            })
            navigate(`/solutions/${created.id}`)
          }}
        />
      </div>
    </section>
  )
}

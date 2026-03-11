import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCategory,
  createSolution,
  ensureUserByEmail,
  getCategories,
  getSolutionById,
  getSolutions,
  getUserByEmail,
  updateSolution,
} from '../api/topSolutionsApi'
import type { SolutionInput } from '../types'

export function useEnsureUserByEmail() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ensureUserByEmail,
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ['user', user.email] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useCurrentUser(email: string | null) {
  return useQuery({
    queryKey: ['user', email],
    queryFn: () => getUserByEmail(email ?? ''),
    enabled: Boolean(email),
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export function useSolutions() {
  return useQuery({
    queryKey: ['solutions'],
    queryFn: getSolutions,
  })
}

export function useSolution(id: string | undefined) {
  return useQuery({
    queryKey: ['solutions', id],
    queryFn: () => getSolutionById(id ?? ''),
    enabled: Boolean(id),
  })
}

export function useCreateSolution() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: SolutionInput) => createSolution(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solutions'] })
    },
  })
}

export function useUpdateSolution(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: SolutionInput) => updateSolution(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solutions'] })
      queryClient.invalidateQueries({ queryKey: ['solutions', id] })
    },
  })
}

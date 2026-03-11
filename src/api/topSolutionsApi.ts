import { nowIso } from '../lib/date'
import { toSlug } from '../lib/slug'
import { normalizeEmail } from '../lib/auth'
import type { Category, Solution, SolutionInput, User } from '../types'
import { requestJson } from './http'

export async function getAllUsers(): Promise<User[]> {
  return requestJson<User[]>('/users')
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const normalized = normalizeEmail(email)
  const users = await getAllUsers()
  return users.find((user) => normalizeEmail(user.email) === normalized) ?? null
}

export async function ensureUserByEmail(email: string): Promise<User> {
  const normalized = normalizeEmail(email)
  const existingUser = await getUserByEmail(normalized)

  if (existingUser) {
    return existingUser
  }

  const timestamp = nowIso()
  return requestJson<User>('/users', {
    method: 'POST',
    body: JSON.stringify({
      email: normalized,
      createdAt: timestamp,
      updatedAt: timestamp,
    }),
  })
}

export async function getCategories(): Promise<Category[]> {
  return requestJson<Category[]>('/categories?_sort=name&_order=asc')
}

export async function createCategory(name: string): Promise<Category> {
  const trimmedName = name.trim()
  const categories = await getCategories()
  const existing = categories.find(
    (category) => category.name.toLowerCase() === trimmedName.toLowerCase(),
  )

  if (existing) {
    return existing
  }

  const timestamp = nowIso()

  return requestJson<Category>('/categories', {
    method: 'POST',
    body: JSON.stringify({
      name: trimmedName,
      slug: toSlug(trimmedName),
      createdAt: timestamp,
      updatedAt: timestamp,
    }),
  })
}

export async function getSolutions(): Promise<Solution[]> {
  return requestJson<Solution[]>('/solutions?_sort=updatedAt&_order=desc')
}

export async function getSolutionById(id: string): Promise<Solution> {
  return requestJson<Solution>(`/solutions/${id}`)
}

export async function createSolution(input: SolutionInput): Promise<Solution> {
  const timestamp = nowIso()

  return requestJson<Solution>('/solutions', {
    method: 'POST',
    body: JSON.stringify({
      ...input,
      createdAt: timestamp,
      updatedAt: timestamp,
    }),
  })
}

export async function updateSolution(id: string, input: SolutionInput): Promise<Solution> {
  const currentSolution = await getSolutionById(id)

  return requestJson<Solution>(`/solutions/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      ...input,
      id,
      createdAt: currentSolution.createdAt,
      updatedAt: nowIso(),
    }),
  })
}

export type User = {
  id: string
  email: string
  createdAt: string
  updatedAt: string
}

export type Category = {
  id: string
  name: string
  slug: string
  createdAt: string
  updatedAt: string
}

export type SolutionEstimates = {
  frontend: number
  backend: number
  mobile: number
  devops: number
  design: number
}

export type Solution = {
  id: string
  title: string
  descriptionMarkdown: string
  categoryIds: string[]
  estimates: SolutionEstimates
  authorId: string
  authorEmail: string
  createdAt: string
  updatedAt: string
}

export type SolutionInput = {
  title: string
  descriptionMarkdown: string
  categoryIds: string[]
  estimates: SolutionEstimates
  authorId: string
  authorEmail: string
}

export function nowIso(): string {
  return new Date().toISOString()
}

export function formatDateTime(dateIso: string): string {
  return new Date(dateIso).toLocaleString()
}

import { Pool } from 'pg'

let pool: Pool | undefined

export function useDb() {
  if (!pool) {
    const config = useRuntimeConfig()
    pool = new Pool({ connectionString: config.databaseUrl })
  }
  return pool
}

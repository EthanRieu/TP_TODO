export default defineEventHandler(async () => {
  const db = useDb()
  const { rows } = await db.query(
    'SELECT id, title, done, created_at FROM todos ORDER BY created_at DESC'
  )
  return rows
})

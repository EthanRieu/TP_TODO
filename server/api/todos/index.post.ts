export default defineEventHandler(async (event) => {
  const body = await readBody<{ title?: string }>(event)
  const title = body?.title?.trim()

  if (!title) {
    throw createError({ statusCode: 400, statusMessage: 'Title is required' })
  }

  const db = useDb()
  const { rows } = await db.query(
    'INSERT INTO todos (title) VALUES ($1) RETURNING id, title, done, created_at',
    [title]
  )
  return rows[0]
})

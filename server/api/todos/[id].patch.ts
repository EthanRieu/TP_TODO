export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody<{ done?: boolean; title?: string }>(event)
  const db = useDb()

  if (typeof body?.done === 'boolean') {
    const { rows } = await db.query(
      'UPDATE todos SET done = $1 WHERE id = $2 RETURNING id, title, done, created_at',
      [body.done, id]
    )
    if (!rows[0]) throw createError({ statusCode: 404, statusMessage: 'Todo not found' })
    return rows[0]
  }

  if (typeof body?.title === 'string' && body.title.trim()) {
    const { rows } = await db.query(
      'UPDATE todos SET title = $1 WHERE id = $2 RETURNING id, title, done, created_at',
      [body.title.trim(), id]
    )
    if (!rows[0]) throw createError({ statusCode: 404, statusMessage: 'Todo not found' })
    return rows[0]
  }

  throw createError({ statusCode: 400, statusMessage: 'Nothing to update' })
})

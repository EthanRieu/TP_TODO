export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const db = useDb()
  const { rowCount } = await db.query('DELETE FROM todos WHERE id = $1', [id])
  if (!rowCount) throw createError({ statusCode: 404, statusMessage: 'Todo not found' })
  return { success: true }
})

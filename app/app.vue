<script setup lang="ts">
interface Todo {
  id: number
  title: string
  done: boolean
  created_at: string
}

const { data: todos, refresh } = await useFetch<Todo[]>('/api/todos')

const newTitle = ref('')
const filter = ref<'all' | 'active' | 'done'>('all')
const submitting = ref(false)

const filtered = computed(() => {
  const list = todos.value ?? []
  if (filter.value === 'active') return list.filter((t) => !t.done)
  if (filter.value === 'done') return list.filter((t) => t.done)
  return list
})

const remaining = computed(() => (todos.value ?? []).filter((t) => !t.done).length)
const year = new Date().getFullYear()

async function addTodo() {
  const title = newTitle.value.trim()
  if (!title || submitting.value) return
  submitting.value = true
  try {
    await $fetch('/api/todos', { method: 'POST', body: { title } })
    newTitle.value = ''
    await refresh()
  } finally {
    submitting.value = false
  }
}

async function toggleTodo(todo: Todo) {
  await $fetch(`/api/todos/${todo.id}`, { method: 'PATCH', body: { done: !todo.done } })
  await refresh()
}

async function removeTodo(id: number) {
  await $fetch(`/api/todos/${id}`, { method: 'DELETE' })
  await refresh()
}
</script>

<template>
  <div class="page">
    <NuxtRouteAnnouncer />

    <header class="site-header">
      <div class="logo">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1.5" y="1.5" width="21" height="21" rx="5" stroke="currentColor" stroke-width="1.6" />
          <path d="M7 12.5L10.3 16L17 8.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>Tasks</span>
      </div>
    </header>

    <main class="content">
      <section class="card">
        <div class="card-head">
          <h1>To-Do</h1>
          <p class="counter">{{ remaining }} task{{ remaining === 1 ? '' : 's' }} left</p>
        </div>

        <form class="add-form" @submit.prevent="addTodo">
          <input
            v-model="newTitle"
            type="text"
            placeholder="What needs to be done?"
            :disabled="submitting"
          />
          <button type="submit" :disabled="submitting || !newTitle.trim()">Add</button>
        </form>

        <nav class="filters">
          <button :class="{ active: filter === 'all' }" @click="filter = 'all'">All</button>
          <button :class="{ active: filter === 'active' }" @click="filter = 'active'">Active</button>
          <button :class="{ active: filter === 'done' }" @click="filter = 'done'">Done</button>
        </nav>

        <ul class="todo-list">
          <li v-for="todo in filtered" :key="todo.id" class="todo-item" :class="{ done: todo.done }">
            <label>
              <input type="checkbox" :checked="todo.done" @change="toggleTodo(todo)" />
              <span>{{ todo.title }}</span>
            </label>
            <button class="delete" aria-label="Delete task" @click="removeTodo(todo.id)">✕</button>
          </li>
          <li v-if="!filtered.length" class="empty">Nothing here yet</li>
        </ul>
      </section>
    </main>

    <footer class="site-footer">
      <p>Nuxt · PostgreSQL · {{ year }}</p>
    </footer>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f6f4ef;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  color: #262622;
}

.site-header {
  display: flex;
  align-items: center;
  padding: 1.25rem 2rem;
  border-bottom: 1px solid #e7e3da;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.01em;
  color: #262622;
}

.logo svg {
  width: 1.4rem;
  height: 1.4rem;
  color: #5f7a63;
}

.content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1rem;
}

.card {
  width: 100%;
  max-width: 28rem;
  background: #ffffff;
  border: 1px solid #e7e3da;
  border-radius: 0.85rem;
  box-shadow: 0 1px 2px rgba(38, 38, 34, 0.04);
  padding: 1.75rem;
}

.card-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

h1 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #262622;
}

.counter {
  margin: 0;
  font-size: 0.8rem;
  color: #8a8578;
}

.add-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.1rem;
}

.add-form input {
  flex: 1;
  padding: 0.6rem 0.85rem;
  border: 1px solid #ded9cc;
  border-radius: 0.55rem;
  background: #fdfcfa;
  font-size: 0.9rem;
  color: #262622;
  outline: none;
  transition: border-color 0.15s ease;
}

.add-form input::placeholder {
  color: #a8a297;
}

.add-form input:focus {
  border-color: #5f7a63;
}

.add-form button {
  padding: 0.6rem 1.1rem;
  border: none;
  border-radius: 0.55rem;
  background: #5f7a63;
  color: #fdfcfa;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.15s ease;
}

.add-form button:hover:not(:disabled) {
  background: #4d6551;
}

.add-form button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.filters {
  display: flex;
  gap: 0.35rem;
  margin-bottom: 1.1rem;
}

.filters button {
  padding: 0.3rem 0.75rem;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: #8a8578;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.filters button:hover {
  background: #f1efe8;
}

.filters button.active {
  background: #eaf0ea;
  color: #4d6551;
}

.todo-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.55rem 0.7rem;
  border-radius: 0.55rem;
  transition: background 0.15s ease;
}

.todo-item:hover {
  background: #f6f4ef;
}

.todo-item label {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex: 1;
  cursor: pointer;
}

.todo-item input[type='checkbox'] {
  width: 1.05rem;
  height: 1.05rem;
  accent-color: #5f7a63;
  cursor: pointer;
}

.todo-item span {
  font-size: 0.9rem;
  color: #262622;
}

.todo-item.done span {
  color: #a8a297;
  text-decoration: line-through;
}

.todo-item .delete {
  border: none;
  background: transparent;
  color: #cfcabc;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0.2rem 0.4rem;
  border-radius: 0.4rem;
  transition: color 0.15s ease, background 0.15s ease;
}

.todo-item .delete:hover {
  color: #b3523f;
  background: #f7e9e6;
}

.empty {
  text-align: center;
  padding: 1.4rem 0;
  color: #a8a297;
  font-size: 0.85rem;
}

.site-footer {
  text-align: center;
  padding: 1.25rem;
  border-top: 1px solid #e7e3da;
}

.site-footer p {
  margin: 0;
  font-size: 0.75rem;
  color: #a8a297;
}
</style>

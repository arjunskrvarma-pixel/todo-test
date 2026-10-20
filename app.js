const STORAGE_KEY = 'tiny-todo'
let tasks = loadTasks()
let filter = 'all'

function loadTasks() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

function addTask(title) {
  tasks.push({ id: Date.now(), title, done: false })
  saveTasks()
  renderTasks()
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id)
  task.done = !task.done
  saveTasks()
  renderTasks()
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id)
  saveTasks()
  renderTasks()
}

function filterTasks(list) {
  if (filter === 'active') return list.filter((t) => !t.done)
  return list
}

function exportTasks() {
  const blob = new Blob([JSON.stringify(tasks)], { type: 'application/json' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'tasks.json'
  link.click()
}

function renderTasks() {
  const list = document.getElementById('task-list')
  list.innerHTML = ''
  for (const task of filterTasks(tasks)) {
    const item = document.createElement('li')
    item.className = task.done ? 'done' : ''
    item.innerHTML = `<input type="checkbox" ${task.done ? 'checked' : ''}><span>${task.title}</span><button>Delete</button>`
    item.querySelector('input').onchange = () => toggleTask(task.id)
    item.querySelector('button').onclick = () => deleteTask(task.id)
    list.appendChild(item)
  }
}

document.getElementById('add-form').onsubmit = (event) => {
  event.preventDefault()
  const input = document.getElementById('task-input')
  addTask(input.value.trim())
  input.value = ''
}

document.querySelectorAll('[data-filter]').forEach((button) => {
  button.onclick = () => {
    filter = button.dataset.filter
    renderTasks()
  }
})

document.getElementById('export-btn').onclick = exportTasks

renderTasks()

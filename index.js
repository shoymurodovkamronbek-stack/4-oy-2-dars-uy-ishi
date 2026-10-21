let todos = JSON.parse(localStorage.getItem('todos')) || [
  {
    id: 1,
    title: "Salom",
    completed: true,
    create_at: "16/10/2026 16:50"
  }
];

let currentFilter = 'all';

function saveToLocalStorage() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    addTodo();
  }
}

function renderTodos() {    
  const list = document.getElementById('todoList');
  const searchText = document.getElementById('searchInput').value.toLowerCase();
  list.innerHTML = '';

  let filteredTodos = todos.filter(todo => {
    let matchesSearch = todo.title.toLowerCase().includes(searchText);
    if (currentFilter === 'active') return matchesSearch && !todo.completed;
    if (currentFilter === 'completed') return matchesSearch && todo.completed;
    return matchesSearch;
  });

  if (filteredTodos.length === 0) {
    list.innerHTML = `<div class="empty-message">Empty… add your first task</div>`;
    return;
  }

  filteredTodos.forEach(todo => {
    let li = document.createElement('li');
    li.innerHTML = `   
      <div style="display: flex; align-items: center; gap: 10px; flex: 1; overflow: hidden;">
        <input type="checkbox" ${todo.completed ? 'checked' : ''} onclick="toggle(${todo.id})">
        <div>
          <span class="title ${todo.completed ? 'completed' : ''}">${todo.title}</span>
          <span class="date-text">${todo.create_at}</span>
        </div>
      </div>
      <div class="action-buttons">
        <button class="edit-btn" onclick="editTodo(${todo.id})">Edit</button>
        <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
      </div>
    `;
    list.appendChild(li);
  });
}

function addTodo() {
  let input = document.getElementById('todoInput');
  if (input.value.trim() === '') return;

  let newTodo = {
    id: Date.now(),
    title: input.value.trim(),
    completed: false,
    create_at: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
  };

  todos.push(newTodo);
  saveToLocalStorage(); 
  input.value = '';
  renderTodos();
}

function toggle(id) {
  let todo = todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveToLocalStorage(); 
    renderTodos();
  }
}

function editTodo(id) {
  let todo = todos.find(t => t.id === id);
  if (todo) {
    let newTitle = prompt("Edit task:", todo.title);
    if (newTitle !== null && newTitle.trim() !== '') {
      todo.title = newTitle.trim();
      saveToLocalStorage();
      renderTodos();
    }
  }
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveToLocalStorage(); 
  renderTodos();
}

function clearAll() {
  if(confirm("Are you sure you want to delete all tasks?")) {
    todos = [];
    saveToLocalStorage(); 
    renderTodos();
  }
}

function setFilter(filter) {
  currentFilter = filter;
  renderTodos();
}

renderTodos();
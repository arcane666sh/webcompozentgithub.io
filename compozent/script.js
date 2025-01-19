// Elements
const taskInput = document.getElementById('taskInput');
const categorySelect = document.getElementById('categorySelect');
const prioritySelect = document.getElementById('prioritySelect');
const dueDate = document.getElementById('dueDate');
const addTaskBtn = document.getElementById('addTaskBtn');
const searchBar = document.getElementById('searchBar');
const sortPriorityBtn = document.getElementById('sortPriorityBtn');
const resetTasksBtn = document.getElementById('resetTasksBtn');
const taskList = document.getElementById('taskList');
const completedList = document.getElementById('completedList');
const badges = document.getElementById('badges');
const progressBar = document.getElementById('progressBar');
const toggleThemeBtn = document.getElementById('toggleThemeBtn');

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', loadTasksFromStorage);

// Add Task
addTaskBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  const category = categorySelect.value;
  const priority = prioritySelect.value;
  const due = dueDate.value;

  if (taskText) {
    const taskItem = createTaskItem(taskText, category, priority, due);
    taskList.appendChild(taskItem);
    saveTasksToStorage();
    displayNotification('Task added successfully!');
    taskInput.value = '';
    dueDate.value = '';
    updateStats();
  } else {
    displayNotification('Task description cannot be empty!', 'error');
  }
});

// Create Task Item
function createTaskItem(text, category, priority, due) {
  const taskItem = document.createElement('li');
  taskItem.dataset.priority = priority;
  taskItem.innerHTML = `
    <span>${text}</span>
    <small>[${category}] - Priority: ${priority} - Due: ${due || 'No date'}</small>
    <button class="edit">Edit</button>
    <button class="complete">Complete</button>
    <button class="delete">Delete</button>
  `;

  taskItem.querySelector('.edit').addEventListener('click', () => editTask(taskItem));
  taskItem.querySelector('.complete').addEventListener('click', () => moveToCompleted(taskItem));
  taskItem.querySelector('.delete').addEventListener('click', () => {
    if (confirm('Are you sure you want to delete this task?')) {
      taskItem.remove();
      saveTasksToStorage();
      displayNotification('Task deleted successfully!');
      updateStats();
    }
  });

  return taskItem;
}

// Edit Task
function editTask(taskItem) {
  const text = taskItem.querySelector('span').innerText;
  taskInput.value = text;
  taskItem.remove();
  saveTasksToStorage();
  updateStats();
}

// Move to Completed List
function moveToCompleted(taskItem) {
  taskItem.querySelector('.complete').remove();
  completedList.appendChild(taskItem);
  saveTasksToStorage();
  displayNotification('Task completed successfully!');
  updateStats();
}

// Update Stats and Badges
function updateStats() {
  const completedCount = completedList.children.length;
  const totalTasks = completedCount + taskList.children.length;

  // Update Progress Bar
  const progressPercent = totalTasks ? (completedCount / totalTasks) * 100 : 0;
  progressBar.style.width = `${progressPercent}%`;

  // Update Badges
  badges.innerHTML = '';
  if (completedCount >= 3) badges.innerHTML += `<div class="badge" style="background: #cd7f32;">Bronze</div>`;
  if (completedCount >= 5) badges.innerHTML += `<div class="badge" style="background: #c0c0c0;">Silver</div>`;
  if (completedCount >= 7) badges.innerHTML += `<div class="badge" style="background: #ffd700;">Gold</div>`;
  if (completedCount === 0) badges.innerHTML = `<p>No badges yet!</p>`;
}

// Save Tasks to localStorage
function saveTasksToStorage() {
  const tasks = [];
  taskList.querySelectorAll('li').forEach(task => tasks.push(task.innerHTML));
  const completed = [];
  completedList.querySelectorAll('li').forEach(task => completed.push(task.innerHTML));
  localStorage.setItem('tasks', JSON.stringify({ tasks, completed }));
}

// Load Tasks from localStorage
function loadTasksFromStorage() {
  const storedData = JSON.parse(localStorage.getItem('tasks'));
  if (storedData) {
    storedData.tasks.forEach(taskHTML => {
      const taskItem = document.createElement('li');
      taskItem.innerHTML = taskHTML;
      taskList.appendChild(taskItem);
    });
    storedData.completed.forEach(taskHTML => {
      const taskItem = document.createElement('li');
      taskItem.innerHTML = taskHTML;
      completedList.appendChild(taskItem);
    });
  }
  updateStats();
}

// Display Notification
function displayNotification(message, type = 'success') {
  alert(`${type === 'error' ? 'Error: ' : ''}${message}`);
}

// Search Tasks
searchBar.addEventListener('input', () => {
  const query = searchBar.value.toLowerCase();
  taskList.querySelectorAll('li').forEach(task => {
    const text = task.querySelector('span').innerText.toLowerCase();
    task.style.display = text.includes(query) ? '' : 'none';
  });
});

// Sort by Priority
sortPriorityBtn.addEventListener('click', () => {
  const tasks = Array.from(taskList.children);
  tasks.sort((a, b) => {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    return priorityOrder[a.dataset.priority] - priorityOrder[b.dataset.priority];
  });
  tasks.forEach(task => taskList.appendChild(task));
});

// Reset All Tasks
resetTasksBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to reset all tasks?')) {
    localStorage.clear();
    taskList.innerHTML = '';
    completedList.innerHTML = '';
    updateStats();
    displayNotification('All tasks reset!');
  }
});

// Theme Toggle
toggleThemeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
});

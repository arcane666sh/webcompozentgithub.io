// Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const completedList = document.getElementById('completedList');
const badges = document.getElementById('badges');
const progressBar = document.getElementById('progressBar');

// Add Task
addTaskBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  if (taskText) {
    taskList.appendChild(createTaskItem(taskText));
    taskInput.value = '';
    updateStats();
  }
});

// Create Task Item
function createTaskItem(text) {
  const taskItem = document.createElement('li');
  taskItem.innerHTML = `
    <span>${text}</span>
    <button class="complete">Complete</button>
    <button class="delete">Delete</button>
  `;

  taskItem.querySelector('.complete').addEventListener('click', () => {
    moveToCompleted(taskItem);
  });

  taskItem.querySelector('.delete').addEventListener('click', () => {
    taskItem.remove();
    updateStats();
  });

  return taskItem;
}

// Move to Completed List
function moveToCompleted(taskItem) {
  taskItem.querySelector('.complete').remove();
  completedList.appendChild(taskItem);
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

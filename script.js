// Common storage keys
const USERS_KEY = 'users';
const FRIENDS_KEY = 'friends';
const TASKS_KEY_PREFIX = 'tasks_';

// SIGNUP function
function signup() {
  const username = document.getElementById('signupUsername').value.trim();
  const password = document.getElementById('signupPassword').value;

  if (username.length < 3) return alert('Username must be at least 3 characters.');
  if (password.length < 6) return alert('Password must be at least 6 characters.');

  let users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');

  if (users[username]) return alert('Username already exists.');

  users[username] = { password };
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  alert('Sign up successful! You can now log in.');
  // Clear fields
  document.getElementById('signupUsername').value = '';
  document.getElementById('signupPassword').value = '';
}

// LOGIN function
function login() {
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;

  let users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
  if (!users[username] || users[username].password !== password) {
    return alert('Invalid username or password.');
  }

  localStorage.setItem('loggedInUser', username);
  window.location.href = 'dashboard.html';
}

// LOGOUT function
function logout() {
  localStorage.removeItem('loggedInUser');
  window.location.href = 'index.html';
}

// THEME FUNCTIONS
function setTheme(mode) {
  document.body.classList.remove('light', 'dark');
  document.body.classList.add(mode);
  localStorage.setItem('mode', mode);
}

function toggleTheme() {
  const current = localStorage.getItem('mode') || 'light';
  setTheme(current === 'light' ? 'dark' : 'light');
}

// TASKS

function getTasks() {
  const user = localStorage.getItem('loggedInUser');
  if (!user) return [];
  return JSON.parse(localStorage.getItem(TASKS_KEY_PREFIX + user) || '[]');
}

function saveTasks(tasks) {
  const user = localStorage.getItem('loggedInUser');
  localStorage.setItem(TASKS_KEY_PREFIX + user, JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = getTasks();
  const list = document.getElementById('taskList');
  list.innerHTML = '';
  tasks.forEach(task => {
    const div = document.createElement('div');
    div.className = 'task-item';
    div.innerHTML = `<strong>${task.time}</strong> - ${task.name}<br/><small>${task.desc || ''}</small>`;
    list.appendChild(div);
  });
}

// Add friend by username
function addFriend() {
  const friendName = document.getElementById('friendName').value.trim();
  if (!friendName) return alert('Enter a username.');

  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
  if (!users[friendName]) return alert('User does not exist.');

  const user = localStorage.getItem('loggedInUser');
  if (friendName === user) return alert("You can't add yourself.");

  let friends = JSON.parse(localStorage.getItem(FRIENDS_KEY) || '{}');
  friends[user] = friends[user] || [];

  if (friends[user].includes(friendName)) {
    return alert('Friend already added.');
  }

  friends[user].push(friendName);
  localStorage.setItem(FRIENDS_KEY, JSON.stringify(friends));
  document.getElementById('friendName').value = '';
  loadFriends();
}

// Load and display friends list
function loadFriends() {
  const user = localStorage.getItem('loggedInUser');
  const friends = JSON.parse(localStorage.getItem(FRIENDS_KEY) || '{}');
  const list = document.getElementById('friendList');
  list.innerHTML = '';

  if (!friends[user]) return;

  friends[user].forEach(friend => {
    const li = document.createElement('li');
    li.textContent = friend;
    list.appendChild(li);
  });
}

// Add Task Dialog controls
function openTaskDialog() {
  document.getElementById('addTaskDialog').classList.remove('hidden');
  // Clear inputs
  document.getElementById('taskName').value = '';
  document.getElementById('taskTime').value = '';
  document.getElementById('taskDesc').value = '';
}

function closeTaskDialog() {
  document.getElementById('addTaskDialog').classList.add('hidden');
}

function submitTask() {
  const name = document.getElementById('taskName').value.trim();
  const time = document.getElementById('taskTime').value;
  const desc = document.getElementById('taskDesc').value.trim();

  if (!name) return alert('Please enter task name.');
  if (!time) return alert('Please enter time.');

  let tasks = getTasks();
  tasks.push({ name, time, desc });
  saveTasks(tasks);
  loadTasks();
  closeTaskDialog();
}

// On dashboard load
function initDashboard() {
  const user = localStorage.getItem('loggedInUser');
  if (!user) {
    window.location.href = 'index.html';
    return;
  }

  // Greeting message
  const hour = new Date().getHours();
  let greet = 'Hello';
  if (hour < 12) greet = 'Good morning';
  else if (hour < 18) greet = 'Good afternoon';
  else greet = 'Good evening';

  document.getElementById('greeting').textContent = `${greet}, ${user}!`;

  loadTasks();
  loadFriends();

  // Load theme preference
  const mode = localStorage.getItem('mode') || 'light';
  setTheme(mode);

  // Setup theme toggle button
  document.getElementById('themeToggle').onclick = toggleTheme;

  // Setup add task button to open dialog
  document.getElementById('addTaskBtn').onclick = openTaskDialog;
}

// Run on page load
window.onload = () => {
  if (document.body.classList.contains('dashboard-container')) {
    initDashboard();
  }
};

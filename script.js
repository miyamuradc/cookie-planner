function toggleMode() {
  const body = document.body;
  body.classList.toggle('dark-mode');
  localStorage.setItem('mode', body.classList.contains('dark-mode') ? 'dark' : 'light');
}

function setTheme(mode) {
  if (mode === 'dark') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}

function addFriend() {
  const friendName = document.getElementById('friendName').value.trim();
  if (friendName.length < 3) return alert("Username must be at least 3 characters.");
  const user = localStorage.getItem('loggedInUser');
  let friends = JSON.parse(localStorage.getItem('friends') || '{}');
  friends[user] = friends[user] || [];
  if (!friends[user].includes(friendName)) {
    friends[user].push(friendName);
  }
  localStorage.setItem('friends', JSON.stringify(friends));
  loadFriends(user);
  document.getElementById('friendName').value = '';
}

function loadFriends(user) {
  const list = document.getElementById('friendList');
  list.innerHTML = '';
  const friends = JSON.parse(localStorage.getItem('friends') || '{}');
  (friends[user] || []).forEach(name => {
    const li = document.createElement('li');
    li.innerText = name;
    list.appendChild(li);
  });
}

// Modal controls
function openTaskModal() {
  document.getElementById('taskModal').style.display = 'flex';
}

function closeTaskModal() {
  document.getElementById('taskModal').style.display = 'none';
  document.getElementById('taskName').value = '';
  document.getElementById('taskTime').value = '';
  document.getElementById('taskDesc').value = '';
}

// Save task to localStorage
function saveTask() {
  const name = document.getElementById('taskName').value.trim();
  const time = document.getElementById('taskTime').value;
  const desc = document.getElementById('taskDesc').value.trim();
  if (!name || !time) return alert("Task name and time required!");

  const user = localStorage.getItem('loggedInUser');
  const tasks = JSON.parse(localStorage.getItem('tasks') || '{}');
  tasks[user] = tasks[user] || [];
  tasks[user].push({ name, time, desc });
  localStorage.setItem('tasks', JSON.stringify(tasks));
  closeTaskModal();
  loadTasks();
}

// Display task list
function loadTasks() {
  const user = localStorage.getItem('loggedInUser');
  const tasks = JSON.parse(localStorage.getItem('tasks') || '{}');
  const list = document.getElementById('taskList');
  list.innerHTML = '';

  if (!tasks[user]) return;

  tasks[user].sort((a, b) => a.time.localeCompare(b.time));
  tasks[user].forEach(task => {
    const div = document.createElement('div');
    div.className = 'task-item';
    div.innerHTML = `<strong>${task.time} - ${task.name}</strong><br>${task.desc || ''}`;
    list.appendChild(div);
  });
}

window.onload = function () {
  const page = window.location.pathname;
  if (page.includes('dashboard.html')) {
    const user = localStorage.getItem('loggedInUser');
    if (!user) return (window.location.href = 'index.html');
    document.getElementById('greeting').innerText = `Hello, ${user}!`;
    loadTasks();
    loadFriends(user);
    setTheme(localStorage.getItem('mode') || 'light');
  }
};

// Auth Logic
function signup() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  if (username.length < 3 || password.length < 6) {
    return showMessage("Username must be ≥ 3 chars and password ≥ 6 chars.");
  }
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  if (users[username]) return showMessage("Username already taken.");
  users[username] = { password, friends: [] };
  localStorage.setItem('users', JSON.stringify(users));
  showMessage("Signup successful! You can now log in.");
}

function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  if (users[username]?.password === password) {
    localStorage.setItem('loggedInUser', username);
    window.location.href = 'dashboard.html';
  } else {
    showMessage("Invalid username or password.");
  }
}

function showMessage(msg) {
  document.getElementById('message').innerText = msg;
}

// Dashboard Logic
window.onload = function () {
  const page = window.location.pathname;
  if (page.includes('dashboard.html')) {
    const user = localStorage.getItem('loggedInUser');
    if (!user) return (window.location.href = 'index.html');
    document.getElementById('greeting').innerText = `Hello, ${user}!`;
    loadPlanner(user);
    loadFriends(user);
    setTheme(localStorage.getItem('mode') || 'light');
  }
};

function loadPlanner(user) {
  const scheduleDiv = document.getElementById('schedule');
  const hours = Array.from({ length: 12 }, (_, i) => `${8 + i}:00`);
  const planner = JSON.parse(localStorage.getItem('planner') || '{}');
  hours.forEach(hour => {
    const textarea = document.createElement('textarea');
    textarea.placeholder = `What to do at ${hour}?`;
    textarea.value = planner[user]?.[hour] || '';
    textarea.onchange = () => {
      planner[user] = planner[user] || {};
      planner[user][hour] = textarea.value;
      localStorage.setItem('planner', JSON.stringify(planner));
    };
    scheduleDiv.appendChild(textarea);
  });
}

function toggleMode() {
  const current = document.body.classList.contains('dark') ? 'light' : 'dark';
  setTheme(current);
}

function setTheme(mode) {
  if (mode === 'dark') document.body.classList.add('dark');
  else document.body.classList.remove('dark');
  localStorage.setItem('mode', mode);
}

// Friend System
function addFriend() {
  const friend = document.getElementById('friendName').value.trim();
  const user = localStorage.getItem('loggedInUser');
  if (!friend || friend === user) return;
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  if (!users[friend]) return alert("User not found.");
  if (!users[user].friends.includes(friend)) {
    users[user].friends.push(friend);
    localStorage.setItem('users', JSON.stringify(users));
    loadFriends(user);
  }
}

function loadFriends(user) {
  const list = document.getElementById('friendList');
  list.innerHTML = '';
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  (users[user].friends || []).forEach(friend => {
    const li = document.createElement('li');
    li.textContent = friend;
    list.appendChild(li);
  });
}

// ---------------- Calendar ----------------
document.getElementById("today").innerText = new Date().toDateString();

// ---------------- LocalStorage Helpers ----------------
function saveData() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("notes", JSON.stringify(notes));
}

function loadData() {
  const storedTasks = JSON.parse(localStorage.getItem("tasks"));
  const storedNotes = JSON.parse(localStorage.getItem("notes"));
  if (storedTasks) tasks = storedTasks;
  if (storedNotes) notes = storedNotes;
  renderTasks();
  renderNotes();
}

// ---------------- Tasks functionality ----------------
const list = document.getElementById("taskList");
const input = document.getElementById("taskInput");
let tasks = []; // {text:"...", done:false, editing:false}

function renderTasks() {
  list.innerHTML = "";
  tasks.forEach((task, i) => {
    if (task.editing) {
      // وضع التعديل
      list.innerHTML += `
        <li>
          <input type="text" id="editTaskInput${i}" value="${task.text}">
          <button onclick="saveTask(${i})" class="btn btn-sm btn-success mx-1">Save</button>
          <button onclick="cancelEditTask(${i})" class="btn btn-sm btn-secondary">Cancel</button>
        </li>`;
    } else {
      // الوضع العادي
      list.innerHTML += `
        <li>
          <input type="checkbox" ${
            task.done ? "checked" : ""
          } onchange="toggleTask(${i})">
          <span style="text-decoration:${
            task.done ? "line-through" : "none"
          }">${task.text}</span>
          <button onclick="editTask(${i})" class="btn btn-sm btn-warning mx-1">Edit</button>
          <button onclick="deleteTask(${i})" class="btn btn-sm btn-danger">Delete</button>
        </li>`;
    }
  });
}

function addTask() {
  if (input.value.trim() !== "") {
    tasks.push({ text: input.value.trim(), done: false, editing: false });
    input.value = "";
    saveData();
    renderTasks();
  }
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveData();
  renderTasks();
}

function editTask(index) {
  tasks[index].editing = true;
  renderTasks();
}

function saveTask(index) {
  const newVal = document.getElementById(`editTaskInput${index}`).value.trim();
  if (newVal !== "") {
    tasks[index].text = newVal;
  }
  tasks[index].editing = false;
  saveData();
  renderTasks();
}

function cancelEditTask(index) {
  tasks[index].editing = false;
  renderTasks();
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  saveData();
  renderTasks();
}

// ---------------- Notes functionality ----------------
let notes = []; // {text:"...", editing:false}
const inputNote = document.getElementById("noteInput");
const grad = document.getElementById("notesGrad");

function renderNotes() {
  grad.innerHTML = "";
  notes.forEach((note, i) => {
    if (note.editing) {
      grad.innerHTML += `
        <div class="col-md-3 bg-white p-3 m-2 rounded shadow-sm">
          <input type="text" id="editNoteInput${i}" value="${note.text}" class="form-control mb-2">
          <button onclick="saveNote(${i})" class="btn btn-sm btn-success mx-1">Save</button>
          <button onclick="cancelEditNote(${i})" class="btn btn-sm btn-secondary">Cancel</button>
        </div>`;
    } else {
      grad.innerHTML += `
        <div class="col-md-3 bg-white p-3 m-2 rounded shadow-sm">
          <p>${note.text}</p>
          <button onclick="editNote(${i})" class="btn btn-sm btn-warning mx-1">Edit</button>
          <button onclick="deleteNote(${i})" class="btn btn-sm btn-danger">Delete</button>
        </div>`;
    }
  });
}

function addNote() {
  if (inputNote.value.trim() !== "") {
    notes.push({ text: inputNote.value.trim(), editing: false });
    inputNote.value = "";
    saveData();
    renderNotes();
  }
}

function deleteNote(index) {
  notes.splice(index, 1);
  saveData();
  renderNotes();
}

function editNote(index) {
  notes[index].editing = true;
  renderNotes();
}

function saveNote(index) {
  const newVal = document.getElementById(`editNoteInput${index}`).value.trim();
  if (newVal !== "") {
    notes[index].text = newVal;
  }
  notes[index].editing = false;
  saveData();
  renderNotes();
}

function cancelEditNote(index) {
  notes[index].editing = false;
  renderNotes();
}

// ---------------- Load saved data on start ----------------
loadData();
// Dark Mode Toggle
const toggleBtn = document.getElementById("toggleDarkMode");
const body = document.body;

// Load saved mode
if (localStorage.getItem("mode") === "dark") {
  body.classList.add("dark-mode");
  toggleBtn.textContent = "☀️";
}

toggleBtn.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  if (body.classList.contains("dark-mode")) {
    localStorage.setItem("mode", "dark");
    toggleBtn.textContent = "☀️";
  } else {
    localStorage.setItem("mode", "light");
    toggleBtn.textContent = "🌙";
  }
});
// ---------------- Profile ----------------
function saveProfile() {
  const name = document.getElementById("profileInputName").value.trim();
  const picInput = document.getElementById("profileInputPic");

  if (!name) {
    alert("Please enter name");
    return;
  }

  let picURL = "./img/default.jpg"; // default
  if (picInput.files && picInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      picURL = e.target.result;
      updateProfileUI(name, picURL);
      localStorage.setItem("profile", JSON.stringify({ name, picURL }));
    };
    reader.readAsDataURL(picInput.files[0]);
  } else {
    updateProfileUI(name, picURL);
    localStorage.setItem("profile", JSON.stringify({ name, picURL }));
  }
}

function updateProfileUI(name, picURL) {
  document.getElementById("profileName").textContent = name;
  document.getElementById("profilePic").src = picURL;
  document.getElementById("profileForm").classList.add("d-none");
  document.getElementById("profileCard").classList.remove("d-none");
}

function editProfile() {
  document.getElementById("profileForm").classList.remove("d-none");
  document.getElementById("profileCard").classList.add("d-none");
}

// Load from localStorage
window.addEventListener("DOMContentLoaded", () => {
  const savedProfile = JSON.parse(localStorage.getItem("profile"));
  if (savedProfile) {
    updateProfileUI(savedProfile.name, savedProfile.picURL);
  }
});

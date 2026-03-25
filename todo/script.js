const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
tasks.forEach(task => renderTask(task));

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    const task = { text: taskText, completed: false };
    tasks.push(task);
    saveTasks();

    renderTask(task);
    taskInput.value = "";
}

function renderTask(task) {
    const li = document.createElement("li");
    li.textContent = task.text;
    if (task.completed) li.classList.add("completed");

    // Toggle complete on click
    li.addEventListener("click", () => {
        task.completed = !task.completed;
        li.classList.toggle("completed");
        saveTasks();
    });

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.className = "delete-btn";
    delBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // prevent toggle
        tasks = tasks.filter(t => t !== task);
        li.remove();
        saveTasks();
    });

    li.appendChild(delBtn);
    taskList.appendChild(li);
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
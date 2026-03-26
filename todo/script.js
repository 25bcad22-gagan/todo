const API_URL = "https://your-app.onrender.com"; // change after deploy

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

// Load tasks from backend
async function loadTasks() {
    const res = await fetch(`${API_URL}/tasks`);
    const tasks = await res.json();

    taskList.innerHTML = "";
    tasks.forEach(renderTask);
}

// Add task
async function addTask() {
    const taskText = taskInput.value.trim();
    if (!taskText) return;

    await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: taskText })
    });

    taskInput.value = "";
    loadTasks();
}

// Render task
function renderTask(task) {
    const li = document.createElement("li");
    li.textContent = task.text;

    if (task.completed) li.classList.add("completed");

    // Toggle complete
    li.addEventListener("click", async () => {
        await fetch(`${API_URL}/tasks/${task.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                completed: !task.completed
            })
        });

        loadTasks();
    });

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.className = "delete-btn";

    delBtn.onclick = async (e) => {
        e.stopPropagation();

        await fetch(`${API_URL}/tasks/${task.id}`, {
            method: "DELETE"
        });

        loadTasks();
    };

    li.appendChild(delBtn);
    taskList.appendChild(li);
}

// Load on page start
loadTasks();

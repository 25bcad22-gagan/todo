const API_URL = "https://your-app.onrender.com"; // change this

const table = document.getElementById("adminTable");

// Load all tasks
async function loadTasks() {
    const res = await fetch(`${API_URL}/tasks`);
    const tasks = await res.json();

    table.innerHTML = "";

    tasks.forEach(task => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${task.id}</td>
            <td>${task.text}</td>
            <td>${task.completed ? "✅ Done" : "❌ Pending"}</td>
            <td>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </td>
        `;

        table.appendChild(row);
    });
}

// Delete task
async function deleteTask(id) {
    await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE"
    });

    loadTasks();
}

// Load on start
loadTasks();

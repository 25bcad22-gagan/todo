const API_URL = "https://your-app.onrender.com"; // change this

const table = document.getElementById("adminTable");

// Load tasks from DB
async function loadTasks() {
    try {
        const res = await fetch(`${API_URL}/tasks`);
        const tasks = await res.json();

        table.innerHTML = "";

        if (tasks.length === 0) {
            table.innerHTML = "<tr><td colspan='4'>No data found</td></tr>";
            return;
        }

        tasks.forEach(task => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${task.id}</td>
                <td>${task.text}</td>
                <td>${task.completed ? "Done" : "Pending"}</td>
                <td>
                    <button onclick="deleteTask(${task.id})">Delete</button>
                </td>
            `;

            table.appendChild(row);
        });

    } catch (err) {
        console.error("Error:", err);
    }
}

// Delete task
async function deleteTask(id) {
    await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE"
    });

    loadTasks();
}

// Auto load
window.onload = loadTasks;

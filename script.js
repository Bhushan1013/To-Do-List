// Load tasks from local storage when the page loads
document.addEventListener('DOMContentLoaded', loadTasks);

function addTask() {
    const inputField = document.getElementById('inputTask');
    const taskValue = inputField.value.trim();

    if (taskValue === "") {
        alert("Task cannot be empty!");
        return;
    }

    const newTask = document.createElement('li');
    newTask.classList.add('task-item'); // Add the fade-in animation class
    const taskText = document.createElement('span'); // Create a span for the task text
    taskText.textContent = taskValue;

    // Create a checkbox for marking the task as completed
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'completed-checkbox';
    newTask.appendChild(checkbox);

    // Append the task text
    newTask.appendChild(taskText);

    // Add Edit and Delete buttons
    editTask(newTask, taskText);
    deleteTask(newTask, taskValue);

    // Append the task to the task list
    const taskList = document.getElementById("taskList");
    taskList.appendChild(newTask);

    // Save task to local storage
    saveTaskToLocalStorage({ text: taskValue, completed: false });

    // Reset the input field
    inputField.value = "";

    // Add toggle functionality for the checkbox
    toggleTaskCompletion(checkbox, taskText, taskValue);
}

function editTask(newTask, taskText) {
    const editBtn = document.createElement('button');
    editBtn.innerHTML = '<i class="fas fa-edit"></i>'; // Use Font Awesome edit icon
    editBtn.className = 'edit-btn'; // Add a class for styling
    newTask.appendChild(editBtn);

    editBtn.onclick = function () {
        const updatedTask = prompt("Edit your task:", taskText.textContent);
        if (updatedTask !== null) {
            const oldTask = taskText.textContent;
            taskText.textContent = updatedTask === "" ? "No task entered" : updatedTask;

            // Add a subtle animation to indicate the task was updated
            taskText.style.animation = "fadeIn 0.3s ease-in-out";

            // Update local storage
            updateTaskInLocalStorage(oldTask, { text: taskText.textContent, completed: false });
        }
    };
}

function deleteTask(newTask, taskValue) {
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>'; // Use Font Awesome trash icon
    deleteBtn.className = 'delete-btn'; // Add a class for styling
    newTask.appendChild(deleteBtn);

    deleteBtn.onclick = function () {
        // Add fade-out animation
        newTask.style.animation = "fadeOut 0.3s ease-in-out";
        newTask.addEventListener("animationend", function () {
            newTask.remove();

            // Remove task from local storage
            removeTaskFromLocalStorage(taskValue);
        });
    };
}

function toggleTaskCompletion(checkbox, taskText, taskValue) {
    checkbox.addEventListener('change', function () {
        const isCompleted = checkbox.checked;
        if (isCompleted) {
            taskText.style.textDecoration = 'line-through'; // Mark as completed
        } else {
            taskText.style.textDecoration = 'none'; // Remove completion mark
        }

        // Update the completed state in local storage
        updateTaskCompletionInLocalStorage(taskValue, isCompleted);
    });
}

// Save a task to local storage
function saveTaskToLocalStorage(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Remove a task from local storage
function removeTaskFromLocalStorage(taskValue) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(t => t.text !== taskValue);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Update a task in local storage
function updateTaskInLocalStorage(oldTaskValue, newTask) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(t => t.text === oldTaskValue);
    if (taskIndex !== -1) {
        tasks[taskIndex] = newTask;
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Update the completed state of a task in local storage
function updateTaskCompletionInLocalStorage(taskValue, isCompleted) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(t => t.text === taskValue);
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = isCompleted;
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from local storage and display them
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const newTask = document.createElement('li');
        const taskText = document.createElement('span');
        taskText.textContent = task.text;

        const checkbox = document.createElement('input'); // Create a checkbox
        checkbox.type = 'checkbox';
        checkbox.className = 'completed-checkbox';
        checkbox.checked = task.completed; // Set the checkbox state based on local storage
        if (task.completed) {
            taskText.style.textDecoration = 'line-through'; // Mark as completed
        }

        newTask.appendChild(checkbox);
        newTask.appendChild(taskText);

        const taskList = document.getElementById("taskList");
        taskList.appendChild(newTask);

        editTask(newTask, taskText);
        deleteTask(newTask, task.text);
        toggleTaskCompletion(checkbox, taskText, task.text);
    });
}

// Add an event listener to the input field for the Enter key press
document.getElementById('inputTask').addEventListener('keyup', function (event) {
// Check if the pressed key is "Enter"
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('myButton').click();
    }
});

// Function to be called when the button is clicked
function myFunction() {
    addTask();
}

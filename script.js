document.addEventListener('DOMContentLoaded', function() {
    const timeDisplay = document.querySelector('.time');
    const taskList = document.querySelector('.task-list');
    const totalTasksCount = document.querySelector('.total-tasks');
    const remainingTasksCount = document.querySelector('.remaining-tasks');
    const completedTasksCount = document.querySelector('.completed-tasks');
    const addTaskBtn = document.querySelector('.add-task');
    const taskInput = document.querySelector('.task-input');

    function displayDateTime() {
        const now = new Date();
        const dateString = now.toLocaleDateString();
        const timeString = now.toLocaleTimeString();
        timeDisplay.textContent = `${dateString}  ${timeString}`;
    }

    displayDateTime();
    setInterval(displayDateTime, 1000);

    function updateTaskCounts() {
        const totalTasks = document.querySelectorAll('.task-item').length;
        totalTasksCount.textContent = totalTasks;

        const remainingTasks = document.querySelectorAll('.task-item:not(.completed)').length;
        remainingTasksCount.textContent = remainingTasks;

        const completedTasks = document.querySelectorAll('.task-item.completed').length;
        completedTasksCount.textContent = completedTasks;
    }

    function createTaskItem(taskName, completed = false) {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');
        if (completed) {
            taskItem.classList.add('completed');
        }

        const taskNameSpan = document.createElement('span');
        taskNameSpan.textContent = taskName;
        taskItem.appendChild(taskNameSpan);

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('task-buttons');

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('edit-button');
        editBtn.addEventListener('click', function() {
            const newTaskName = prompt('Hey, mind updating this task?', taskName);
            if (newTaskName !== null) {
                taskNameSpan.textContent = newTaskName;
                saveTasksToLocalStorage();
            }
        });

        const completeBtn = document.createElement('button');
        completeBtn.textContent = 'Done';
        completeBtn.classList.add('complete-button');
        completeBtn.addEventListener('click', function() {
            taskItem.classList.toggle('completed');
            updateTaskCounts();
            saveTasksToLocalStorage();
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Remove';
        deleteBtn.classList.add('delete-button');
        deleteBtn.addEventListener('click', function() {
            taskItem.remove();
            updateTaskCounts();
            saveTasksToLocalStorage();
        });

        buttonContainer.appendChild(editBtn);
        buttonContainer.appendChild(completeBtn);
        buttonContainer.appendChild(deleteBtn);

        taskItem.appendChild(buttonContainer);

        return taskItem;
    }

    function addTask() {
        const taskName = taskInput.value.trim();
        if (taskName) {
            const taskItem = createTaskItem(taskName);
            taskList.appendChild(taskItem);
            updateTaskCounts();
            saveTasksToLocalStorage();
            taskInput.value = '';
        }
    }

    addTaskBtn.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    function saveTasksToLocalStorage() {
        const tasks = [];
        document.querySelectorAll('.task-item').forEach(taskItem => {
            const taskName = taskItem.querySelector('span').textContent;
            const completed = taskItem.classList.contains('completed');
            tasks.push({ name: taskName, completed: completed });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const taskItem = createTaskItem(task.name, task.completed);
            taskList.appendChild(taskItem);
        });
        updateTaskCounts();
    }

    loadTasksFromLocalStorage();
});

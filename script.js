
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filter-btn'); 
const searchInput = document.getElementById('search-input');


let tasks = JSON.parse(localStorage.getItem('tasks')) || [];


function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function renderTasks(filter = 'all') {
    taskList.innerHTML = '';

    let filteredTasks = tasks.filter(task => {
        if (filter === 'completed') return task.completed;
        if (filter === 'pending') return !task.completed;
        return true; 
    });

    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.draggable = true;

        li.innerHTML = `
            <span class="task-text">${task.text}</span>
            <div class="task-actions">
                <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        
        li.querySelector('.complete-btn').addEventListener('click', () => toggleComplete(index));
        li.querySelector('.edit-btn').addEventListener('click', () => editTask(index));
        li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(index));

        taskList.appendChild(li);
    });
}


addTaskBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (text) {
        tasks.push({ text, completed: false }); 
        taskInput.value = ''; 
        saveTasks(); 
        renderTasks(); 
    }
});


function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed; 
    saveTasks();
    renderTasks();
}


function editTask(index) {
    const newText = prompt('Edit task:', tasks[index].text);
    if (newText !== null) {
        tasks[index].text = newText; 
        saveTasks();
        renderTasks();
    }
}


function deleteTask(index) {
    tasks.splice(index, 1); 
    saveTasks();
    renderTasks();
}


filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active'); 
        renderTasks(btn.dataset.filter); 
    });
});


searchInput.addEventListener('input', () => {
    const searchText = searchInput.value.toLowerCase();
    const taskItems = document.querySelectorAll('.task-item');

    taskItems.forEach(item => {
        const text = item.querySelector('.task-text').textContent.toLowerCase();
        item.style.display = text.includes(searchText) ? '' : 'none'; 
    });
});


renderTasks();

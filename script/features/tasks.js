//@ts-check

import { applyElement } from "../tools/dom.js";


/// INITIAL VARS:


/** @type {HTMLElement} */
const toggleTasksButton = document.getElementById('tasks');
/** @type {HTMLElement} */
const tasksMenu = document.querySelector('.menu');
/** @type {HTMLElement} */
const subMenu = document.querySelector('.sub_menu');
/** @type {HTMLElement} */
const deleteDoneTasks = document.querySelector('.delete_all');
/** @type {HTMLElement} */
const taskList = document.querySelector('.task_list');
/** @type {HTMLInputElement} */
const taskInput = taskList.querySelector('input');
const ul = taskList.querySelector('ul')



/** @type {Array<Task>} */
const tasks = getTasks();
tasks.forEach(appendTaskItem)

const tasksStore = new Proxy(tasks, { // (*)
    set(target, /** @type {string | `${number}`} */ prop, /** @type {Task|number} */ val) {
        target[prop] = val;
        if (Number.parseInt(prop) > -1 && typeof val === 'object') {
            // debugger
            appendTaskItem(val);
            saveTasks()
        }
        return true;
    }
});



/// EVENTS:



// taskInput.addEventListener('change', onPushTask)
taskInput.onkeydown = e => {
    if (e.key == 'Enter') {
        if (!taskInput.value) alert('Введите название задачи')
        else {
            onPushTask(e)
        }
    }
}

tasksMenu.onfocus = () => subMenu.style.visibility = 'visible';

tasksMenu.onblur = () => setTimeout(() => subMenu.style.visibility = 'hidden', 150)

toggleTasksButton.onclick = () => {

    if (!taskList.classList.contains('visible')) {
        taskList.classList.toggle('visible')
        setTimeout(() => { taskList.style.opacity = '.95' })
        setTimeout(() => taskInput.focus(), 50)
    } else {
        taskList.style.opacity = '0'
        setTimeout(() => taskList.classList.toggle('visible'))
    }
}

deleteDoneTasks.onclick = () => {
    const doneExists = tasks.filter(t => t.done).length;
    if (doneExists && confirm('Are sure you want delete all done tasks?')) {
        for (let i = tasks.length - 1; i >= 0; i--) {
            if (tasks[i] && tasks[i].done) {
                tasks[i].view.remove();
                delete tasks[i];
            }
        }
        saveTasks()
    }
}


/// FUNCTIONS:


/**
 * @param {Event} e
 */
function onPushTask(e) {
    tasksStore.push({
        title: taskInput.value,
        done: false
    });
    taskInput.value = ''
}

/**
 * @param {Task} [task]
 * @description appends task's ui html element
 */
function appendTaskItem(task) {
    const item = ul.appendChild(document.createElement('li'));

    const checkbox = applyElement(item, 'input', { type: 'checkbox', checked: task.done, });
    const title = applyElement(item, 'h4', { textContent: task.title, className: task.done ? 'done' : '' });
    const deleteButton = applyElement(item, 'div', { className: 'delete_task' });

    checkbox.onchange = (e) => {

        task.done = checkbox['checked'];

        localStorage.setItem('tasks', JSON.stringify(tasks.filter(Boolean)))

        title.classList.toggle('done')
        taskInput.focus()
    }

    task.view = item;

    deleteButton.onclick = () => {

        const index = tasks.indexOf(task);

        if (tasks[index].done || confirm('The task still is not done. Are you sure you want to remove it?')) {
            item.parentElement.removeChild(item);
            delete tasks[index];

            saveTasks()
            // console.log(tasks.length)
            // console.log(tasksStore.length)
            taskInput.focus()
        }
    }
}




/**
 * @description reads tasks from storage
 * @returns {Array<Task>}
 */
function getTasks() {
    const tasksString = localStorage.getItem('tasks');
    if (!tasksString) return []
    else {
        return JSON.parse(tasksString)
    }
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks.filter(Boolean)))
}
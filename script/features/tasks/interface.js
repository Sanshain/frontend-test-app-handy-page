//@ts-check

import { applyElement } from "../../tools/dom.js";
import { saveOpenState, saveTasks, tasks } from "./storage.js";




/** @type {HTMLElement} */
export const toggleTasksButton = document.getElementById('tasks');
/** @type {HTMLElement} */
export const tasksMenu = document.querySelector('.menu');
/** @type {HTMLElement} */
export const subMenu = document.querySelector('.sub_menu');
/** @type {HTMLElement} */
export const deleteDoneTasks = document.querySelector('.delete_all');
/** @type {HTMLElement} */
export const taskList = document.querySelector('.task_list');
/** @type {HTMLInputElement} */
export const taskInput = taskList.querySelector('input');
export const ul = taskList.querySelector('ul')



/**
 * @param {Task} [task]
 * @description appends task's ui html element
 */
export function appendTaskItem(task) {
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


tasksMenu.onfocus = () => subMenu.style.visibility = 'visible';

tasksMenu.onblur = () => setTimeout(() => subMenu.style.visibility = 'hidden', 150)

toggleTasksButton.onclick = () => {

    const isOpen = taskList.classList.contains('visible')
    
    if (!isOpen) openTasksList();
    else {
        taskList.style.opacity = '0'
        setTimeout(() => taskList.classList.toggle('visible'))
    }    
    
    saveOpenState(!isOpen);
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

export function openTasksList() {
    taskList.classList.toggle('visible');
    setTimeout(() => { taskList.style.opacity = '.95'; });
    setTimeout(() => taskInput.focus(), 50);
}

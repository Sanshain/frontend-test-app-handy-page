//@ts-check


import { appendTaskItem, openTasksList } from "./interface.js";
import { saveTasks, tasks } from "./storage.js";
import { taskInput } from "./interface.js";


/// INITIAL VARS:


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


if (+localStorage.getItem('tasks_open')) openTasksList()


/// EVENTS:

/** @type {HTMLFormElement} */
const form = document.querySelector('form')

// form.onsubmit = e => { onPushTask(e) ||  e.preventDefault() }

// taskInput.addEventListener('change', onPushTask)
taskInput.onkeydown = e => {
    if (e.key == 'Enter') {
        if (!taskInput.value) alert('Введите текст задачи')
        else {            
            onPushTask(e)
        }
    }
}


/// FUNCTIONS:


/**
 * @param {Event} e
 */
function onPushTask(e) {
    
    /**
     * @type {Omit<Task, 'done'> | any} 
     */    
    const taskData = Object.fromEntries([...new FormData(form).entries()])      // .reduce((acc, [k, v]) => { acc[k] = v; return acc }, {})
    const fullTaskData = {
        ...taskData,
        // title: taskInput.value,
        // title: new FormData(form).get('new_task').toString(),
        // title: form.elements['new_task'].value,
        done: false
    }

    tasksStore.push(new MyTask(fullTaskData));
    taskInput.value = ''
}



class MyTask{
    /**
     * @param {{title: string, done: boolean}} param
     */
    constructor({ title, done }) {
        debugger
        this.title = title;
        this.done = done;
    }

    /**
     * @type {HTMLElement}
     */
    view;
}


//@ts-check


import { appendTaskItem } from "./interface.js";
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







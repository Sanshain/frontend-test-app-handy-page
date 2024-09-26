//@ts-check

/** @type {Array<Task>} */
export const tasks = getTasks();

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

export function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks.filter(Boolean)))
}

/**
 * @param {boolean} isOpened
 */
export function saveOpenState(isOpened) {
    localStorage.setItem('tasks_open', (+isOpened).toString())
}
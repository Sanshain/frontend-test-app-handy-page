//@ts-check

import { setBackgroundFrom } from "./features/background.js";
import { tickTime } from "./features/timer.js";



/// timer


/** @type {HTMLElement} */
const toggleTasksButton = document.getElementById('tasks');
/** @type {HTMLElement} */
const tasksMenu = document.querySelector('.menu');
/** @type {HTMLElement} */
const subMenu = document.querySelector('.sub_menu');
/** @type {HTMLElement} */
const deleteDoneTasks = document.querySelector('.delete_all');
/**
 * @type {HTMLElement}
 */
const taskList = document.querySelector('.task_list');
/**
 * @type {HTMLInputElement}
 */
const taskInput = taskList.querySelector('input');


/**
 * @type {HTMLImageElement}
 */
const precipitationImage = document.querySelector('.precipitation');
const temperatureTitle = document.querySelector('.temperature');




/// sets images:
setBackgroundFrom(tickTime().getHours());


/// start timer:
setInterval(() => {
    const time = tickTime();

    const hours = time.getHours();
    const minutes = time.getMinutes();

    if (minutes === 0 && hours % 6 === 0) {
        setBackgroundFrom(hours);
    }

}, 1000)


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

/**
 * @typedef {{
 *  title: string,
 *  done: boolean
 *  view?: HTMLElement
 * }} Task
 * @type {Array<Task>}
 */
const tasks = getTasks();

/**
 * @param {Element} parent
 * @param {keyof HTMLElementTagNameMap} tagname
 * @param {Record<string, string | boolean>} attrs
 */
function applyElement(parent, tagname, attrs) {
    const elem = parent.appendChild(document.createElement(tagname));
    Object.keys(attrs).forEach(key => {
        elem[key] = attrs[key];     // elem.setAttribute(key, attrs[key])
    })
    return elem
}

const ul = taskList.querySelector('ul')

tasks.forEach(appendTaskItem)


// TODO patch
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



taskInput.addEventListener('change', function (e) {
    tasksStore.push({
        title: taskInput.value,
        done: false
    });
    taskInput.value = ''
})






/// location and weather

let currentCity = localStorage.getItem('city');

if (!currentCity) navigator.geolocation.getCurrentPosition(getCityAndWeather)
else {
    document.querySelector('.city__name').textContent = currentCity;
    const { lat, lon } = JSON.parse(localStorage.getItem('coordinates'));
    bringCurrentWeather(lat, lon);
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
 * @param {GeolocationPosition} position
 * @description get city and weather for it
 */
async function getCityAndWeather(position) {

    const { latitude: lat, longitude: lon } = position.coords;
    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=ru`);
    const { city } = await res.json();

    localStorage.setItem('city', city)
    localStorage.setItem('coordinates', JSON.stringify({ lat, lon }))

    document.querySelector('.city__name').textContent = city;

    await bringCurrentWeather(lat, lon);
}


/**
 * @param {number} lat
 * @param {number} lon
 * @description gets weather by position (fetches to https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=,)
 */
async function bringCurrentWeather(lat, lon) {

    const current = [
        "temperature_2m", "precipitation_probability", "precipitation",
        "rain", "showers", "snowfall", "snow_depth", "weather_code", "cloud_cover", "cloud_cover_low", "cloud_cover_mid", "cloud_cover_high"
    ];

    const queryLine = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=${current.join(',')}`; // console.log(queryLine)

    await fetch(queryLine).then(r => r.ok ? r.json() : { then: () => { } }).then((/**@type {Weather}*/ r) => {

        const { current } = r;

        /** @type {'cloudy'|'rain'|'snow'|'sun'}  */ let weatherIcon = 'sun';

        if (current.snowfall) weatherIcon = 'snow';
        else if (current.rain)
            weatherIcon = 'rain';
        else if (current.cloud_cover)
            weatherIcon = 'cloudy';

        globalThis['debug'] && console.log(current);

        precipitationImage.src = `/image/${weatherIcon}.png`;
        temperatureTitle.textContent = current.temperature_2m + '℃';
    });
}



tasksMenu.onfocus = () => subMenu.style.visibility = 'visible';

tasksMenu.onblur = () => setTimeout(() => subMenu.style.visibility = 'hidden', 500)

toggleTasksButton.onclick = () => {
    
    if (!taskList.classList.contains('visible')) {
        taskList.classList.toggle('visible')
        setTimeout(() => { taskList.style.opacity = '.95' })
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


/// done
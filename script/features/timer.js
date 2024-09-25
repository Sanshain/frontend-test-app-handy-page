//@ts-check


const timeElem = document.getElementById('time');
const dateElem = document.getElementById('date');

/**
 * @description gets and applies current time and date
 * @returns {Date}
 */
export function tickTime() {

    const time = new Date();

    timeElem.textContent = time.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    dateElem.textContent = time.toLocaleDateString('ru', { day: '2-digit', month: 'long' }) + ', ' + time.toLocaleDateString('ru', { weekday: 'long', })

    return time;
};

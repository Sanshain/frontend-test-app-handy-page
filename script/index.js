//@ts-check

import { setBackgroundFrom } from "./features/background.js";
import { tickTime } from "./features/timer.js";

import './features/weather/app.js'
import './features/tasks/index.js'



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
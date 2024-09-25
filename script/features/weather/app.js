//@ts-check

import { getCityAndWeather, bringCurrentWeather } from "./brings.js";


let currentCity = localStorage.getItem('city');

/// location and weather

if (!currentCity) navigator.geolocation.getCurrentPosition(getCityAndWeather)
else {
    document.querySelector('.city__name').textContent = currentCity;
    const { lat, lon } = JSON.parse(localStorage.getItem('coordinates'));
    bringCurrentWeather(lat, lon);
}














// function applyWeather({ temperature, weather }) {

//     precipitationImage.src = `/image/${weather}.png`;
//     temperatureTitle.textContent = temperature + '℃';
// }
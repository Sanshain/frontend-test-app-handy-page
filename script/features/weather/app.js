//@ts-check

import { getCity as bringCity, bringCurrentWeather } from "./brings.js";



/**
 * @type {HTMLImageElement}
 */
const precipitationImage = document.querySelector('.precipitation');
const temperatureTitle = document.querySelector('.temperature');


let currentCity = localStorage.getItem('city');

/// location and weather

if (!currentCity) navigator.geolocation.getCurrentPosition(async pos => {
    const city = await bringCity(pos);
    bringCurrentWeather(pos.coords.latitude, pos.coords.longitude, applyWeather);
})
else {
    document.querySelector('.city__name').textContent = currentCity;
    const { lat, lon } = JSON.parse(localStorage.getItem('coordinates'));
    bringCurrentWeather(lat, lon, applyWeather);
}


function applyWeather({ temperature, weather }) {

    precipitationImage.src = `/image/${weather}.png`;
    temperatureTitle.textContent = temperature + '℃';
}
//@ts-check


/**
 * @type {HTMLImageElement}
 */
const precipitationImage = document.querySelector('.precipitation');
const temperatureTitle = document.querySelector('.temperature');





/// location and weather

let currentCity = localStorage.getItem('city');

if (!currentCity) navigator.geolocation.getCurrentPosition(getCityAndWeather)
else {
    document.querySelector('.city__name').textContent = currentCity;
    const { lat, lon } = JSON.parse(localStorage.getItem('coordinates'));
    bringCurrentWeather(lat, lon);
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


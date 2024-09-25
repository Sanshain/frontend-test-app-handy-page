type Weather = {
    current: {
        cloud_cover: number,
        rain: number,
        snowfall: number,
        temperature_2m: number
    }
}


interface Storage{
    getItem(key: 'city' |'coordinates'): string     // overrided just for this simple test project (don't repeat! :) )
}
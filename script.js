const content = document.querySelector('#content');
const today = document.querySelector('#today');
const city = document.querySelector('#city-name');
const cityTemp = document.querySelector('#city-temp');
const cityStats = document.querySelector('#city-stats');
const humidity = document.querySelector('#humidity');
const minmaxDiv = document.querySelector('#min-max');
const min = document.querySelector('#min');
const max = document.querySelector('#max');
const forecast = document.querySelector('#forecast');

let defaultLocation = 'london';
let celcius = false;
let currentCity;

const form = document.querySelector('#search-form');
let input = document.querySelector('#search');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (input.value.length == 0) {
        badInput();
    }
    else {
        getWeather(input.value);
    }
});

const switcher = document.querySelector('#switch');
switcher.addEventListener('click', changeTemp);


async function getWeather (location) {
    try {
        //Weather
        const response = await fetch ('http://api.openweathermap.org/data/2.5/weather?q=' + location + '&APPID=2955ee6369013246c6d4ce74fcff09e1');
        //Forecast
        //const response = await fetch ('http://api.openweathermap.org/data/2.5/forecast?q=' + defaultLocation + '&appid=2955ee6369013246c6d4ce74fcff09e1')
        //console.log(response);
        //console.log(response.status);
        if (response.ok) {
            const weatherData = await response.json();
            console.log(weatherData);
            let city = City(weatherData);
            currentCity = city;
            updateWeather(city);
        }
        else {
            badInput();
        }
        
    } catch (error) {
        //console.log(error);
    }
    
}

const City = (data) => {
    let name = data.name;
    let country = data.sys.country;
    let tempC = Math.round(data.main.temp - 273.15);
    let tempCMax = Math.round(data.main.temp_max - 273.15);
    let tempCMin = Math.round(data.main.temp_min - 273.15);
    let tempF = Math.round(tempC * 1.8 + 32);
    let tempFMax = Math.round(tempCMax * 1.8 + 32);
    let tempFMin = Math.round(tempCMin * 1.8 + 32);
    let humidity = data.main.humidity + '%';
    let weather = data.weather[0].main;
    let weatherIcon = getWeatherIcon(data.weather[0].id)
    let weatherDescription = data.weather[0].description;
    let sunrise = convertTime(data.sys.sunrise, data.timezone);
    let sunset = convertTime(data.sys.sunset, data.timezone);
    return {
        name,
        country,
        tempC,
        tempCMax,
        tempCMin,
        tempF,
        tempFMax,
        tempFMin,
        humidity,
        weather,
        weatherIcon,
        weatherDescription,
        sunrise,
        sunset,
    }
}

function updateWeather (newCity) {
    city.textContent = newCity.name;

    displayTemp();

    console.log(humidity);
    humidity.textContent = 'Humidity: ' + newCity.humidity;

    console.log(newCity.weather);
    console.log(newCity.weatherDescription);
    console.log(newCity.sunrise);
}



function badInput () {
    //Do stuff
}

function convertTime(unixTime, offset){
    let dt = new Date((unixTime + offset) * 1000)
    let h = dt.getHours()
    let m = "0" + dt.getMinutes()
    let t = h + ":" + m.substr(-2)
    return t
}

function displayTemp () {

    if (celcius) {
        cityTemp.textContent = currentCity.tempC + '°';
        min.textContent = 'Low: ' + currentCity.tempCMin + '°';
        max.textContent = 'High: ' + currentCity.tempCMax + '°';
    }
    else {
        cityTemp.textContent = currentCity.tempF + '°';
        min.textContent = 'Low: ' + currentCity.tempFMin + '°';
        max.textContent = 'High: ' + currentCity.tempFMax + '°';
    }
}

function changeTemp () {
    celcius = !celcius;
    displayTemp();
}

function getWeatherIcon (id) {
    if (id >= 200 && id <= 232) {
        return 'http://openweathermap.org/img/wn/11d@2x.png'
    }
    else if (id >= 300 && id <= 321) {
        return 'http://openweathermap.org/img/wn/09d@2x.png'
    }
    else if (id >= 500 && id <= 504) {
        return 'http://openweathermap.org/img/wn/10d@2x.png'
    }
    else if (id == 511) {
        return 'http://openweathermap.org/img/wn/13d@2x.png'
    }
    else if (id >= 520 && id <= 531) {
        return 'http://openweathermap.org/img/wn/09d@2x.png'
    }
    else if (id >= 600 && id <= 622) {
        return 'http://openweathermap.org/img/wn/13d@2x.png'
    }
    else if (id >= 701 && id <= 781) {
        return 'http://openweathermap.org/img/wn/50d@2x.png'
    }
    else if (id == 800) {
        return 'http://openweathermap.org/img/wn/01d@2x.png'
    }
    else if (id == 801) {
        return 'http://openweathermap.org/img/wn/02d@2x.png'
    }
    else if (id == 802) {
        return 'http://openweathermap.org/img/wn/03d@2x.png'
    }
    else if (id == 803) {
        return 'http://openweathermap.org/img/wn/04d@2x.png'
    }
    else if (id == 804) {
        return 'http://openweathermap.org/img/wn/04d@2x.png'
    }
}

getWeather(defaultLocation);
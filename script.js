const content = document.querySelector('#content');
const today = document.querySelector('#today');
const city = document.querySelector('#city');
const cityName = document.querySelector('#city-name');
const cityTemp = document.querySelector('#city-temp');
const cityStats = document.querySelector('#city-stats');
const humidity = document.querySelector('#humidity');
const minmaxDiv = document.querySelector('#min-max');
const min = document.querySelector('#min');
const max = document.querySelector('#max');
const description = document.querySelector('#description');
const forecast = document.querySelector('#forecast');
const search = document.querySelector('#search');

let defaultLocation = 'london';
let celcius = false;
let currentCity;
let currentBG;

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
cityTemp.addEventListener('click', changeTemp);


async function getWeather (location) {
    try {
        //Weather
        const response = await fetch ('http://api.openweathermap.org/data/2.5/weather?q=' + location + '&APPID=2955ee6369013246c6d4ce74fcff09e1', {mode: 'cors'});
        //Forecast
        //const response = await fetch ('http://api.openweathermap.org/data/2.5/forecast?q=' + defaultLocation + '&appid=2955ee6369013246c6d4ce74fcff09e1')
        //console.log(response);
        //console.log(response.status);
        if (response.status === 400) {
            badInput();
        }
        else {
            const weatherData = await response.json();
            console.log(weatherData);
            let newCity = City(weatherData);
            currentCity = newCity;
            updateWeather(newCity);
        }
        
    } catch (error) {
        console.log(error);
        badInput();
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
    let weather = data.weather[0].id;
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
        weatherDescription,
        sunrise,
        sunset,
    }
}

function updateWeather (newCity) {
    cityName.textContent = newCity.name;
    displayTemp();
    changeBG(newCity.weather);
    console.log(currentBG);
    today.style.backgroundImage = currentBG;
    today.style.backgroundSize = 'cover';

    humidity.textContent = 'Humidity: ' + newCity.humidity;
    description.textContent = newCity.weatherDescription;
}



function badInput () {
    cityName.style.color = 'pink';
    setTimeout(function(){ cityName.style.color = 'white'; }, 200);
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
        cityTemp.textContent = currentCity.tempC + '°C';
        min.textContent = 'Low: ' + currentCity.tempCMin + '°C';
        max.textContent = 'High: ' + currentCity.tempCMax + '°C';
    }
    else {
        cityTemp.textContent = currentCity.tempF + '°F';
        min.textContent = 'Low: ' + currentCity.tempFMin + '°F';
        max.textContent = 'High: ' + currentCity.tempFMax + '°F';
    }
}

function changeTemp () {
    celcius = !celcius;
    displayTemp();
}


function changeBG (id) {
    console.log(id);
    if (id >= 200 && id <= 232) {
        currentBG = "url('./weather_imgs/thunderstorm.jpg')"
    }
    else if (id >= 300 && id <= 321) {
        currentBG = "url('./weather_imgs/shower-rain.jpg')";
    }
    else if (id >= 500 && id <= 504) {
        currentBG = "url('./weather_imgs/rain.jpg')";
    }
    else if (id == 511) {
        currentBG = "url('./weather_imgs/snow.jpg')";
    }
    else if (id >= 520 && id <= 531) {
        currentBG = "url('./weather_imgs/shower-rain.jpg')";
    }
    else if (id >= 600 && id <= 622) {
        currentBG = "url('./weather_imgs/snow.jpg')";
    }
    else if (id >= 701 && id <= 781) {
        currentBG = "url('./weather_imgs/mist.jpg')";
    }
    else if (id == 800) {
        currentBG = "url('./weather_imgs/clear-sky.jpg')";
    }
    else if (id == 801) {
        currentBG = "url('./weather_imgs/few-clouds.jpg')";
    }
    else if (id == 802) {
        currentBG = "url('./weather_imgs/scattered-clouds.jpg')";
    }
    else if (id == 803) {
        currentBG = "url('./weather_imgs/broken-clouds.jpg')";
    }
    else if (id == 804) {
        currentBG = "url('./weather_imgs/broken-clouds.jpg')";
    }
}

getWeather(defaultLocation);
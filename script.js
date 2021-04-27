
const base_url = 'https://api.openweathermap.org/data/2.5'
const appid = 'eb0385eb8fe609e5f22d13c74cb1898a';

const cityNameEl = document.getElementById('cityName');
const projectFormEl = document.getElementById('project-form');
const currentCityEl = document.getElementById('currentCity');
const currentTempEl = document.getElementById('currentTemperature');
const currentWindEl = document.getElementById('currentWind');
const currentHumidityEl = document.getElementById('currentHumidity');
const currentUVIndexEl = document.getElementById('currentUVIndex');
const weatherIconEl = document.getElementById('weatherIcon');

function displayCityWeather({ cityName, windSpeed, temperature, humidity }) {
  console.log(`displayCityWeather("${cityName}", "${windSpeed}", "${temperature}", "${humidity}")`);
  currentCityEl.innerText = cityName;
  currentWindEl.innerText = "Wind: " + windSpeed + " mph";
  currentTempEl.innerText = "Temp: " + temperature;
  currentHumidityEl.innerText = "Humidity: " + humidity;
}

function displayUvIndex(uvIndex) {
  currentUVIndexEl.innerText = "UV Index: " + uvIndex;
}

function displayWeatherIcon(icon) {
  console.log(`displayWeatherIcon("${icon}")`);
  const requestURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  console.log('displayWeatherIcon()', requestURL);
  weatherIconEl.setAttribute('src', requestURL);
}

const getUvIndex = function({ lat, lon }) {
  const requestUrl = `${base_url}/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&units=imperial&appid=${appid}`;
  console.log('getUvIndex() requestUrl:', requestUrl);
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log('1) data:\n', data);
      console.log('2) data:\n', JSON.stringify(data, null, 2));
      displayUvIndex(data.current.uvi);
    })
}

const getCityWeather = function (cityName) {
  const requestUrl = `${base_url}/weather?q=${cityName}&units=imperial&appid=${appid}`;
  console.log('getCityWeather() requestUrl:', requestUrl);
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log('1. data:\n', data);
      console.log('2. data:\n', JSON.stringify(data, null, 2));
      displayCityWeather({
        cityName: data.name,
        windSpeed: data.wind.speed,
        temperature: data.main.temp,
        humidity: data.main.humidity,
      });
      getUvIndex({
        lat: data.coord.lat,
        lon: data.coord.lon,
      });
      displayWeatherIcon(
        data.weather[0].icon,
      );
    });
}

const formSubmitHandler = function(event) {
  console.log('formSubmitHandler()');
  event.preventDefault();
  const cityName = cityNameEl.value.trim();
  console.log('cityName:', cityName);
  if (cityName) {
    getCityWeather(cityName);
  }
}

// TODO: Print retrieved information to assigned fields

// TODO: Print 5 day forecast in the allotted cards

projectFormEl.addEventListener('submit', formSubmitHandler);
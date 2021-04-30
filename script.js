
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
const currentDateEl = document.getElementById('currentDate');

const forecastDateEls = document.querySelectorAll('.forecastDate');
const weatherIconEls = document.querySelectorAll('.weatherIcon');
const temperatureForecastEls = document.querySelectorAll('.temperatureForecast');
const windForecastEls = document.querySelectorAll('.windForecast');
const humidityForecastEls = document.querySelectorAll('.humidityForecast');

function displayCityWeather({ cityName, currentDate, windSpeed, temperature, humidity }) {
  console.log(`displayCityWeather("${cityName}", "${currentDate}", "${windSpeed}", "${temperature}", "${humidity}")`);
  currentCityEl.innerText = cityName;
  currentDateEl.innerText = currentDate;
  currentWindEl.innerText = "Wind: " + windSpeed + " mph";
  currentTempEl.innerText = "Temp: " + temperature;
  currentHumidityEl.innerText = "Humidity: " + humidity;
}

function displayUvIndex(uvIndex) {
  currentUVIndexEl.innerText = "UV Index: " + uvIndex;
}

function displayWeatherIcon(el, icon) {
  console.log(`displayWeatherIcon(el, "${icon}")`);
  const requestURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  console.log('displayWeatherIcon()', requestURL);
  el.setAttribute('src', requestURL);
}

function displayFiveDayForecast(days) {
  console.log('displayFiveDayForcast() called with:', days);
  for (let i = 0; i < days.length; i++) {
    forecastDateEls[i].innerText = new Date(days[i].dt * 1000).toLocaleDateString();
    displayWeatherIcon(weatherIconEls[i], days[i].weather[0].icon);
    temperatureForecastEls[i].innerText = `Temp: ${days[i].main.temp}`;
    windForecastEls[i].innerText = `Wind: ${days[i].wind.speed} mph`;
    humidityForecastEls[i].innerText = `Humidity: ${days[i].main.humidity}`;
  }
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
        // For some reason this api returns dt as seconds since Epoch
        // so I need to multiply it by 1000 to work with Javascript Date() ...
        currentDate: new Date(data.dt * 1000).toLocaleDateString(),
        windSpeed: data.wind.speed,
        temperature: data.main.temp,
        humidity: data.main.humidity,
      });
      displayWeatherIcon(
        weatherIconEl,
        data.weather[0].icon,
      );
      getUvIndex({
        lat: data.coord.lat,
        lon: data.coord.lon,
      });
    });
}



const getFiveDayForecast = function (cityName) {
  const requestURL = `${base_url}/forecast?q=${cityName}&units=imperial&appid=${appid}`;
  console.log('getFiveDayForecast() requestURL:', requestURL);
  fetch(requestURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log('3. data:\n', data);
      console.log('4. data:\n', JSON.stringify(data, null, 2));
      displayFiveDayForecast(data.list);
    });
}

const formSubmitHandler = function(event) {
  console.log('formSubmitHandler()');
  event.preventDefault();
  const cityName = cityNameEl.value.trim();
  console.log('cityName:', cityName);
  if (cityName) {
    getCityWeather(cityName);
    getFiveDayForecast(cityName);
  }
}

// TODO: Print 5 day forecast in the allotted cards

projectFormEl.addEventListener('submit', formSubmitHandler);
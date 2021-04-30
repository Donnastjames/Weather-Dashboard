
const max_cities_stored_count = 4; // TODO: Change back to 8 later
const base_url = 'https://api.openweathermap.org/data/2.5'
const appid = 'eb0385eb8fe609e5f22d13c74cb1898a';

var oldestCityIndex = localStorage.getItem('oldestCityIndex');
if (oldestCityIndex === null) {
  oldestCityIndex = 0;
} else {
  // Make sure oldestCityIndex is treated like an integer!
  oldestCityIndex = Number.parseInt(oldestCityIndex);
}

console.log('oldestCityIndex:', oldestCityIndex);

var storedCities = new Array(max_cities_stored_count).fill('');

// Determine the cities that might already be in localStorage ...
for (let i = 0; i < max_cities_stored_count; i++) {
  const storedCity = localStorage.getItem(`cityName-${i}`);
  if (storedCity) {
    storedCities[i] = storedCity;
  } else {
    // If nothing is stored at `cityName-${i}` nothing more to get ...
    break;
  }
}

console.log('storedCities:', JSON.stringify(storedCities));

function nextCityIndex(index) {
  return (index + 1) % max_cities_stored_count;
}

function previousCityIndex(index) {
  return (max_cities_stored_count + index - 1) % max_cities_stored_count;
}

function displaySavedCityButtons() {
  // TODO: Display the buttons based on the contents of the storedCities[] array ...
  console.log('We will display buttons like this ...');
  let buttonIndex = 0;

  for (let i = previousCityIndex(oldestCityIndex);
     buttonIndex < max_cities_stored_count;
     i = previousCityIndex(i)) {

    if (storedCities[i]) {
      console.log(`${buttonIndex}. "${storedCities[i]}"`);
      buttonIndex++;
    } else {
      // If nothing is stored at storedCities[i] nothing more to show ...
      break;
    }
  }

  console.log('This many buttons:', buttonIndex);
}

// Just call displaySavedCityButtons() from the start, to show it all right away ...
displaySavedCityButtons();

function storeSavedCity(city) {
  storedCities[oldestCityIndex] = city;
  localStorage.setItem(`cityName-${oldestCityIndex}`, city);
  oldestCityIndex = nextCityIndex(oldestCityIndex);
  localStorage.setItem('oldestCityIndex', oldestCityIndex);
  console.log('oldestCityIndex:', oldestCityIndex);
  console.log('storedCities:', JSON.stringify(storedCities));
  displaySavedCityButtons();
}

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
  // Taking days[1], [2] ... [5], skipping zero which is the current day ...
  for (let i = 0; i < Math.min(forecastDateEls.length, days.length - 1); i++) {
    forecastDateEls[i].innerText = new Date(days[i + 1].dt * 1000).toDateString();
    displayWeatherIcon(weatherIconEls[i], days[i + 1].weather[0].icon);
    temperatureForecastEls[i].innerText = `Temp: ${days[i + 1].temp.day}`;
    windForecastEls[i].innerText = `Wind: ${days[i + 1].wind_speed} mph`;
    humidityForecastEls[i].innerText = `Humidity: ${days[i + 1].humidity}`;
  }
}

const getUvIndex = function({ lat, lon }) {
  const requestUrl = `${base_url}/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${appid}`;
  console.log('getUvIndex() requestUrl:', requestUrl);
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log('1) data:\n', data);
      console.log('2) data:\n', JSON.stringify(data, null, 2));
      displayUvIndex(data.current.uvi);
      displayFiveDayForecast(data.daily);
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
        currentDate: new Date(data.dt * 1000).toDateString(),
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


function displayLastCitySearch() {
  var lastCitySearch = localStorage.getItem(`cityName${i}`);

  lastCitySearchEl = document.getElementById('cityName', `${i}`);
  var btn = document.createElement('button');
  var buttonTextNode = document.createTextNode(lastCitySearch);
  btn.appendChild(buttonTextNode);
  lastCitySearchEl.appendChild(btn);

  if (lastCitySearch) {
    lastCitySearch.textContent = `${cityName}`;
  } else {
    lastCitySearch.textContent = '';
  }

}


const formSubmitHandler = function(event) {
  console.log('formSubmitHandler()');
  event.preventDefault();
  const cityName = cityNameEl.value.trim();
  console.log('cityName:', cityName);
  if (cityName) {
    storeSavedCity(cityName);
    getCityWeather(cityName);
  }
}

projectFormEl.addEventListener('submit', formSubmitHandler);
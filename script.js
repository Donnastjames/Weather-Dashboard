
const max_cities_stored_count = 8;
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

// https://www.javascripttutorial.net/dom/manipulating/remove-all-child-nodes/
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

function displaySavedCityButtons() {
  // Display the buttons based on the contents of the storedCities[] array ...
  console.log('We will display buttons like this ...');
  const savedCitiesContainerEl = document.getElementById('savedCitiesContainer');
  removeAllChildNodes(savedCitiesContainerEl);

  let buttonIndex = 0;

  for (let i = previousCityIndex(oldestCityIndex);
     buttonIndex < max_cities_stored_count;
     i = previousCityIndex(i)) {
    
    if (storedCities[i]) {
      console.log(`${buttonIndex}. "${storedCities[i]}"`);
      const cityButton = document.createElement('button');
      cityButton.setAttribute('type', 'button');
      cityButton.setAttribute('class', 'btn btn-secondary btn-lg btn-block');
      const buttonTextNode = document.createTextNode(storedCities[i]);
      cityButton.appendChild(buttonTextNode);
      cityButton.addEventListener('click', function() {
        getCityWeather(storedCities[i]);
      });
      savedCitiesContainerEl.appendChild(cityButton);
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
  if (storedCities.includes(city)) {
    console.log(`The city "${city}" is already stored!`);
    return;
  }
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
  currentDateEl.innerText = `(${currentDate})`;
  currentWindEl.innerText = "Wind: " + windSpeed + " mph";
  currentTempEl.innerText = "Temp: " + Math.round(temperature) + "\xB0F";
  currentHumidityEl.innerText = "Humidity: " + humidity;
}

function displayUvIndex(uvIndex) {
  let colorClassName;
  if (uvIndex <= 2) {
    colorClassName = "low"; 
  } else if (uvIndex <= 5) {
    colorClassName = "moderate";
  } else if (uvIndex <= 8) {
    colorClassName = "high";
  } else if (uvIndex <= 10) {
    colorClassName = "veryHigh";
  } else {
    colorClassName = "extreme";
  }

  currentUVIndexEl.className = `btn ${colorClassName}`;
  currentUVIndexEl.innerText = uvIndex;
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
    temperatureForecastEls[i].innerText = `Temp: ${Math.round(days[i + 1].temp.day)} \xB0F`;
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
    });
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
      // Because data.name came back from the fetch(), assume data.name is capitalized properly ...
      storeSavedCity(data.name);
    })
    .catch(function(error) {
      alert(`The city "${cityName}" was not found.`);
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

projectFormEl.addEventListener('submit', formSubmitHandler);

const appid = 'eb0385eb8fe609e5f22d13c74cb1898a';

const cityNameEl = document.getElementById('cityName');
const projectFormEl = document.getElementById('project-form');

const getCityWeather = function (cityName) {
  const requestUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${appid}`;
  console.log('requestUrl:', requestUrl);
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log('data:\n', data);
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
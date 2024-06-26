import 'bootstrap';
import Chart from 'chart.js/auto';
import { format, fromUnixTime, setDate } from 'date-fns';
import apiKeys from './apiKey';
import { mapWeatherIcon } from './mapWeatherIcon';

const apiKey = apiKeys.openWeather;
const gApi = apiKeys.google;

let deviceLocationMethod = false;

let locationError = document.getElementById("location-error");
let deviceLocation = document.getElementById("device-location");
let navbar = document.getElementById("navbar");
let change = document.getElementById("change");
let getlocation = document.getElementById("welcome")
let weatherShow = document.getElementById("weather")
let hoursContainer = document.getElementById("hourly");
let hoursRainContainer = document.getElementById("hourlyRain");
let daysContainer = document.getElementById("daily");
let graph = document.getElementById("mychart");
let locationName = document.getElementById("locationName");
let wind = document.getElementById("wind");

let x = window.matchMedia("(min-width: 768px)");
const searchWindowListener = function() {
  searchWindow(x);
};

const userLanguage = navigator.language || navigator.userLanguage;
const dateFormatter = new Intl.DateTimeFormat(userLanguage, { weekday: 'long' });
const dateFormatterShort = new Intl.DateTimeFormat(userLanguage, { weekday: 'short' });

checkStoredLocation();

//search window behavior
function searchWindow(x){
  if (x.matches) {
    document.body.style.height = '100%';
    document.documentElement.style.height = '100%';
  }else{
    document.body.style.height = 'auto';
    document.documentElement.style.height = 'auto';
  }
};

function start() {
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        console.log(`Twoja lokalizacja: ${latitude}, ${longitude}`);
        deviceLocationMethod = true;
        saveMethodToStorage('location');
        znazwy(`${latitude}, ${longitude}`);
      },
      function (error) {
        console.error(`Błąd pobierania lokalizacji: ${error.message}`);
        locationError.textContent = 'Udostępnij swoją lokalizację aby skorzystać z tej opcji';
      }
    );
  } else {
    console.error("Twoja przeglądarka nie obsługuje geolokalizacji.");
  }
}

// local storage
function saveLocationToStorage(location, method) {
  localStorage.setItem('lastLocation', JSON.stringify(location));
}
function saveMethodToStorage(method) {
  localStorage.setItem('method', JSON.stringify(method));
}

function getLastLocationFromStorage() {
  const lastLocation = localStorage.getItem('lastLocation');
  return lastLocation ? JSON.parse(lastLocation) : null;
}
function getMethod() {
  const method = localStorage.getItem('method');
  return method ? JSON.parse(method) : null;
}
function checkStoredLocation() {
  const storedLocation = getLastLocationFromStorage();
  const storedMethod = getMethod();
  if (storedMethod == 'location'){
    deviceLocationMethod = true;
  }
  if (storedLocation && deviceLocationMethod) {
    document.getElementById("loading").style.display = "block";
    start();
  }else if (storedLocation){
    drawWeather(storedLocation);
  }else {
      navbar.classList.remove('hide');
      getlocation.classList.remove('hide');
  }
}

async function getCityCoordinates(cityName) {
  const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${cityName}&key=${gApi}`);
  const city = await response.json();
  let address;
  address = city.results[0].formatted_address;
  //searching for correct format of addres
  if(deviceLocationMethod){
    city.results.forEach(result => {
      if (result.types[0] === 'locality' && result.types[1] === 'political') {
        address = result.formatted_address;
        return;
      }
    });
  }
    console.log(city);
    const lat = city.results[0].geometry.location.lat;
    const lon = city.results[0].geometry.location.lng;
   
    return {lat, lon, address};
}

async function getWeatherData(city) {
  
    const coordinates = await getCityCoordinates(city);
    console.log(coordinates);
    const response = await fetch (`https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric&lang=pl`);
    const data = await response.json();
    console.log(data);
    return data;
  }
async function getAirQuality(city) {
  const coordinates = await getCityCoordinates(city);
  const responseAir = await fetch (`https://api.openweathermap.org/data/2.5/air_pollution?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}`);
  const dataAir = await responseAir.json();
  console.log(dataAir);
  return dataAir;
}

change.addEventListener('click', function() {
  weatherShow.classList.add('hide');
  getlocation.classList.remove('hide');
  change.classList.add('hide');
  localStorage.removeItem('lastLocation');
  localStorage.removeItem('method');
  deviceLocationMethod = false;
  locationError.textContent = '';
  document.body.style.height = '100%';
  document.documentElement.style.height = '100%';
  
  x.removeEventListener("change", searchWindowListener);

})

async function drawWeather(city) {

  let currentTemp = document.getElementById("currentTemp")
  let currMax = document.getElementById("currMax");
  let currMin = document.getElementById("currMin");
  let currFeels = document.getElementById("currFeels");
  let currDate = document.getElementById("currDate");
  let currImg = document.getElementById("currImg");

  document.getElementById("loading").style.display = "none";
  weatherShow.classList.remove('hide');
  getlocation.classList.add('hide');
  change.classList.remove('hide');
  navbar.classList.remove('hide');

  if (graph.chart) {
    graph.chart.destroy();
  }
  hoursContainer.innerHTML = '';
  hoursRainContainer.innerHTML = '';
  daysContainer.innerHTML = '';

  
  searchWindow(x);
  x.addEventListener("change", searchWindowListener)
  
  //taking weather data
  const weatherData = await getWeatherData(city);
  const address = await getCityCoordinates(city);
  const airQuality = await getAirQuality(city);
  //Today and now
  const date = fromUnixTime(weatherData.current.dt);
  const dayOfWeek = dateFormatter.format(date);
  const hour = format(date, 'HH:mm')
  console.log(`Dzień tygodnia: ${dayOfWeek} ${hour}`);
  let degrees = (weatherData.current.temp).toFixed(0);
  if(degrees == '-0'){
    degrees = '0'
  };
  locationName.innerHTML = address.address + ' ';
  currentTemp.innerHTML = degrees + '°';
  currDate.innerHTML = dayOfWeek + ', ' + hour;
  currMax.innerHTML = (weatherData.daily[0].temp.max).toFixed(0) + '°/';
  currMin.innerHTML = (weatherData.daily[0].temp.min).toFixed(0) + '°';
  currFeels.innerHTML = 'Odczuwalna ' + (weatherData.daily[0].temp.min).toFixed(0) + '°';


  //Current weather icon
  const currIconCode = weatherData.current.weather[0].icon;
  const iconClass = mapWeatherIcon(currIconCode);
  currImg.innerHTML = '<i class="' + iconClass +  '"></i>';

  //Select all hourly entries
  const allHourEntries = weatherData.hourly;

  // preparing arrays for hourly forecast
  const hoursLabels = [];
  const temperaturesCelsius = [];
  const pop = [];
  const weatherIconCode = [];

  for (let i=0; i<25; i++){
      const entry = allHourEntries[i];
      const date = fromUnixTime(entry.dt);
      const hourLabel = format(date, 'HH:mm');
      let temperature = (entry.temp).toFixed(0);
      if(temperature == '-0'){
        temperature = '0'
      };
      hoursLabels.push(hourLabel);
      temperaturesCelsius.push(temperature);
      
      if(entry.rain){
        pop.push((entry.rain['1h']).toFixed(1));
        pop[0] = (parseFloat(entry.rain['1h']).toFixed(1) + "mm");
      }else{
        pop.push('-')
      };
      
      weatherIconCode.push(entry.weather[0].icon);
  }
  
  //hourly forecast's hours and images
  for (let i = 0; i < temperaturesCelsius.length; i++){
    const iconClass = mapWeatherIcon(weatherIconCode[i]);
    let html = `<div class="col" id="towide">
    <div class="row" id="towideContent">
    <div class="col col-12">${hoursLabels[i]}</div>
    <div class="col col-12"><i class="iconSize bi ${iconClass}"></i></div>
    </div>`;
    hoursContainer.innerHTML += html; 
  }
  //temparatue chart
  graph.chart = new Chart(graph, {
    type: 'line',
    data: {
      labels: hoursLabels,
      datasets: [{
        label: "Temperature",
        data: temperaturesCelsius,
        borderWidth: 1,
        borderColor: 'white',
        pointBackgroundColor: 'white',
        lineTension: 0.4,
      }]
    },
    options: {
      
      plugins: {
        legend: {
          display: false,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'category',
          labels: temperaturesCelsius.map(temp => temp + '°'),
          ticks: {
            color: 'white',
            font:{
              size: 20,
            }
          },
          grid: {                
            color: '',
          },
          position: 'top',
        },
        y: {
            display: false
        }
      },
    }
  });
    //probability of precipitation
  for (let i = 0; i < temperaturesCelsius.length; i++){
    let html = `<div class="col" id="towide ">
    <div class="row" id="towideContent">
    <div class="col col-12 d-flex flex-column"><i class="bi bi-droplet text-info"></i>${pop[i]}</div>
    </div>`;
    hoursRainContainer.innerHTML += html; 
  }

  //daily forecast
  const dailyDayOfWeek = [];
  const dailyDayOfWeekShort = [];
  const dailyIconCode = [];
  
  for (let i = 0; i < 8; i++){
    const date = fromUnixTime(weatherData.daily[i].dt);
    dailyDayOfWeek.push(dateFormatter.format(date));
    dailyDayOfWeek[0]= 'Dzisiaj';
    dailyDayOfWeekShort.push(dateFormatterShort.format(date));
    dailyDayOfWeekShort[0]= 'Dziś';
    const dayIconCode = weatherData.daily[i].weather[0].icon;
    
    const iconClass = mapWeatherIcon(dayIconCode);
    console.log(iconClass);
    dailyIconCode.push(iconClass);

    let maxTemp = (weatherData.daily[i].temp.max).toFixed(0)
    let minTemp = (weatherData.daily[i].temp.min).toFixed(0)
    if (maxTemp == '-0'){
      maxTemp = '0'
    };
    if (minTemp == '-0'){
      minTemp = '0'
    };
    if(weatherData.daily[i].rain){
      
    }else{
      weatherData.daily[i].rain = '-'
    };
    
    
    let html = `
    
      <div class="row d-flex align-items-center d-flex flex-column flex-md-row mx-0 daycontainer">
        <div class="col-4 d-none d-md-flex align-items-start">
            <p class="my-1 ps-1 text-truncate">${dailyDayOfWeek[i]}</p>              
        </div>
        <div class="col-3 d-flex d-md-none align-items-start justify-content-center">
            <p class="my-1 ps-0">${dailyDayOfWeekShort[i]}</p>              
        </div>
        
        <div class="col-3 d-none  d-md-flex justify-content-center">
          <p class="my-1 d-flex"><i class="bi bi-droplet text-info"></i>${weatherData.daily[i].rain}</p>
        </div>
        <div class="col-3  d-flex justify-content-center">
          <h1 class="pt-1 ${dailyIconCode[i]}"></h1>
        </div>
        
        <div class="col-2  d-flex justify-content-center"><span class="text-nowrap pe-1">${maxTemp}°/${minTemp}°</span></div>
        <div class="col-3 d-flex d-md-none justify-content-center">
          <p class="my-1"><i class="bi bi-droplet text-info"></i>${weatherData.daily[i].rain}</p>
        </div>
      </div>
    `;
    daysContainer.innerHTML += html;
  };

  let sunrise = document.getElementById("sunrise");
  let sunset = document.getElementById("sunset");
  let humidity = document.getElementById("humidity");
  let pressure = document.getElementById("pressure");


  const timeOffset = weatherData.timezone_offset - 7200;

  const formatWithOffset = (timestamp) => {
    const utcDate = fromUnixTime(timestamp);
    return new Date(utcDate.getTime() + timeOffset * 1000);
  };

  const sunriseData = formatWithOffset(weatherData.current.sunrise);
  console.log(timeOffset);
  console.log(weatherData.current.sunrise);
  console.log(sunriseData);
  const sunriseHour = format(sunriseData, 'HH:mm');
  sunrise.innerHTML = sunriseHour;

  const sunsetData = formatWithOffset(weatherData.current.sunset);
  const sunsetHour = format(sunsetData, 'HH:mm');
  sunset.innerHTML = sunsetHour;

  humidity.innerHTML = weatherData.current.humidity + '%';
  pressure.innerHTML = weatherData.current.pressure + ' hPa'
  wind.innerHTML = (weatherData.current.wind_speed).toFixed(0) + ' km/h'

  const apiValueAir = airQuality.list[0].main.aqi; 
  
  const apiValueUv = (weatherData.current.uvi + 1).toFixed(0); 
  
  const progressDotAir = document.getElementById('myProgressDotAir');
  const progressDotUv = document.getElementById('myProgressDotUv');
  const biEmojis = [
    '<i class="bi bi-emoji-laughing-fill"></i>',
    '<i class="bi bi-emoji-smile-fill"></i>',
    '<i class="bi bi-emoji-neutral-fill"></i>',
    '<i class="bi bi-emoji-frown-fill"></i>',
    '<i class="bi bi-emoji-dizzy-fill"></i>'
  ];

  let airQualityIndex = document.getElementById("airQualityIndex");
  let airQualityDesc = document.getElementById("airQualityDesc")
  let uvIndex = document.getElementById("uvIndex");
  let uvIndexDesc = document.getElementById("uvIndexDesc");  
  
  const dotPositionAir = (apiValueAir - 1) * 20;
  progressDotAir.style.left = dotPositionAir + '%';
  const airQualityDescription = ['Dobra', 'Przeciętna', 'Umiarkowana', 'Zła', 'Bardzo zła'];
  const colorClass = ['rgb(0, 255, 0)', 'rgb(150, 255, 0)', 'yellow', 'orange', 'red', 'rgb(200,0,255)']
  airQualityIndex.innerHTML = apiValueAir;
  airQualityDesc.innerHTML = airQualityDescription[apiValueAir - 1];
  airQualityDesc.style.color = colorClass[apiValueAir - 1];
  progressDotAir.innerHTML = biEmojis[apiValueAir - 1];
  
  let uvIndexDescription;
  let uvColor;
  let uvEmoji;

  if (apiValueUv <= 2){
    uvIndexDescription = "Niski";
    uvColor = colorClass[0];
    uvEmoji = biEmojis[0];
  }else if (apiValueUv <=5){
    uvIndexDescription = "Średni"
    uvColor = colorClass[2];
    uvEmoji = biEmojis[1];
  }else if (apiValueUv <=7){
    uvIndexDescription = "Wysoki"
    uvColor = colorClass[3];
    uvEmoji = biEmojis[2];
  }else if (apiValueUv <=10){
    uvIndexDescription = "Bardzo Wysoki"
    uvColor = colorClass[4];
    uvEmoji = biEmojis[3];
  }else {
    uvIndexDescription = "Ekstremalny"
    uvColor = colorClass[5];
    uvEmoji = biEmojis[4];
  };

  const dotPositionUv = ((apiValueUv - 1) / 11) * 100;
  progressDotUv.style.left = dotPositionUv + '%';
  uvIndex.innerHTML = apiValueUv;
  uvIndexDesc.innerHTML = uvIndexDescription;
  uvIndexDesc.style.color = uvColor;
  progressDotUv.innerHTML = uvEmoji;
  
};


// search autocomplete
const inputField = document.getElementById('search-input');
const suggestionsContainer = document.getElementById('suggestions');


function fetchSuggestions() {
  const inputValue = inputField.value;

  fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${inputValue}&key=${gApi}`)
      .then(response => response.json())
      .then(data => {
          suggestionsContainer.innerHTML = '';
          const suggestions = data.results;
          if (suggestions.length > 0) {
              suggestions.forEach((suggestion, index) => {
                  console.log(suggestion.formatted_address)
                  const suggestionItem = document.createElement('li');
                  suggestionItem.classList.add('dropdown-item');
                  suggestionItem.textContent = suggestion.formatted_address;
                  suggestionItem.addEventListener('click', function() {
                      inputField.value = suggestion.formatted_address;
                      suggestionsContainer.style.display = 'none';
                      znazwy(inputField.value);
                  });
                  suggestionsContainer.appendChild(suggestionItem);

                  if (index === 0) {
                      suggestionItem.classList.add('selected');
                  }
              });
              suggestionsContainer.style.display = 'block';
          } else {
              suggestionsContainer.style.display = 'none';
          }
      })
      .catch(error => {
          console.error('Błąd podczas pobierania sugestii miejsc:', error);
      });
}

inputField.addEventListener('input', fetchSuggestions);
inputField.addEventListener('click', fetchSuggestions);

inputField.addEventListener('keydown', function(event) {
  const suggestions = suggestionsContainer.querySelectorAll('.dropdown-item');
  const selectedIndex = Array.from(suggestions).findIndex(item => item.classList.contains('selected'));

  if (event.key === 'ArrowUp' && selectedIndex > 0) {
      event.preventDefault(); // Zapobiegnij domyślnemu działaniu, gdy kursor jest na początku listy
      suggestions[selectedIndex].classList.remove('selected');
      suggestions[selectedIndex - 1].classList.add('selected');
  } else if (event.key === 'ArrowDown' && selectedIndex < suggestions.length - 1) {
      event.preventDefault(); // Zapobiegnij domyślnemu działaniu, gdy kursor jest na końcu listy
      if (selectedIndex !== -1) {
          suggestions[selectedIndex].classList.remove('selected');
      }
      suggestions[selectedIndex + 1].classList.add('selected');
  } else if (event.key === 'Enter') {
      const selectedSuggestion = suggestionsContainer.querySelector('.selected');
      if (selectedSuggestion) {
          inputField.value = selectedSuggestion.textContent;
          suggestionsContainer.style.display = 'none';
          znazwy(inputField.value);
      }
  }
});
function hideSuggestions() {
  suggestionsContainer.style.display = 'none';
}


document.addEventListener('click', function(event) {
  if (!suggestionsContainer.contains(event.target) && event.target !== inputField) {
      hideSuggestions();
  }
});

inputField.addEventListener('click', function(event) {
  suggestionsContainer.style.display = 'block';
  event.stopPropagation();
});

const searchButton = document.getElementById('search-button');

deviceLocation.addEventListener('click', function(){
  document.getElementById("loading").style.display = "block";
  start()
})

searchButton.addEventListener('click', function() {
  znazwy(inputField.value);
});


function znazwy(value){
  
  drawWeather(value);
  saveLocationToStorage(value);
  
}

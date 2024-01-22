import 'bootstrap';
import img from '../Icons/clouds_sun_sunny_icon.svg';
import Chart from 'chart.js/auto';
import { format, fromUnixTime } from 'date-fns';

let hoursContainer = document.getElementById("hourly");
let hoursRainContainer = document.getElementById("hourlyRain");
let daysContainer = document.getElementById("daily");
let graph = document.getElementById("mychart");
let currentTemp = document.getElementById("currentTemp")
let currMax = document.getElementById("currMax");
let currMin = document.getElementById("currMin");
let currFeels = document.getElementById("currFeels");
let currDate = document.getElementById("currDate");
let currImg = document.getElementById("currImg");
const userLanguage = navigator.language || navigator.userLanguage;
const dateFormatter = new Intl.DateTimeFormat(userLanguage, { weekday: 'short' });


function mapWeatherIcon(iconCode) {
  const iconMapping = {
    '01d': 'bi-sun',         // Bezchmurne niebo (dzień)
    '01n': 'bi-moon',        // Bezchmurne niebo (noc)
    '02d': 'bi-cloud-sun',   // Niewielkie zachmurzenie (dzień)
    '02n': 'bi-cloud-moon',  // Niewielkie zachmurzenie (noc)
    '03d': 'bi-cloud',       // Częściowe zachmurzenie (dzień)
    '03n': 'bi-cloud',       // Częściowe zachmurzenie (noc)
    '04d': 'bi-cloudy',      // Zachmurzenie (dzień)
    '04n': 'bi-cloudy',      // Zachmurzenie (noc)
    '09d': 'bi-cloud-drizzle', // Deszcz (dzień)
    '09n': 'bi-cloud-drizzle', // Deszcz (noc)
    '10d': 'bi-cloud-rain',  // Deszcz (intensywny, dzień)
    '10n': 'bi-cloud-rain',  // Deszcz (intensywny, noc)
    '11d': 'bi-cloud-lightning', // Burza (dzień)
    '11n': 'bi-cloud-lightning', // Burza (noc)
    '13d': 'bi-snow',        // Opady śniegu (dzień)
    '13n': 'bi-snow',        // Opady śniegu (noc)
    '50d': 'bi-fog',         // Mgła (dzień)
    '50n': 'bi-fog',         // Mgła (noc)
  };
  const iconClass = iconMapping[iconCode];

  return iconClass || 'bi-question';
}
const apiKey = '5a43b5303a0107f4cf1ced3ef800b104';

async function getCityCoordinates(cityName) {
  const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`);
  const city = await response.json();
  return { lat: city[0].lat, lon: city[0].lon };
}

async function getWeatherData(city) {
    const coordinates = await getCityCoordinates(city);
    const response = await fetch (`https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric&lang=pl`);
    const data = await response.json();
    console.log(data);
    return data;
  }
  
async function drawWeatherChart(city) {
  //taking weather data
  const weatherData = await getWeatherData(city);

  //Today and now
  const date = fromUnixTime(weatherData.current.dt);
  const dayOfWeek = dateFormatter.format(date);
  const hour = format(date, 'HH:mm')
  console.log(`Dzień tygodnia: ${dayOfWeek} ${hour}`);
  let degrees = (weatherData.current.temp).toFixed(0);

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
      pop.push((entry.pop * 100).toFixed(0));
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
  new Chart(graph, {
    type: 'line',
    data: {
      labels: hoursLabels,
      datasets: [{
        label: "Temperature",
        data: temperaturesCelsius,
        borderWidth: 1,
        lineTension: 0.3,
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
    <div class="col col-12"><i class="bi bi-droplet text-info"></i>${pop[i]}%</div>
    </div>`;
    hoursRainContainer.innerHTML += html; 
  }

  //daily forecast
  const dailyDayOfWeek = [];
  const dailyIconCode = [];
  
  for (let i = 0; i < 7; i++){
    const date = fromUnixTime(weatherData.daily[i].dt);
    dailyDayOfWeek.push(dateFormatter.format(date));
    dailyDayOfWeek[0]= 'Dzisiaj';
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
    let html = `
    
      <div class="row d-flex align-items-center d-flex flex-column flex-md-row mx-0 daycontainer">
        <div class="col-3 d-flex justify-content-center">
            <p class="my-1">${dailyDayOfWeek[i]}</p>              
        </div>
        <div class="col-12 col-md-6">
          <div class="row">
            <div class="d-flex align-items-center justify-content-evenly">
              <h1 class="pt-1 ${dailyIconCode[i]}"></h1>                                   
              <p class="my-1 d-md-flex d-none">${weatherData.daily[i].weather[0].main}</p>
            </div>
          </div>           
        </div>
        <div class="col-3  d-flex justify-content-center"><span class="text-nowrap">${maxTemp}°/${minTemp}°</span></div>
      </div>
    `;
    daysContainer.innerHTML += html;
  }
}

drawWeatherChart('orzesze');
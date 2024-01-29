import 'bootstrap';
import img from '../Icons/clouds_sun_sunny_icon.svg';
import Chart from 'chart.js/auto';
import { format, fromUnixTime, setDate } from 'date-fns';
import compromise from 'compromise';
import apiKeys from './apiKey';

const apiKey = apiKeys.openWeather;
const gApi = apiKeys.google;

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
let locationName = document.getElementById("locationName");
let sunrise = document.getElementById("sunrise");
let sundown = document.getElementById("sundown");
let humidity = document.getElementById("humidity");
let pressure = document.getElementById("pressure");
let wind = document.getElementById("wind");
let airQualityIndex = document.getElementById("airQualityIndex");
let airQualityDesc = document.getElementById("airQualityDesc")
let uvIndex = document.getElementById("uvIndex");
let uvIndexDesc = document.getElementById("uvIndexDesc");


const userLanguage = navigator.language || navigator.userLanguage;
const dateFormatter = new Intl.DateTimeFormat(userLanguage, { weekday: 'long' });
const dateFormatterShort = new Intl.DateTimeFormat(userLanguage, { weekday: 'short' });


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






async function getCityCoordinates(cityName) {
  const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${cityName}&key=${gApi}`);
  const city = await response.json();
  console.log(city);
  const lat = city.results[0].geometry.location.lat;
  const lon = city.results[0].geometry.location.lng;
  const address = city.results[0].formatted_address;
  return {lat, lon, address};
}


async function getWeatherData(city) {
    const coordinates = await getCityCoordinates(city);
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
async function drawWeatherChart(city) {
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
    <div class="col col-12 d-flex flex-column"><i class="bi bi-droplet text-info"></i>${pop[i]}</div>
    </div>`;
    hoursRainContainer.innerHTML += html; 
  }

  //daily forecast
  const dailyDayOfWeek = [];
  const dailyDayOfWeekShort = [];
  const dailyIconCode = [];
  
  for (let i = 0; i < 7; i++){
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
    }
    const mm = ["mm"];
    if(mm[i]){

    }else{
      mm[i]=""
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
          <p class="my-1 d-flex"><i class="bi bi-droplet text-info"></i>${weatherData.daily[i].rain}${mm[i]}</p>
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
  }
  const sunriseData = fromUnixTime(weatherData.current.sunrise);  
  const sunriseHour = format(sunriseData, 'HH:mm');
  sunrise.innerHTML = sunriseHour;

  const sunsetData = fromUnixTime(weatherData.current.sunset);  
  const sunsetHour = format(sunsetData, 'HH:mm');
  sunset.innerHTML = sunsetHour;

  humidity.innerHTML = weatherData.current.humidity + '%';
  pressure.innerHTML = weatherData.current.pressure + ' hPa'
  wind.innerHTML = (weatherData.current.wind_speed).toFixed(0) + ' km/h'

  
  const apiValueAir = airQuality.list[0].main.aqi; 
  
 
  const apiValueUv = (weatherData.current.uvi + 1).toFixed(0); 
  
  
  const progressDotAir = document.getElementById('myProgressDotAir');
  const progressDotUv = document.getElementById('myProgressDotUv');
  
  const dotPositionAir = (apiValueAir - 1) * 20;
  progressDotAir.style.left = dotPositionAir + '%';
  const airQualityDescription = ['Dobra', 'Przeciętna', 'Umiarkowana', 'Zła', 'Bardzo zła'];
  const colorClass = ['rgb(0, 255, 0)', 'rgb(150, 255, 0)', 'yellow', 'orange', 'red', 'rgb(200,0,255)']
  airQualityIndex.innerHTML = apiValueAir;
  airQualityDesc.innerHTML = airQualityDescription[apiValueAir - 1];
  airQualityDesc.style.color = colorClass[apiValueAir - 1];
  
  let uvIndexDescription;
  let uvColor;

  if (apiValueUv <= 2){
    uvIndexDescription = "Niski";
    uvColor = colorClass[0];
  }else if (apiValueUv <=5){
    uvIndexDescription = "Średni"
    uvColor = colorClass[2];
  }else if (apiValueUv <=7){
    uvIndexDescription = "Wysoki"
    uvColor = colorClass[3];
  }else if (apiValueUv <=10){
    uvIndexDescription = "Bardzo Wysoki"
    uvColor = colorClass[4];
  }else {
    uvIndexDescription = "Ekstremalny"
    uvColor = colorClass[5];
  };

  const dotPositionUv = ((apiValueUv - 1) / 11) * 100;
  progressDotUv.style.left = dotPositionUv + '%';
  uvIndex.innerHTML = apiValueUv;
  uvIndexDesc.innerHTML = uvIndexDescription;
  uvIndexDesc.style.color = uvColor;
}

drawWeatherChart('polska');
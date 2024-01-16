//template Strings:
// var zmienna = "Dynamiczny tekst";
// var html = `<p>${zmienna}</p>`;
// document.getElementById("mojElement").innerHTML = html;

//Petla for:
// for (let i = 0; i < 5; i++) {
//     console.log(i);
//   }

import 'bootstrap';
import img from '../Icons/clouds_sun_sunny_icon.svg';
import Chart from 'chart.js/auto';
import { format, fromUnixTime } from 'date-fns';

let hoursContainer = document.getElementById("hourly");
let hoursRainContainer = document.getElementById("hourlyRain");
let daysContainer = document.getElementById("daily");
let zmienna = "Dynamiczny tekst";
let graph = document.getElementById("mychart");
let currentTemp = document.getElementById("currentTemp")
let currMax = document.getElementById("currMax");
let currMin = document.getElementById("currMin");
let currFeels = document.getElementById("currFeels");
let currDate = document.getElementById("currDate");


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

async function getWeatherData(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    console.log(data);
    return data;
  }
async function getCurrentWeather(city) {
    const currentResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const currentData = await currentResponse.json();
    console.log(currentData);
    return currentData;
} 
  
  async function drawWeatherChart(city) {
    // Pobierz dane pogodowe
    const weatherData = await getWeatherData(city);
    const currentWeatherData = await getCurrentWeather(city);

    
    const date = fromUnixTime(currentWeatherData.dt);


    const dayOfWeek = format(date, 'EEE');
    const hour = format(date, 'HH:mm')
    console.log(`Dzień tygodnia: ${dayOfWeek} ${hour}`);

    let degrees = (currentWeatherData.main.temp).toFixed(0);
    
    currentTemp.innerHTML = degrees + '°';
    
    currDate.innerHTML = dayOfWeek + '., ' + hour;

    // Wyciągnij wszystkie punkty danych z prognozą pogody
    const allEntries = weatherData.list;
  
    // Przygotuj etykiety dla osi X, pokazujące godziny
    const hoursLabels = [];
    const temperaturesCelsius = [];
    const snow = [];
    const weatherIconCode = [];
  
    for (let i=0; i<9; i++){
        const entry = allEntries[i];
        const entryTime = new Date(entry.dt_txt);
        const hourLabel = entryTime.getHours().toString() + ':00';
        let temperature = (entry.main.temp).toFixed(0);
        if(temperature == '-0'){
          temperature = '0';
        }
        // const maxtemp = Math.max(...temperature);
        // console.log(`Największa wartość: ${maxtemp}`);
        hoursLabels.push(hourLabel);
        temperaturesCelsius.push(temperature);
        snow.push(entry.pop * 100);
        weatherIconCode.push(entry.weather[0].icon);
        
    }
  
    for (let i = 0; i < temperaturesCelsius.length; i++){
      const iconClass = mapWeatherIcon(weatherIconCode[i]);

      
      let html = `<div class="col" id="towide">
  <div class="row" id="towideContent">
      <div class="col col-12">${hoursLabels[i]}</div>
      <div class="col col-12"></div>
      <div class="col col-12"><i class="iconSize bi ${iconClass}"></i></div>
      
  </div>`;
  hoursContainer.innerHTML += html; 
  }

    new Chart(graph, {
        type: 'line',
        data: {
          labels: hoursLabels,
          datasets: [{
            label: "Temperature",
            data: temperaturesCelsius,
            borderWidth: 1,
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
      for (let i = 0; i < temperaturesCelsius.length; i++){
        let html = `<div class="col" id="towide ">
      <div class="row" id="towideContent">
        <div class="col col-12"><i class="bi bi-droplet text-info"></i>${snow[i]}%</div>
      </div>`;
      hoursRainContainer.innerHTML += html; 
      }
    
      

  for (let i = 0; i < 6; i++){
      let html = `<div type="button" class="btn btn-outline-primary text-white p-0 dayimgparent">
      <div class="row border d-flex align-items-center d-flex flex-column flex-md-row mx-0 daycontainer">
          <div class="col-3 d-flex justify-content-center">
              <p class="my-1">Mon</p>
              
          </div>
          <div class="col-12 col-md-6">
              <div class="row">
                  <div class="d-flex align-items-center justify-content-center suncontainer">
                      <img src="${img}" class="dayimg">
                  
                  
                      <p class="mb-1 d-md-flex d-none">sunny</p>
                  </div>
              </div>
            
          </div>
          <div class="col-3  d-flex justify-content-center">32deg</div>
      </div>
      </div>`;
  daysContainer.innerHTML += html;
  }
}
// Wywołaj funkcję z aktualnym miastem
drawWeatherChart('orzesze');
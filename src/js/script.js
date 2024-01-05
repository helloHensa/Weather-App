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


let hoursContainer = document.getElementById("piesek");
let daysContainer = document.getElementById("kotek");
let zmienna = "Dynamiczny tekst";
let graph = document.getElementById("mychart");



for (let i = 0; i < 23; i++){
    let html = `<div class="col border border-primary" id="towide">
<div class="row" id="towideContent">
    <div class="col col-12">${i+1}:00</div>
    <div class="col col-12"><img src="${img}" alt="" class="w-75"></div>
    <div class="col col-12">-2deg</div>
    <div class="col col-12">40%</div>
</div>`;
hoursContainer.innerHTML += html; 
}


async function getWeatherData(city) {
    const apiKey = '5a43b5303a0107f4cf1ced3ef800b104';
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`);
    const data = await response.json();
    console.log(data);
    return data;
  }
  
  async function drawWeatherChart(city) {
    // Pobierz dane pogodowe
    const weatherData = await getWeatherData(city);
  
    // Wyciągnij wszystkie punkty danych z prognozą pogody
    const allEntries = weatherData.list;
  
    // Pobierz aktualny czas
    const now = new Date().getTime();
  
    // Znajdź najbliższą godzinę od teraz
    const currentHourIndex = allEntries.findIndex(entry => (new Date(entry.dt_txt).getTime() - now) >= 0);
  
    // Wybierz 24 punkty danych od najbliższej godziny
    const next24HoursEntries = allEntries.slice(currentHourIndex, currentHourIndex + 24);
  
    // Przygotuj etykiety dla osi X, pokazujące godziny
    const hoursLabels = [];
    const temperaturesCelsius = [];
  
    // Przekształć temperatury z Kelwinów na stopnie Celsiusa
    next24HoursEntries.forEach(entry => {
      const entryTime = new Date(entry.dt_txt);
      const hourLabel = entryTime.getHours().toString().padStart(2, '0') + ':00';
  
      hoursLabels.push(hourLabel);
      temperaturesCelsius.push(entry.main.temp - 273.15);
    });
  
   

  
    
    new Chart(graph, {
        type: 'line',
        data: {
          labels: hoursLabels,
          datasets: [{
            label: 'Temperature',
            data: temperaturesCelsius,
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              
              position: 'bottom',
              ticks: {
                stepSize: 1,
                maxTicksLimit: 24
              }
            },
            y: {
              beginAtZero: true
            }
          }
        }
      });
  }
  
  // Wywołaj funkcję z aktualnym miastem
  drawWeatherChart('orzesze');




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
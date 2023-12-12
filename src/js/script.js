//template Strings:
// var zmienna = "Dynamiczny tekst";
// var html = `<p>${zmienna}</p>`;
// document.getElementById("mojElement").innerHTML = html;

//Petla for:
// for (let i = 0; i < 5; i++) {
//     console.log(i);
//   }

let hoursContainer = document.getElementById("piesek");
let daysContainer = document.getElementById("kotek");
let zmienna = "Dynamiczny tekst";




for (let i = 0; i < 23; i++){
    let html = `<div class="col border border-primary" >
<div class="row">
    <div class="col col-12">${i+1}:00</div>
    <div class="col col-12">40%</div>
    <div class="col col-12"><img src="Icons/clouds_sun_sunny_icon.svg" alt="" class="w-75"></div>
    <div class="col col-12">-2deg</div>
</div>`;
hoursContainer.innerHTML += html; 
}

for (let i = 0; i < 6; i++){
    let html = `<div type="button" class="btn btn-outline-primary text-white p-0 dayimgparent">
    <div class="row border d-flex align-items-center d-flex flex-column flex-md-row mx-0">
        <div class="col-3 d-flex justify-content-center">
            <p class="my-1">Mon</p>
            
        </div>
        <div class="col-6 col-md-6">
            <div class="row">
                <div class="d-flex align-items-center justify-content-center">
                    <img src="Icons/clouds_sun_sunny_icon.svg" class="dayimg">
                
                
                    <p class="mb-1 d-md-flex d-none">sunny</p>
                </div>
            </div>
           
        </div>
        <div class="col-3  d-flex justify-content-center">32deg</div>
    </div>
    </div>`;
daysContainer.innerHTML += html;
}
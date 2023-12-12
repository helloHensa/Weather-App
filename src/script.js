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
    let html = `<button type="button" class="btn btn-outline-primary text-white p-0  h-100">
    <div class="row border d-flex align-items-center flex-column flex-lg-row mx-0 h-100">
        <div class="col-3 d-flex justify-content-center">
            <p class="my-1">Mon</p>
            
        </div>
        <div class="col-12 col-lg-6 ">
            <div class="row">
                <div class="col-12 col-lg-6 d-flex align-items-center ">
                    <img src="Icons/clouds_sun_sunny_icon.svg" class="">
                </div>
                <div class="col-6 align-items-center d-none d-lg-flex">
                    <p class="my-1 ">sunny</p>
                </div>
            </div>
           
        </div>
        <div class="col-3  d-flex justify-content-center">32deg</div>
    </div>
    </button>`;
daysContainer.innerHTML += html;
}
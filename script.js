//template Strings:
// var zmienna = "Dynamiczny tekst";
// var html = `<p>${zmienna}</p>`;
// document.getElementById("mojElement").innerHTML = html;

//Petla for:
// for (let i = 0; i < 5; i++) {
//     console.log(i);
//   }

let hoursContainer = document.getElementById("piesek");

let zmienna = "Dynamiczny tekst";




for (let i = 0; i < 23; i++){
    let html = `<div class="col border border-primary " >
<div class="row">
    <div class="col col-12">${i+1}:00</div>
    <div class="col col-12">40%</div>
    <div class="col col-12"><img src="icons/clouds_sun_sunny_icon.svg" alt="" class="w-100"></div>
    <div class="col col-12">-2deg</div>
</div>`;
hoursContainer.innerHTML += html;
}
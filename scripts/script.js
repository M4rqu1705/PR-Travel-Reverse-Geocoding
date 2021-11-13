let output = document.getElementById("output");
let error_output = document.getElementById("error");

function run(location) {
  const latitude = location.coords.latitude;
  const longitude = location.coords.longitude;
  const accuracy = location.coords.accuracy;

  output.innerText = latitude;
  output.innerText += ", " + longitude;
  // output.innerText += " (" + accuracy + ")\n";

  fetch("https://nominatim.openstreetmap.org/reverse?format=json&lat=18.4030875&lon=-65.9637902&zoom=18&addressdetails=1")
    .then(res => res.json())
    .then((geocoded) => {
      const city = geocoded.address.city;
      const city_district = geocoded.address.city_district;
      const country = geocoded.address.country;
      const country_code = geocoded.address.city_district;
      const county = geocoded.address.county;
      const neighbourhood = geocoded.address.neighbourhood;
      const postcode = geocoded.address.postcode;
      const road = geocoded.address.road;
      const display_name = geocoded.display_name;

      output.innerText += municipality + ", " + city;

    }).catch(err => {
      error_output = "Error: " + err.message;
    })
}

function main() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(run, (err) => {
      error_output.textContent = "Error: " + err.message;
      console.error(err);
    }, { enableHighAccuracy: true });
  } else {
    error_output.textContent = "Error: Geolocation is not supported by this browser.";
  }
}

window.addEventListener("load", () => {
  main();
  // setInterval(main, 60000);
});
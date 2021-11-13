let output = document.getElementById("output");
let error_output = document.getElementById("error");

function run(location) {
  const latitude = location.coords.latitude;
  const longitude = location.coords.longitude;
  const accuracy = location.coords.accuracy;

  output.innerText = latitude;
  output.innerText += ", " + longitude;
  output.innerText += "(" + accuracy + ")\n";

  let reverseGeocoder = new BDCReverseGeocode();

  reverseGeocoder.getClientLocation({
    latitude: -latitude,
    longitude: longitude,
  }, function (result) {
    output.innerText += result.locality;
  });




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
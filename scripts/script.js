var output = document.getElementById("output");

function run(location) {
  const latitude = location.coords.latitude;
  const longitude = location.coords.longitude;

  console.log(latitude);
  console.log(longitude);
  console.log(location.coords.accuracy);

  let reverseGeocoder = new BDCReverseGeocode();

  reverseGeocoder.getClientLocation({
    latitude: -latitude,
    longitude: longitude,
  }, function (result) {
    output.innerText = result.locality;
  });




}

function main() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(run, (err) => {
      console.error(err);
    }, { enableHighAccuracy: true });
  } else {
    document.getElementsByTagName("body")[0].innerHTML = "Geolocation is not supported by this browser.";
  }
}

window.addEventListener("load", () => {
  main();
  // setInterval(main, 60000);
});
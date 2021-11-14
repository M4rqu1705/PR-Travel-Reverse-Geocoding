const coordinates = document.getElementById("coordinates");
const summary = document.getElementById("summary");
const display_name = document.getElementById("display-name");
const error_output = document.getElementById("error");
const theme_image = document.querySelector("#theme > img");

// Receives current theme and updates CSS variables accordingly.
function setTheme(theme) {
  const r = document.querySelector(':root');

  if (theme === 'light') {
    r.style.setProperty('--foreground-color', '#2c2c2c');
    r.style.setProperty('--background-color', 'whitesmoke');
    theme_image.src = "./assets/change-theme-icon-dark.png";

  } else {
    r.style.setProperty('--foreground-color', 'whitesmoke');
    r.style.setProperty('--background-color', '#2c2c2c');
    theme_image.src = "./assets/change-theme-icon-light.png";
  }
}

// Changes theme from dark to light or vice-versa.
function toggleTheme() {
  // Retrieve current theme
  let theme = localStorage.getItem("light-theme");

  // Toggle it
  if (theme === 'dark') theme = 'light';
  else theme = 'dark';

  // Store it
  localStorage.setItem("light-theme", theme);

  // Update theme
  setTheme(theme);
}


// Receive location and update screen accordingly
function run(location) {
  const latitude = location.coords.latitude;
  const longitude = location.coords.longitude;
  const accuracy = location.coords.accuracy;

  coordinates.innerText = latitude + ", " + longitude;

  const url = "https://nominatim.openstreetmap.org/reverse?format=json&lat=" + latitude + "&lon=" + longitude + "&zoom=18&addressdetails=1";
  fetch(url)
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
      // const display_name = geocoded.display_name;

      summary.innerText = county + ", " + city;
      display_name.innerText = geocoded.display_name;

    }).catch(err => {
      error_output.innerText = "Error: " + err;
    })
}

// 
function main() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(run, (err) => {
      error_output.textContent = "Error: " + err.message;
      console.error(err);
    }, { enableHighAccuracy: true });
  } else {
    error_output.textContent = "Error: Geolocation is not supported by this browser.";
  }
}

window.addEventListener("load", () => {
  if (!localStorage.getItem("light-theme"))
    localStorage.setItem("light-theme", 'dark');

  setTheme();
  main();
  setInterval(main, 30000);
});
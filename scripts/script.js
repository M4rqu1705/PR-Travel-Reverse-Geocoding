const coordinates_div = document.getElementById("coordinates");
const summary_div = document.getElementById("summary");
const display_name_div = document.getElementById("display-name");
const error_div = document.getElementById("error");
const theme_img = document.querySelector("#theme-toggler > img");
const fullscreen_img = document.querySelector("#fullscreen-toggler > img");

// Theme enum
const theme = {
  LIGHT: "light",
  DARK: "dark",
}

// Receives current theme and updates CSS variables and images accordingly.
function setTheme(stored_theme) {
  const r = document.querySelector(':root');

  if (stored_theme === theme.LIGHT) {
    r.style.setProperty('--foreground-color', '#2c2c2c');
    r.style.setProperty('--background-color', 'whitesmoke');
    theme_img.src = "./assets/icon/change-theme-dark.png";

    if (!!document.fullscreenElement)
      fullscreen_img.src = "./assets/icon/set-minimize-dark.png";
    else
      fullscreen_img.src = "./assets/icon/set-fullscreen-dark.png";

  } else if (stored_theme === theme.DARK) {
    r.style.setProperty('--foreground-color', 'whitesmoke');
    r.style.setProperty('--background-color', '#2c2c2c');
    theme_img.src = "./assets/icon/change-theme-light.png";

    if (!!document.fullscreenElement)
      fullscreen_img.src = "./assets/icon/set-minimize-light.png";
    else
      fullscreen_img.src = "./assets/icon/set-fullscreen-light.png";
  }
}

// Changes theme from dark to light or vice-versa.
function toggleTheme() {
  // Retrieve current theme
  let stored_theme = localStorage.getItem("theme");

  // Toggle it
  if (stored_theme === theme.LIGHT)
    stored_theme = theme.DARK;
  else if (stored_theme === theme.DARK)
    stored_theme = theme.LIGHT;

  // Store it
  localStorage.setItem("theme", stored_theme);

  // Update theme
  setTheme(stored_theme);
}

// Set the screen to fullscreen or not based on the boolean value of target.
function setFullscreen(target) {
  if (target === true) {
    document.body.requestFullscreen().then(() =>
      setTheme(localStorage.getItem("theme"))
    );
  } else {
    document.exitFullscreen().then(() =>
      setTheme(localStorage.getItem("theme"))
    );
  }
}

// Set to fullscreen or minimize accordingly.
function toggleFullscreen() {
  setFullscreen(!document.fullscreenElement);
}

// Receive location and update screen accordingly
function run(location) {
  const latitude = location.coords.latitude;
  const longitude = location.coords.longitude;
  // const accuracy = location.coords.accuracy;

  coordinates_div.innerText = latitude + ", " + longitude;

  const url = "https://nominatim.openstreetmap.org/reverse?format=json&lat=" + latitude + "&lon=" + longitude + "&zoom=18&addressdetails=1";
  fetch(url)
    .then(res => res.json())
    .then((geocoded) => {
      const city = geocoded.address.city;
      const county = geocoded.address.county;
      const display_name = geocoded.display_name;

      summary_div.innerText = county + ", " + city;
      display_name_div.innerText = display_name;

    }).catch(err => {
      error_div.innerText = "Error: " + err;
    })
}

// Starts cycle of retrieving location and running the `run` function
function main() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(run, (err) => {
      error_div.textContent = "Error: " + err.message;
      console.error(err);
    }, { enableHighAccuracy: true });

  } else {
    error_div.textContent = "Error: Geolocation is not supported by this browser.";
  }
}

// Wait until website loads. Do setup procedure.
window.addEventListener("load", () => {
  // Set theme to stored theme
  if (!localStorage.getItem("theme"))
    localStorage.setItem("theme", theme.DARK);
  setTheme(localStorage.getItem("theme"));

  // Start main function
  main();
  setInterval(main, 30000);
});
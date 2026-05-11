// =========================
// CAFE FINDER APP
// =========================

// MAP VARIABLES

let map;
let userMarker;
let cafeMarkers = [];

// CREATE MAP

map = L.map("map").setView([20.2961, 85.8245], 13);

// MAP TILE

L.tileLayer(

  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

  {
    attribution: "© OpenStreetMap"
  }

).addTo(map);

// =========================
// DARK MODE
// =========================

const darkBtn =
document.getElementById("darkBtn");

if(darkBtn){

  darkBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    // SAVE MODE

    if(document.body.classList.contains("dark")){

      localStorage.setItem(
        "theme",
        "dark"
      );

    }

    else{

      localStorage.setItem(
        "theme",
        "light"
      );

    }

  });

}

// LOAD SAVED THEME

if(localStorage.getItem("theme") === "dark"){

  document.body.classList.add("dark");

}

// =========================
// LOADER
// =========================

window.addEventListener("load", () => {

  setTimeout(() => {

    const loader =
    document.getElementById("loader");

    if(loader){

      loader.style.display = "none";

    }

  }, 1800);

});

// =========================
// USER LOCATION
// =========================

navigator.geolocation.watchPosition(

  (position) => {

    const lat =
    position.coords.latitude;

    const lng =
    position.coords.longitude;

    // MOVE MAP

    map.flyTo([lat, lng], 15, {

      duration: 2

    });

    // USER MARKER

    if(userMarker){

      userMarker.setLatLng([lat, lng]);

    }

    else{

      userMarker =

      L.marker([lat, lng])

      .addTo(map)

      .bindPopup("📍 You are here")

      .openPopup();

    }

    // FETCH CAFES

    fetchCafes(lat, lng);

    // WEATHER

    updateWeather();

  },

  () => {

    alert("Location access denied");

  }

);

// =========================
// FETCH CAFES
// =========================

async function fetchCafes(lat, lng){

  // REMOVE OLD MARKERS

  cafeMarkers.forEach(marker => {

    map.removeLayer(marker);

  });

  cafeMarkers = [];

  // OVERPASS API QUERY

  const query = `

  [out:json];

  (

    node
    ["amenity"="cafe"]

    (around:3500,${lat},${lng});

  );

  out;

  `;

  const url =

  "https://overpass-api.de/api/interpreter?data="

  + encodeURIComponent(query);

  const response =
  await fetch(url);

  const data =
  await response.json();

  // AI RECOMMENDATIONS

  generateAestheticRecommendation(
    data.elements
  );

  // LOOP CAFES

  data.elements.forEach(cafe => {

    const cafeName =

    cafe.tags.name || "Cafe";

    const distance =

    calculateDistance(

      lat,
      lng,

      cafe.lat,
      cafe.lon

    );

    // RANDOM RATING

    const rating =

    (Math.random() * 2 + 3).toFixed(1);

    // RANDOM REVIEW

    const reviews = [

      "✨ Cozy aesthetic vibes",

      "☕ Amazing coffee",

      "📸 Instagram worthy cafe",

      "🎵 Chill ambience",

      "💻 Perfect work cafe"

    ];

    const randomReview =

    reviews[
      Math.floor(
        Math.random() * reviews.length
      )
    ];

    // MARKER

    const marker =

    L.marker([cafe.lat, cafe.lon])

    .addTo(map)

    .bindPopup(`

      <div style="
      font-family:Poppins;
      width:220px;
      ">

        <img

        src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800"

        style="
        width:100%;
        border-radius:15px;
        margin-bottom:10px;
        ">

        <h3>

          ${cafeName}

        </h3>

        <p>

          ⭐ ${rating}

        </p>

        <p>

          📍 ${distance} km away

        </p>

        <p>

          ${randomReview}

        </p>

        <button

        onclick="saveFavorite('${cafeName}')"

        style="

        margin-top:10px;

        padding:10px;

        border:none;

        border-radius:10px;

        cursor:pointer;

        color:white;

        background:
        linear-gradient(
        135deg,
        #9c27b0,
        #ff4fd8
        );

        ">

        ❤️ Save Cafe

        </button>

        <br><br>

        <a
        href="cafe.html"

        style="
        text-decoration:none;
        color:#9c27b0;
        font-weight:600;
        ">

        View Details →

        </a>

      </div>

    `);

    cafeMarkers.push(marker);

  });

}

// =========================
// SEARCH LOCATION
// =========================

async function searchLocation(){

  const input =

  document.getElementById(
    "searchInput"
  ).value;

  if(input.trim() === ""){

    alert("Enter a location");

    return;

  }

  const response =
  await fetch(

  `https://nominatim.openstreetmap.org/search?format=json&q=${input}`

  );

  const data =
  await response.json();

  if(data.length > 0){

    const lat = data[0].lat;

    const lon = data[0].lon;

    map.flyTo([lat, lon], 15, {

      duration: 2

    });

    fetchCafes(lat, lon);

  }

  else{

    alert("Location not found");

  }

}

// =========================
// FAVORITES
// =========================

function saveFavorite(name){

  let favorites =

  JSON.parse(
    localStorage.getItem("cafes")
  ) || [];

  if(!favorites.includes(name)){

    favorites.push(name);

    localStorage.setItem(

      "cafes",

      JSON.stringify(favorites)

    );

    alert("❤️ Cafe Saved");

  }

  else{

    alert("Already saved");

  }

}

// =========================
// SHOW FAVORITES
// =========================

const favoritesList =

document.getElementById(
  "favoritesList"
);

if(favoritesList){

  const favorites =

  JSON.parse(
    localStorage.getItem("cafes")
  ) || [];

  if(favorites.length === 0){

    favoritesList.innerHTML =

    "<p>No cafes saved yet ❤️</p>";

  }

  else{

    favorites.forEach(cafe => {

      favoritesList.innerHTML += `

      <li>

        ☕ ${cafe}

      </li>

      `;

    });

  }

}

// =========================
// DISTANCE CALCULATOR
// =========================

function calculateDistance(

  lat1,
  lon1,

  lat2,
  lon2

){

  const R = 6371;

  const dLat =

  (lat2 - lat1) * Math.PI / 180;

  const dLon =

  (lon2 - lon1) * Math.PI / 180;

  const a =

    Math.sin(dLat/2) *
    Math.sin(dLat/2)

    +

    Math.cos(lat1*Math.PI/180) *

    Math.cos(lat2*Math.PI/180) *

    Math.sin(dLon/2) *

    Math.sin(dLon/2);

  const c =

  2 * Math.atan2(

    Math.sqrt(a),

    Math.sqrt(1-a)

  );

  return (R * c).toFixed(2);

}

// =========================
// WEATHER
// =========================

function updateWeather(){

  const weatherText =

  document.getElementById(
    "weatherText"
  );

  if(weatherText){

    const weatherList = [

      "☀ Pleasant weather",
      "🌤 Perfect cafe weather",
      "🌧 Rainy coffee vibes",
      "☁ Cozy cloudy weather"

    ];

    weatherText.innerHTML =

    weatherList[
      Math.floor(
        Math.random() * weatherList.length
      )
    ];

  }

}

// =========================
// AI AESTHETIC RECOMMENDATION
// =========================

function generateAestheticRecommendation(cafes){

  const aestheticKeywords = [

    "coffee",
    "roastery",
    "brew",
    "espresso",
    "artisan",
    "garden",
    "bakery",
    "lounge",
    "cafe"

  ];

  let aestheticCafes =

  cafes.filter(cafe => {

    const name =

    (cafe.tags.name || "")
    .toLowerCase();

    return aestheticKeywords.some(keyword =>

      name.includes(keyword)

    );

  });

  // RANDOMIZE

  aestheticCafes =

  aestheticCafes.sort(
    () => 0.5 - Math.random()
  );

  // TOP 3

  const topCafes =

  aestheticCafes.slice(0,3);

  const aiText =

  document.getElementById(
    "aiText"
  );

  if(aiText){

    if(topCafes.length > 0){

      aiText.innerHTML = `

      ✨ Recommended Aesthetic Cafes

      <br><br>

      ${topCafes.map(cafe =>

        `☕ ${cafe.tags.name || "Cafe"}`

      ).join("<br>")}

      `;

    }

    else{

      aiText.innerHTML =

      "☕ No aesthetic cafes nearby";

    }

  }

}

// =========================
// TOP BUTTON
// =========================

const topBtn =
document.getElementById("topBtn");

if(topBtn){

  topBtn.addEventListener("click", () => {

    window.scrollTo({

      top:0,

      behavior:"smooth"

    });

  });

}
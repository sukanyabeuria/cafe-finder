// ========================
// LOADER
// ========================

window.addEventListener("load", () => {

  const loader =
  document.getElementById("loader");

  setTimeout(() => {

    if(loader){
      loader.style.display = "none";
    }

  }, 1200);

});


// ========================
// MAP
// ========================

let map =
L.map("map").setView(
  [20.2961, 85.8245],
  13
);

L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution:
    "© OpenStreetMap"
  }
).addTo(map);


// ========================
// MARKERS ARRAY
// ========================

let cafeMarkers = [];


// ========================
// REAL CAFE SEARCH
// ========================

async function searchRealCafes(
  city = "Bhubaneswar"
){

  const query = `
  [out:json];

  area["name"="${city}"]->.searchArea;

  (
    node["amenity"="cafe"](area.searchArea);
  );

  out body;
  `;

  const url =
  "https://overpass-api.de/api/interpreter?data=" +
  encodeURIComponent(query);

  try{

    const response =
    await fetch(url);

    const data =
    await response.json();

    // REMOVE OLD MARKERS

    cafeMarkers.forEach(marker => {

      map.removeLayer(marker);

    });

    cafeMarkers = [];

    // CLEAR OLD CARDS

    const cardsGrid =
    document.getElementById(
      "cardsGrid"
    );

    if(cardsGrid){
      cardsGrid.innerHTML = "";
    }

    // SHOW REAL CAFES

    data.elements.forEach(cafe => {

      const name =
      cafe.tags.name ||
      "Unnamed Cafe";

      // MAP MARKER

      const marker =
      L.marker([
        cafe.lat,
        cafe.lon
      ]).addTo(map);

      marker.bindPopup(`

        <div style="width:220px">

          <h3>
            ${name}
          </h3>

          <p>
            ☕ Real Cafe
          </p>

          <a
          target="_blank"
          href="
          https://www.google.com/maps?q=
          ${cafe.lat},
          ${cafe.lon}
          ">
            Open Directions
          </a>

        </div>

      `);

      cafeMarkers.push(marker);

      // CREATE REAL CARDS

      if(cardsGrid){

        cardsGrid.innerHTML += `

        <div class="modern-card">

          <img
          src="
          https://images.unsplash.com/photo-1495474472287-4d71bcdd2085
          ">

          <div class="card-content">

            <h2>
              ${name}
            </h2>

            <div class="rating">
              ⭐ 4.${Math.floor(
                Math.random() * 9
              )}
            </div>

            <p>
              Beautiful aesthetic cafe
              with cozy vibes ☕
            </p>

            <div class="card-buttons">

              <button
              class="fav-btn">
                ❤️ Favorite
              </button>

              <a
              target="_blank"
              href="
              https://www.google.com/maps?q=
              ${cafe.lat},
              ${cafe.lon}
              ">
                Directions
              </a>

            </div>

          </div>

        </div>

        `;

      }

    });

  }catch(error){

    console.log(error);

  }

}


// ========================
// AUTO LOAD CAFES
// ========================

searchRealCafes();


// ========================
// SEARCH
// ========================

const searchBtn =
document.getElementById(
  "searchBtn"
);

const searchInput =
document.getElementById(
  "searchInput"
);

if(searchBtn){

  searchBtn.addEventListener(
    "click",
    () => {

      const city =
      searchInput.value;

      if(city.trim() !== ""){

        searchRealCafes(city);

      }

    }
  );

}


// ========================
// SEARCH SUGGESTIONS
// ========================

const suggestions = [

  "Bhubaneswar",
  "Delhi",
  "Mumbai",
  "Bangalore",
  "Cafe Coffee Day",
  "Bocca Cafe"

];

if(searchInput){

  searchInput.addEventListener(
    "input",
    () => {

      console.log(
        suggestions.filter(item =>
          item
          .toLowerCase()
          .includes(
            searchInput.value
            .toLowerCase()
          )
        )
      );

    }
  );

}


// ========================
// WEATHER
// ========================

const weatherStatus =
document.getElementById(
  "weatherStatus"
);

const weatherList = [

  "☁ Cloudy Coffee Mood",
  "🌧 Rainy Cafe Weather",
  "☀ Sunny Latte Day",
  "❄ Cold Brew Time"

];

if(weatherStatus){

  const randomWeather =

  weatherList[
    Math.floor(
      Math.random() *
      weatherList.length
    )
  ];

  weatherStatus.innerHTML =
  randomWeather;

}


// ========================
// DARK MODE
// ========================

const themeToggle =
document.getElementById(
  "themeToggle"
);

if(themeToggle){

  themeToggle.addEventListener(
    "click",
    () => {

      document.body.classList.toggle(
        "light-mode"
      );

    }
  );

}


// ========================
// FAVORITES
// ========================

document.addEventListener(
  "click",
  (e) => {

    if(
      e.target.classList.contains(
        "fav-btn"
      )
    ){

      e.target.innerHTML =
      "💖 Saved";

    }

  }
);


// ========================
// TOP BUTTON
// ========================

const topBtn =
document.getElementById(
  "topBtn"
);

if(topBtn){

  topBtn.addEventListener(
    "click",
    () => {

      window.scrollTo({

        top:0,
        behavior:"smooth"

      });

    }
  );

}
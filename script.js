let map;

let service;

let infowindow;

let userLat;

let userLng;

let markers = [];

// DARK MODE

const darkBtn =
document.getElementById("darkBtn");

darkBtn.addEventListener("click", () => {

  document.body.classList.toggle("dark");

});

// INITIALIZE MAP

function initMap(lat, lng){

  userLat = lat;

  userLng = lng;

  const location =
  new google.maps.LatLng(lat, lng);

  map = new google.maps.Map(

    document.getElementById("map"),

    {
      center:location,
      zoom:15,
    }

  );

  // USER LOCATION MARKER

  new google.maps.Marker({

    position:location,

    map:map,

    title:"Your Location",

    icon:
    "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"

  });

  infowindow =
  new google.maps.InfoWindow();

  const request = {

    location:location,

    radius:3000,

    type:["cafe"]

  };

  service =
  new google.maps.places.PlacesService(map);

  service.nearbySearch(request, callback);

}

// CALLBACK FUNCTION

function callback(results, status){

  if(
    status ===
    google.maps.places.PlacesServiceStatus.OK
  ){

    clearMarkers();

    for(let i=0; i<results.length; i++){

      createMarker(results[i]);

    }

  }

}

// CREATE MARKER

function createMarker(place){

  let photoUrl =
  "https://via.placeholder.com/250";

  if(place.photos){

    photoUrl =
    place.photos[0].getUrl();

  }

  const marker =
  new google.maps.Marker({

    map:map,

    position:place.geometry.location,

    animation:google.maps.Animation.DROP

  });

  markers.push(marker);

  const distance =
  calculateDistance(

    userLat,
    userLng,

    place.geometry.location.lat(),

    place.geometry.location.lng()

  );

  google.maps.event.addListener(

    marker,

    "click",

    () => {

      infowindow.setContent(`

        <div class="info-card">

          <img src="${photoUrl}">

          <h2>${place.name}</h2>

          <p>
          ⭐ Rating:
          ${place.rating || "No rating"}
          </p>

          <p>
          📍 ${distance} km away
          </p>

          <p>
          ${place.vicinity || ""}
          </p>

          <a
          target="_blank"

          href="
          https://www.google.com/maps/dir/?api=1&destination=

          ${place.geometry.location.lat()},
          ${place.geometry.location.lng()}
          ">

          🚗 Directions

          </a>

          <br>

          <button

          class="favorite-btn"

          onclick="saveFavorite('${place.name}')"

          >

          ❤️ Favorite

          </button>

        </div>

      `);

      infowindow.open(map, marker);

    }

  );

}

// SEARCH CAFE

function searchCafe(){

  const input =

  document.getElementById(
    "searchInput"
  ).value;

  const request = {

    query:input,

    fields:["name","geometry"]

  };

  service.textSearch(

    request,

    (results, status) => {

      if(

        status ===
        google.maps.places.PlacesServiceStatus.OK

      ){

        clearMarkers();

        map.setCenter(
          results[0].geometry.location
        );

        for(let i=0; i<results.length; i++){

          createMarker(results[i]);

        }

      }

    }

  );

}

// CLEAR MARKERS

function clearMarkers(){

  for(let i=0; i<markers.length; i++){

    markers[i].setMap(null);

  }

  markers = [];

}

// DISTANCE CALCULATION

function calculateDistance(

  lat1,
  lon1,

  lat2,
  lon2

){

  const R = 6371;

  const dLat =
  (lat2-lat1) * Math.PI/180;

  const dLon =
  (lon2-lon1) * Math.PI/180;

  const a =

    Math.sin(dLat/2) *
    Math.sin(dLat/2)

    +

    Math.cos(lat1*Math.PI/180) *

    Math.cos(lat2*Math.PI/180) *

    Math.sin(dLon/2) *

    Math.sin(dLon/2);

  const c =

    2 *

    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1-a)
    );

  return (R*c).toFixed(2);

}

// SAVE FAVORITES

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

    alert("Cafe Saved ❤️");

  }

  else{

    alert("Already Saved");

  }

}

// LIVE LOCATION TRACKING

navigator.geolocation.watchPosition(

  (position) => {

    const lat =
    position.coords.latitude;

    const lng =
    position.coords.longitude;

    initMap(lat, lng);

  },

  () => {

    alert("Location access denied");

  }

);
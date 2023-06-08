
// Initialize Google Maps
function initMap() {
  const mapOptions = {
    center: { lat: 30.0587541, lng: 31.2140550}, // Replace with the actual location coordinates of the apartment
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.SATELLITE, // Set map type to satellite
  };

  const map = new google.maps.Map(document.getElementById("map"), mapOptions);

  const marker = new google.maps.Marker({
    position: mapOptions.center,
    map: map,
    title: "Agouza Nile View Apartment",
  });
}
// Add an event listener for when the Google Maps API is ready


// Load Google Maps API script
function loadGoogleMapsApi(callback) {
  if (!window.google) {
    const googleMapsApiScript = document.createElement("script");
    googleMapsApiScript.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCSqTA1pqLElmDKcdgqAcPG-uMrAznKAlQ&callback=" + callback;
    googleMapsApiScript.async = true; // Use async attribute
    document.body.appendChild(googleMapsApiScript);
  } else {
    window[callback]();
  }
}


// Call the loadGoogleMapsApi function
loadGoogleMapsApi("initMap");

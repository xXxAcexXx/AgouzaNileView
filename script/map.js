function loadGoogleMapsApi(callback) {
  if (!window.google) {
      const googleMapsApiScript = document.createElement("script");
      googleMapsApiScript.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBFppqchhe6Jps5lQdjO5c3fc8uKr-cC7M&callback=" + callback + "&loading=async";
      googleMapsApiScript.async = true; // Use async attribute
      document.body.appendChild(googleMapsApiScript);
  } else {
      window[callback]();
  }
}

// Initialize Google Maps
async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  const mapOptions = {
      center: { lat: 30.0587541, lng: 31.2140550 }, // Replace with the actual location coordinates of the apartment
      zoom: 15,
      mapId: "6a14cff5c2b9520d", // Added Map ID
      mapTypeId: "satellite", // Use string instead of deprecated enum
  };

  const map = new Map(document.getElementById("map"), mapOptions);

  const marker = new AdvancedMarkerElement({
      position: mapOptions.center,
      map: map,
      title: "Agouza Nile View Apartment",
  });
}

// Intersection Observer
const mapSection = document.getElementById("map"); // The id of the section where the map is displayed

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
      if (entry.isIntersecting) {
          loadGoogleMapsApi("initMap");
          observer.unobserve(mapSection); // Stop observing once the map is loaded
      }
  });
});

observer.observe(mapSection);

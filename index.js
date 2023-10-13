function fetchIpData(ip) {
  fetch(`https://ipwho.is/${ip}`)
.then(
  function(response) {
    if (response.status !== 200) {
      console.log('Looks like there was a problem. Status Code: ' +
        response.status);
      return;
    }
    response.json().then(function(data) {
      console.log(data);
      document.getElementById('ip').innerText = ip;
      document.getElementById('ip-location').innerText = `${data.country_code},${data.city},${data.region_code} ${data.postal}`;
      document.getElementById('timezone').innerText = `UTC${data.timezone.utc}`;
      document.getElementById('isp').innerText = data.connection.isp;
      updateMap(parseFloat(data.latitude),parseFloat(data.longitude));
    });
  }
)
.catch(function(err) {
  console.log('Fetch Error :-S', err);
});

}


let searchBtn = document.querySelector('#searchbtn');
searchBtn.addEventListener('click', function(e) {
const ip = document.querySelector('#searchbar').value ;
fetchIpData(ip);
});

   // Function to update the map with new coordinates
   function updateMap(latitude, longitude) {
    try {
      if (map) {
        map.setCenter({ lat: latitude, lng: longitude });
      } else {
        console.error('Map not initialized.');
      }
    } catch (error) {
      console.error('Error updating map:', error);
    }
  }

//Step 1: initialize communication with the platform
    // Replace variable YOUR_API_KEY with your own apikey
    var platform = new H.service.Platform({
      apikey: 'VMuynjvTxwRT30yq-dka5izREzHMcm6PdgKYyIejNPg'
  });
  var defaultLayers = platform.createDefaultLayers();
  //Step 2: initialize a map - this map is centered over Europe
  var map = new H.Map(document.getElementById('map'),
      defaultLayers.vector.normal.map,
      {
          center: { lat: 37.404319763183594, lng: -122.16726684570312 },
          zoom: 10,
          pixelRatio: window.devicePixelRatio || 1
      }
  );
  // This adds a resize listener to make sure that the map occupies the whole container
  window.addEventListener('resize', () => map.getViewPort().resize());
  //Step 3: make the map interactive
  // MapEvents enables the event system
  // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
  var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

  // Create the default UI components
  var ui = H.ui.UI.createDefault(map, defaultLayers);

// Event listener for the Enter key press
document.getElementById("searchbar").addEventListener("keyup", function(e) {
  console.log('Enter key' ,event.key)
  if (event.key === "Enter") {
      const ip = document.querySelector('#searchbar').value ;
      fetchIpData(ip);
    }
});


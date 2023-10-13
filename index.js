
const svgMarkup = '<svg xmlns="http://www.w3.org/2000/svg" width="46" height="56"><path fill-rule="evenodd" d="M39.263 7.673c8.897 8.812 8.966 23.168.153 32.065l-.153.153L23 56 6.737 39.89C-2.16 31.079-2.23 16.723 6.584 7.826l.153-.152c9.007-8.922 23.52-8.922 32.526 0zM23 14.435c-5.211 0-9.436 4.185-9.436 9.347S17.79 33.128 23 33.128s9.436-4.184 9.436-9.346S28.21 14.435 23 14.435z"/></svg>';
map.setCenter({ lat: 34.05430, lng: -118.08212 });
var bearsIcon = new H.map.Icon(svgMarkup);
bearsMarker = new H.map.Marker({lat: 34.05430, lng: -118.08212 },{icon: bearsIcon});

function fetchIpData(ip) {
  fetch(`http://api.ipstack.com/${ip}?access_key=cdc36e56c18d724e0bdc06e30be4f1b1`)
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
      document.getElementById('ip-location').innerText = `${data.city},${data.region_code} ${data.zip}`;
    });
  }
)
.catch(function(err) {
  console.log('Fetch Error :-S', err);
});

fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=53928e952ac147d1ac47402d8f071905&ip=${ip}`)
.then(
  function(response) {
    if (response.status !== 200) {
      console.log('Looks like there was a problem. Status Code: ' +
        response.status);
      return;
    }
    response.json().then(function(data) {
      console.log(data);
      if(parseFloat(data.time_zone.offset) < 0)
        document.getElementById('timezone').innerText = `UTC${parseFloat(data.time_zone.offset)}`;
    else 
        document.getElementById('timezone').innerText = `UTC+${parseFloat(data.time_zone.offset)}`;
      document.getElementById('isp').innerText = data.isp;
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
     bearsIcon = new H.map.Icon(svgMarkup);
     bearsMarker = new H.map.Marker({lat: latitude, lng: longitude },{icon: bearsIcon});

       map.addObject(bearsMarker);
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
  fetch(`http://api.ipstack.com/${ip}?access_key=cdc36e56c18d724e0bdc06e30be4f1b1`)
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
        document.getElementById('ip-location').innerText = `${data.city},${data.region_code} ${data.zip}`;
      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });
  
  fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=53928e952ac147d1ac47402d8f071905&ip=${ip}`)
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }
      response.json().then(function(data) {
        console.log(data);
        if(parseFloat(data.time_zone.offset) < 0)
          document.getElementById('timezone').innerText = `UTC${parseFloat(data.time_zone.offset)}`;
      else 
          document.getElementById('timezone').innerText = `UTC+${parseFloat(data.time_zone.offset)}`;
        document.getElementById('isp').innerText = data.isp;
        updateMap(parseFloat(data.latitude),parseFloat(data.longitude));
      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });
  }
});


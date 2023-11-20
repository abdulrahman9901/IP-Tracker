function fetchIpData(ip) {
  console.log('Fetching',ip);
  fetch('https://ip-tracker-68u8.onrender.com/getIpInfo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ip: ip }),
    })
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
      document.getElementById('ip-location').innerText = `${data.country_code} ${data.flag.emoji} ,${data.city},${data.region_code} ${data.postal}`;
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

function extractFirstIP(ipString) {
  // Regular expression to match an IPv4 address
  const ipRegex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;

  // Find all matches in the input string
  const matches = ipString.match(ipRegex);

  // If matches are found, return the first one; otherwise, return null
  return matches ? matches[0] : null;
}

function fetchDataAndReplace() {
  fetch('https://ip-tracker-68u8.onrender.com/getIp', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => response.json())
  .then(data => {
    fetchIpData(extractFirstIP(data.ip))
  })
  .catch(error => {
    console.error('Error:', error);
    // Handle errors
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Fetch data when the page loads
  fetchDataAndReplace();
});


let searchBtn = document.querySelector('#searchbtn');
searchBtn.addEventListener('click', function(e) {
const ip = document.querySelector('#searchbar').value ;
fetchIpData(ip);
});
   // Function to update the map with new coordinates
   function updateMap(latitude, longitude) {
    try {
      if (map) {
        // Remove the marker from the map
        map.removeObject(bearsMarker);
        var bearsIcon = new H.map.Icon(svgMarkup);
        bearsMarker = new H.map.Marker({lat: latitude, lng: longitude },{icon: bearsIcon});
        map.addObject(bearsMarker);
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
      const svgMarkup = '<svg xmlns="http://www.w3.org/2000/svg" width="46" height="56"><path fill-rule="evenodd" d="M39.263 7.673c8.897 8.812 8.966 23.168.153 32.065l-.153.153L23 56 6.737 39.89C-2.16 31.079-2.23 16.723 6.584 7.826l.153-.152c9.007-8.922 23.52-8.922 32.526 0zM23 14.435c-5.211 0-9.436 4.185-9.436 9.347S17.79 33.128 23 33.128s9.436-4.184 9.436-9.346S28.21 14.435 23 14.435z"/></svg>';
      var map = new H.Map(document.getElementById('map'),
          defaultLayers.vector.normal.map,
          {
              center: { lat: 37.404319763183594, lng: -122.16726684570312 },
              zoom: 7,
              pixelRatio: window.devicePixelRatio || 1
          }
      );
      var bearsIcon = new H.map.Icon(svgMarkup);
      bearsMarker = new H.map.Marker({ lat: 37.404319763183594, lng: -122.16726684570312},{icon: bearsIcon});
      map.addObject(bearsMarker);
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

// Function to format IP address and perform validation
function formatAndValidateIP(input) {
  // Split the input by spaces
  const parts = input.split('.');
  console.log("parts",parts)
  // Process each part separately
  const formattedSegments = parts.map((part, index, array) => {
    // Remove non-numeric characters and replace spaces with dots
    const cleanedInput = part.replace(/[^\d.]/g, '');
  
    
    // Ensure each segment has between one and three digits
    const trimmedSegment = cleanedInput.slice(0, 3);

    // Add a dot after the segment if it has 3 digits and it's not the last one
    if ((trimmedSegment.length === 3 || index < parts.length - 1) && index !== 3 && trimmedSegment.charAt(trimmedSegment.length - 1) !== '.') {
      return trimmedSegment + '.';
    } else {
      return trimmedSegment;
    }
  });

  // Ensure only four sets
  const validSegments = formattedSegments.slice(0, 4);

  // Join the formatted segments with dots
  let finalFormattedInput = validSegments.join('');
  
  document.getElementById('searchbar').value = finalFormattedInput;

  // Validate the IP address using a regular expression
  const ipRegex = /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})?$/;
  const isValidIP = ipRegex.test(finalFormattedInput);
  console.log(isValidIP); // Log the result to the console for testing
}

// Attach the function to the input field's input event
document.getElementById('searchbar').addEventListener('input', function () {
  formatAndValidateIP(this.value);
});

// Attach an event listener for the keydown event to handle backspace
document.getElementById('searchbar').addEventListener('keydown', function (event) {
  if (event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault(); // Prevent space from being entered
        if (this.value && this.value.charAt(this.value.length - 1) !== '.' ) {
          this.value += '.';
          console.log("spacebar", this.value)
          formatAndValidateIP(this.value);
        }
    }
  else if (event.key === 'Backspace') {
    // Prevent the default behavior of the backspace key
    event.preventDefault();
    const currentValue = this.value;
    if(currentValue.charAt(currentValue.length - 1) === '.')
      newValue = currentValue.slice(0, -2);
    else 
      newValue = currentValue.slice(0, -1);

    formatAndValidateIP(newValue);
  }
});
// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var map; 

function initMap() {
    map = new google.maps.Map(document.getElementById('map'),  {
        center: {
            lat:-34.397, 
            lng:150.644
        }, 
        zoom:8
    }); 
    map.setMapTypeId('satellite');
    map.setTilt(0);
    initAutocomplete()
}

function initAutocomplete() {
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input'); 
    var searchBox = new google.maps.places.SearchBox(input); 
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input); 

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}

    function moveToLocation() {
        var latitude = 45.795614;
        var longitude = 21.253636;
        map.setCenter({lat: latitude, lng: longitude});
        map.setZoom(20)

        // Define the LatLng coordinates for the polygon's path.
        var terrain = [
            {lat: 45.795755, lng: 21.254548}, //top-right
            {lat: 45.795236, lng: 21.254176}, //bottom-right
            {lat: 45.795401, lng: 21.253713}, //bottom-left
            {lat: 45.795914, lng: 21.254108}  //top-left
        ];

        // Construct the polygon.
        var terrain = new google.maps.Polygon({
            paths: terrain,
            strokeColor: '#00FF00',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#00FF00',
            fillOpacity: 0.35
        });
        terrain.setMap(map);
    }









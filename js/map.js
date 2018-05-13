    //Map.js

    var map;
    var polygons = [];

    function initMap() {
        map = new google.maps.Map(document.getElementById('map'),  {
            center: {
                lat: 45.797467, 
                lng: 21.239164
           },
           zoom: 15,
           labels: true
      });
      map.setMapTypeId('hybrid');
      map.setTilt(0);
      initAutocomplete();
      initShapes();
    }

    function initAutocomplete() {
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        map.addListener('bounds_changed', function () {
          searchBox.setBounds(map.getBounds());
        });

        searchBox.addListener('places_changed', function () {
            var places = searchBox.getPlaces();

           if (places.length == 0) {
                return;
            }

            var bounds = new google.maps.LatLngBounds();
            places.forEach(function (place) {
                if (!place.geometry) {
                    console.log("Returned place contains no geometry");
                   return;
               }

                if (place.geometry.viewport) {
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            map.fitBounds(bounds);
            map.setZoom(15);
        });
    }

    function moveToLocation() {}

    function measureDistance(lat1, lon1, lat2, lon2) {  // generally used geo measurement function
        var R = 6378.137; // Radius of earth in KM
        var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
        var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        return d * 1000; // meters
    }

    function Place () {
        this.longitude = 0.0;
        this.latitude = 0.0;

        this.top_right_lat = 0.0;
        this.top_right_lng = 0.0;

        this.bottom_right_lat = 0.0;
        this.bottom_right_lng = 0.0;

        this.bottom_left_lat = 0.0;
        this.bottom_left_lng = 0.0;

        this.top_left_lat = 0.0;
        this.top_left_lng = 0.0;
    }

    var globalShapes = []
    var objectList = []

    var object1 = new Place();
    var object2 = new Place();
    var object3 = new Place();

    function initShapes() {

        object1.latitude = 45.795614;
        object1.longitude = 21.253636;
        object1.top_right_lat = 45.795755;
        object1.top_right_lng = 21.254548;
        object1.bottom_right_lat = 45.795236;
        object1.bottom_right_lng = 21.254176;
        object1.bottom_left_lat = 45.795401;
        object1.bottom_left_lng = 21.253713;
        object1.top_left_lat = 45.795914;
        object1.top_left_lng = 21.254108;

        object2.latitude = 45.797090;
        object2.longitude = 21.251242;
        object2.top_right_lat = 45.79699;
        object2.top_right_lng = 21.251403;
        object2.bottom_right_lat = 45.797383;
        object2.bottom_right_lng = 21.251707;
        object2.bottom_left_lat = 45.797209;
        object2.bottom_left_lng = 21.252182;
        object2.top_left_lat = 45.796811;
        object2.top_left_lng = 21.251867;

        object3.latitude = 45.791818;
        object3.longitude = 21.237491;
        object3.top_right_lat = 45.791797;
        object3.top_right_lng = 21.237569;
        object3.bottom_right_lat = 45.792009;
        object3.bottom_right_lng = 21.237739;
        object3.bottom_left_lat = 45.791917;
        object3.bottom_left_lng = 21.238015;
        object3.top_left_lat = 45.791697;
        object3.top_left_lng = 21.237879;

        objectList.push(object1);
        objectList.push(object2);
        objectList.push(object3);

        objectList.forEach(function(object) {
            var latitude = object .latitude;
            var longitude = object.longitude;

            // Define the LatLng coordinates for the polygon's path.
            var terrainCoords = [
                {lat: object.top_right_lat, lng: object.top_right_lng}, //top-right
                {lat: object.bottom_right_lat, lng: object.bottom_right_lng}, //bottom-right
                {lat: object.bottom_left_lat, lng: object.bottom_left_lng}, //bottom-left
                {lat: object.top_left_lat, lng: object.top_left_lng}  //top-left
            ];

            // polygons.forEach(function(figure) {
            //     figure.setMap(null)
            // });
            // polygons = [];
            // Construct the polygon.
            var shape = new google.maps.Polygon({
                map: map,
                paths: terrainCoords,
                strokeColor: 'green',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: 'green',
                fillOpacity: 0.35
            });
            shape.addListener('click', shapeClick);
            globalShapes.push(shape);
        });

        var areas = document.getElementsByClassName("area");
        for (var i = 0; i < 3; i++) {
            areas[i].innerText = ((getObjectArea(i) | 0) + "\u33A1");
        };

        var prices = document.getElementsByClassName("price");
        for(var i = 0; i < 3; i++) {
            console.log(prices[i]);
            prices[i].innerText = (((getObjectArea(i) * 70) | 0) + "\u20ac");
        }
    }

    var infoWindow = null;

    function shapeClick(event) {
        globalShapes.forEach(function(shape) {
            shape.setOptions({strokeColor: 'green', fillColor: 'green'});
        });
        map.panTo({lat: event.latLng.lat(), lng: event.latLng.lng()});
        map.setZoom(19)
        this.setOptions({strokeColor: 'blue', fillColor: 'blue'});
        
        var selected;

        if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(object1.top_right_lat, object1.top_right_lng), this)) {
            selected = 0;
        } else if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(object2.top_right_lat, object2.top_right_lng), this)) {
            selected = 1;
        } else {
            selected = 2;
        }

        var address = (selected == 2) ? "Strada Fervenția 35" : "Strada Castanilor";

        var length = measureDistance(objectList[selected].top_right_lat, objectList[selected].top_right_lng, objectList[selected].bottom_right_lat, objectList[selected].bottom_right_lng);
        var width = measureDistance(objectList[selected].bottom_left_lat, objectList[selected].bottom_left_lng, objectList[selected].bottom_right_lat, objectList[selected].bottom_right_lng);

        var area = length * width;

        console.log("length = " + length);
        console.log("width = " + width);
        console.log("area = " + (length * width));

        var content = ("<b>" + address + "</b><br><br>");
        content += ("<b>Area:</b> " + (area | 0) + "m2<br>");
        content += ("(" + (length | 0) + "m x " + (width | 0) + "m)<br><br>");
        content += ("<b>Price: 15000$</b><br><br>");
        content += ("<button> Go to 3D view </button>");


        if(infoWindow) {
            infoWindow.close();
        }
        infoWindow = new google.maps.InfoWindow;
        infoWindow.setContent(content);
        infoWindow.setPosition(event.latLng);
        infoWindow.open(map);
    }

    function objectSelected(index) {
        console.log("Object " + index + " selected");
        globalShapes.forEach(function(shape) {
            shape.setOptions({strokeColor: 'green', fillColor: 'green'});
        });
        map.panTo({lat: objectList[index].latitude, lng: objectList[index].longitude});
        map.setZoom(19)
        globalShapes[index].setOptions({strokeColor: 'blue', fillColor: 'blue'});

        var address = (index == 2) ? "Strada Fervenția 35" : "Strada Castanilor";

        var length = measureDistance(objectList[index].top_right_lat, objectList[index].top_right_lng, objectList[index].bottom_right_lat, objectList[index].bottom_right_lng);
        var width = measureDistance(objectList[index].bottom_left_lat, objectList[index].bottom_left_lng, objectList[index].bottom_right_lat, objectList[index].bottom_right_lng);

        var area = length * width;

        console.log("length = " + length);
        console.log("width = " + width);
        console.log("area = " + (length * width));

        var content = ("<b>" + address + "</b><br><br>");
        content += ("<b>Area:</b> " + (area | 0) + "m2<br>");
        content += ("(" + (length | 0) + "m x " + (width | 0) + "m)<br><br>");
        var prices = document.getElementsByClassName("price");
        content += ("<b>Price: " + prices[index].innerText + "</b><br><br>");
        content += ("<button onclick=\"loadPage()\"> Go to 3D view </button>");

        if(infoWindow) {
            infoWindow.close();
        }
        infoWindow = new google.maps.InfoWindow;
        infoWindow.setContent(content);
        infoWindow.setPosition(polygonCenter(globalShapes[index]));
        infoWindow.open(map);
    }

    function loadPage() {
        window.location.href = "models.html";
    }

    function polygonCenter(poly) {
        var lowx,
        highx,
        lowy,
        highy,
        lats = [],
        lngs = [],
        vertices = poly.getPath();

        for(var i=0; i<vertices.length; i++) {
          lngs.push(vertices.getAt(i).lng());
          lats.push(vertices.getAt(i).lat());
        }

        lats.sort();
        lngs.sort();
        lowx = lats[0];
        highx = lats[vertices.length - 1];
        lowy = lngs[0];
        highy = lngs[vertices.length - 1];
        center_x = lowx + ((highx-lowx) / 2);
        center_y = lowy + ((highy - lowy) / 2);
        return (new google.maps.LatLng(center_x, center_y));
    }

    function getObjectArea(index) {
        var length = measureDistance(objectList[index].top_right_lat, objectList[index].top_right_lng, objectList[index].bottom_right_lat, objectList[index].bottom_right_lng);
        var width = measureDistance(objectList[index].bottom_left_lat, objectList[index].bottom_left_lng, objectList[index].bottom_right_lat, objectList[index].bottom_right_lng);

        return (length * width);
    }


















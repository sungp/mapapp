var apiURL = 'https://api.foursquare.com/v2/venues/';
var foursquareClientID = 'AQHSVDVH53ETI0XQS0JSTDA2QLFRETMK3W0B0B3WSM1UBYYD'
var foursquareSecret ='ZF3JNUQDY0HXQE20P3JL5BHGI1TURIA0YNU4NGPYUY4EXNHX';
var foursquareVersion = '20180118';

var initLocations = [
  {
    "title": 'Pfeiffer Big Sur State Park',
    "location" : {
      "lat" : 36.2128022,
      "lng" : -121.5860687
    },
    "foursquare_id": "4c23e083b012b713e45e0893",
  },
  {
    "title": "Julia Pfeiffer Burns State Park", 
    "location" : {
      "lat" : 36.1691714,
      "lng" : -121.671498
    },
    "foursquare_id": "4bbd305207809521535dda91",
  },
  {
    "title": "Pfeiffer Beach", 
    "location" : {
      "lat" : 36.2380659,
      "lng" : -121.816232
    },
    "foursquare_id": "4bc3a47ef8219c749c66b610",
  },
  {
    "title": "Limekiln State Park",
    "location" : {
      "lat" : 36.0200429,
      "lng" : -121.5224711
    },
    "foursquare_id": "4c252aa1c9bbef3bd166afac",
  },
  {
    "title": "Andrew Molera State Park",
    "location" : {
      "lat" : 36.2884189,
      "lng" : -121.844272
    },
    "foursquare_id": "4c212c25497cb71369ad6cd8",
  },
  {
    "title": "Garrapata State Park", 
    "location" : {
      "lat" : 36.4679829,
      "lng" : -121.9074861
    },
    "foursquare_id": "4c252aa1c9bbef3bd166afac",
  },    
  {
    "title": "Point Lobos State Natural Reserve",
    "location" : {
      "lat" : 36.5159123,
      "lng" : -121.9422821
    },
    "foursquare_id": "4bc2609474a9a5935d46d3f6",
  },    
];

function initMap() {
  vm = new ViewModel();
  ko.applyBindings(vm);

}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
/*function populateInfoWindow(marker, infowindow, id) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    // Clear the infowindow content to give the streetview time to load.
    infowindow.setContent('');
    infowindow.marker = marker;
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });

    var foursquareURL = apiURL + id + '?client_id=' + foursquareClientID +  '&client_secret=' + foursquareSecret +'&v=' + foursquareVersion;

    $.ajax({
      url: foursquareURL, 
      success: function(data) {

        infowindow.setContent('<div id="marker_link"></div><div id="best_photo"></div><div id="rating"></div><img src="img/Powered-by-Foursquare-full-color-small.png"></img>');
        var markerLinkDiv = document.getElementById('marker_link');
        var bestPhotoDiv = document.getElementById('best_photo');
        var ratingDiv = document.getElementById('rating');
        var bestPhoto = document.createElement('img');
        var photoJson = data.response.venue.bestPhoto
        bestPhoto.src = photoJson.prefix + "200x100" + photoJson.suffix; 
        var markerLink = document.createElement('a');
        markerLink.textContent = marker.title;
        markerLink.href = data.response.venue.shortUrl;
        bestPhotoDiv.appendChild(bestPhoto);
        markerLinkDiv.appendChild(markerLink);
        ratingDiv.textContent = "rating: " + data.response.venue.rating + "/10";
      },
      error: function() {
        infowindow.setContent('<div>Service Temporary Unavailable.</div><div>Please Try Again Later.</div>');
      }

    });

    // Open the infowindow on the correct marker.
    infowindow.open(map, marker);
  }
}*/

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
  return markerImage;
}

var Position = function(data) {
  this.lat = data.lat;
  this.lng = data.lng;
  this.get = function() {
    return {lat: this.lat, lng: this.lng};
  }
}

var Location = function(data, marker) {
  this.title = data.title;
  this.position = new Position(data.location);
  this.id = data.foursquare_id;
  this.marker = marker;
}

var ViewModel = function() {
  var self = this;

  // Create a styles array to use with the map.
  this.styles = [
    {
      featureType: 'water',
      stylers: [
        { color: '#19a0d8' }
      ]
    },{
      featureType: 'administrative',
      elementType: 'labels.text.stroke',
      stylers: [
        { color: '#ffffff' },
        { weight: 6 }
      ]
    },{
      featureType: 'administrative',
      elementType: 'labels.text.fill',
      stylers: [
        { color: '#e85113' }
      ]
    },{
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [
        { color: '#efe9e4' },
        { lightness: -40 }
      ]
    },{
      featureType: 'transit.station',
      stylers: [
        { weight: 9 },
        { hue: '#e85113' }
      ]
    },{
      featureType: 'road.highway',
      elementType: 'labels.icon',
      stylers: [
        { visibility: 'off' }
      ]
    },{
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [
        { lightness: 100 }
      ]
    },{
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [
        { lightness: -100 }
      ]
    },{
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [
        { visibility: 'on' },
        { color: '#f0e4d3' }
      ]
    },{
      featureType: 'road.highway',
      elementType: 'geometry.fill',
      stylers: [
        { color: '#efe9e4' },
        { lightness: -25 }
      ]
    }
  ];


  this.option = {
    center: {lat: 36.3614749, lng: -122.023054},
    zoom: 13,
    styles: self.styles,
    mapTypeControl: false
  }

  this.map = new google.maps.Map(document.getElementById('map'), this.option); 
  this.bounds = new google.maps.LatLngBounds();

  // These are the real estate listings that will be shown to the user.
  // Normally we'd have these in a database instead.

  var largeInfowindow = new google.maps.InfoWindow();

  // Style the markers a bit. This will be our listing marker icon.
  var defaultIcon = makeMarkerIcon('0091ff');

  // Create a "highlighted location" marker color for when the user
  // mouses over the marker.
  var highlightedIcon = makeMarkerIcon('FFFF24');

  // This function populates the infowindow when the marker is clicked. We'll only allow
  // one infowindow which will open at the marker that is clicked, and populate based
  // on that markers position.
  this.populateInfoWindow = function(marker, infowindow, id) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      // Clear the infowindow content to give the streetview time to load.
      infowindow.setContent('');
      infowindow.marker = marker;
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });

      var foursquareURL = apiURL + id + '?client_id=' + foursquareClientID +  '&client_secret=' + foursquareSecret +'&v=' + foursquareVersion;

      $.ajax({
        url: foursquareURL, 
        success: function(data) {

          infowindow.setContent('<div id="marker_link"></div><div id="best_photo"></div><div id="rating"></div><img src="img/Powered-by-Foursquare-full-color-small.png"></img>');
          var markerLinkDiv = document.getElementById('marker_link');
          var bestPhotoDiv = document.getElementById('best_photo');
          var ratingDiv = document.getElementById('rating');
          var bestPhoto = document.createElement('img');
          var photoJson = data.response.venue.bestPhoto
          bestPhoto.src = photoJson.prefix + "200x100" + photoJson.suffix; 
          var markerLink = document.createElement('a');
          markerLink.textContent = marker.title;
          markerLink.href = data.response.venue.shortUrl;
          bestPhotoDiv.appendChild(bestPhoto);
          markerLinkDiv.appendChild(markerLink);
          ratingDiv.textContent = "rating: " + data.response.venue.rating + "/10";
        },
        error: function() {
          infowindow.setContent('<div>Service Temporary Unavailable.</div><div>Please Try Again Later.</div>');
        }

      });

      // Open the infowindow on the correct marker.
      infowindow.open(map, marker);
    }
  }

  this.locations = ko.observableArray([]);
  // The following group uses the location array to create an array of markers on initialize.
  initLocations.forEach(function(location, index) {
    // Get the position from the location array.
    var position = location.location;
    var title = location.title;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon,
      id: index
    });
    // Create an onclick event to open the large infowindow at each marker.
    marker.addListener('click', function() {
      self.selectloc(this); 
    });
    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });
    self.locations().push(new Location(location, marker)); 
  });

  this.selectloc = function(location) {
    self.populateInfoWindow(location.marker, largeInfowindow, location.id);
    if (location.marker.getAnimation() !== null) {
      location.marker.setAnimation(null);
    } 
    location.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){ location.marker.setAnimation(null); }, 750);
  }

  this.filter = ko.observable("");

  this.showListing = function() {
    self.filter(document.getElementById("filter-text").value);
    self.locations().forEach(function(location) {
      location.marker.setMap(null);
    });
    self.filteredLocations().forEach(function(location) { 
      location.marker.setMap(self.map);
      self.bounds.extend(location.marker.position);
    });
    self.map.fitBounds(self.bounds) ;
  }


  this.filteredLocations = ko.computed(function() {
    var filter = self.filter().toLowerCase();
    if (!filter) {
      return self.locations();
    } else {
      return ko.utils.arrayFilter(self.locations(), function(location) {
        return location.marker.title.toLowerCase().indexOf(filter) != -1;
      });
    }
  });

  this.showListing();
}

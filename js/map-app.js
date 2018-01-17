// Create a new blank array for all the listing markers.
var initLocations = [
  {
    "title": 'Pfeiffer Big Sur State Park',
    "location" : {
      "lat" : 36.2128022,
      "lng" : -121.5860687
    },
  },
  {
    "title": "Julia Pfeiffer Burns State Park", 
    "location" : {
      "lat" : 36.1691714,
      "lng" : -121.671498
    },
  },
  {
    "title": "Pfeiffer Beach", 
    "location" : {
      "lat" : 36.2380659,
      "lng" : -121.816232
    },
  },
  {
    "title": "Limekiln State Park",
    "location" : {
      "lat" : 36.0200429,
      "lng" : -121.5224711
    },
  },
  {
    "title": "Andrew Molera State Park",
    "location" : {
      "lat" : 36.2884189,
      "lng" : -121.844272
    },
  },
  {
    "title": "Garrapata State Park", 
    "location" : {
      "lat" : 36.4679829,
      "lng" : -121.9074861
    },
  },    
  {
    "title": "Point Lobos State Natural Reserve",
    "location" : {
      "lat" : 36.5159123,
      "lng" : -121.9422821
    },
  },    
];

function initMap() {
  vm = new ViewModel();
  ko.applyBindings(vm);

}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    // Clear the infowindow content to give the streetview time to load.
    infowindow.setContent('');
    infowindow.marker = marker;
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
    var streetViewService = new google.maps.StreetViewService();
    var radius = 50;
    // In case the status is OK, which means the pano was found, compute the
    // position of the streetview image, then calculate the heading, then get a
    // panorama from that and set the options
    function getStreetView(data, status) {
      if (status == google.maps.StreetViewStatus.OK) {
        var nearStreetViewLocation = data.location.latLng;
        var heading = google.maps.geometry.spherical.computeHeading(
          nearStreetViewLocation, marker.position);
        infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
        var panoramaOptions = {
          position: nearStreetViewLocation,
          pov: {
            heading: heading,
            pitch: 30
          }
        };
        var panorama = new google.maps.StreetViewPanorama(
          document.getElementById('pano'), panoramaOptions);
      } else {
        infowindow.setContent('<div>' + marker.title + '</div>' +
          '<div>No Street View Found</div>');
      }
    }
    // Use streetview service to get the closest streetview image within
    // 50 meters of the markers position
    streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
    // Open the infowindow on the correct marker.
    infowindow.open(map, marker);
  }
}

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
var Location = function(data) {
  this.title = data.title;
  this.position = new Position(data.location);
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


  this.locations = ko.observableArray([]);
  initLocations.forEach(function(loc) {
    self.locations().push(new Location(loc)); 
  })
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

  this.markers = ko.observableArray([]);

  var largeInfowindow = new google.maps.InfoWindow();


  // Style the markers a bit. This will be our listing marker icon.
  var defaultIcon = makeMarkerIcon('0091ff');

  // Create a "highlighted location" marker color for when the user
  // mouses over the marker.
  var highlightedIcon = makeMarkerIcon('FFFF24');

  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < self.locations().length; i++) {
    // Get the position from the location array.
    var position = self.locations()[i].position.get(); 
    var title = self.locations()[i].title;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon,
      id: i
    });
    // Push the marker to our array of markers.
    self.markers.push(marker);
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
  }

  this.selectloc = function(marker) {
    populateInfoWindow(marker, largeInfowindow);
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } 
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){ marker.setAnimation(null); }, 750);
  }

  this.filter = ko.observable("");

  this.showListing = function() {
    self.filter(document.getElementById("filter-text").value);
    self.markers().forEach(function(marker) {
      marker.setMap(null);
    });
    self.filteredMarkers().forEach(function(marker) { 
      marker.setMap(self.map);
      self.bounds.extend(marker.position);
    });
    self.map.fitBounds(self.bounds) ;
  }


  this.filteredMarkers = ko.computed(function() {
    var filter = self.filter().toLowerCase();
    if (!filter) {
      return self.markers();
    } else {
      return ko.utils.arrayFilter(self.markers(), function(marker) {
        return marker.title.toLowerCase().indexOf(filter) != -1;
      });
    }
  });

  this.showListing();
}

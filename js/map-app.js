var apiURL = 'https://api.foursquare.com/v2/venues/';
var foursquareClientID = 'AQHSVDVH53ETI0XQS0JSTDA2QLFRETMK3W0B0B3WSM1UBYYD';
var foursquareSecret ='ZF3JNUQDY0HXQE20P3JL5BHGI1TURIA0YNU4NGPYUY4EXNHX';
var foursquareVersion = '20180118';

function initMap() {
  vm = new ViewModel();
  ko.applyBindings(vm);
}

function googleError() {
  alert("google map service is temporary unavailable. please check back again later");
}

var Position = function(data) {
  this.lat = data.lat;
  this.lng = data.lng;
  this.get = function() {
    return {lat: this.lat, lng: this.lng};
  };
};

var Location = function(data, marker) {
  this.title = data.title;
  this.position = new Position(data.location);
  this.id = data.foursquare_id;
  this.marker = marker;
};

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
  };

  this.map = new google.maps.Map(document.getElementById('map'), this.option); 
  this.bounds = new google.maps.LatLngBounds();

  // This function takes in a COLOR, and then creates a new marker
  // icon of that color. The icon will be 21 px wide by 34 high, have an origin
  // of 0, 0 and be anchored at 10, 34).
  this.makeMarkerIcon =  function(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21,34));
    return markerImage;
  };

  // These are the real estate listings that will be shown to the user.
  // Normally we'd have these in a database instead.
  var largeInfowindow = new google.maps.InfoWindow();

  // Style the markers a bit. This will be our listing marker icon.
  var defaultIcon = self.makeMarkerIcon('0091ff');

  // Create a "highlighted location" marker color for when the user
  // mouses over the marker.
  var highlightedIcon = self.makeMarkerIcon('FFFF24');

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
          var venue = data.response.venue;
          var content = '<div> No Info on this location</div>';
          if (venue) {
            var nameLink  = (venue.name) ? '<a href="' + venue.shortUrl + '">' + venue.name + '</a>' : 'No Venue Name Is Available';
            var bestPhotoSrc =
              (venue.bestPhoto && venue.bestPhoto.prefix && venue.bestPhoto.suffix) ? 
                '<img src="' + venue.bestPhoto.prefix + "200x100" + venue.bestPhoto.suffix + '"/>': 
                'No Image Is Available';
            var ratingStr = (venue.rating) ? "rating: " + venue.rating + "/10" : "rating: no rating yet";
            content = '<div>' + nameLink + '</div>';
            content = content + '<div>' + bestPhotoSrc + '</div>'; 
            content = content + '<div>' + ratingStr + '</div>';
          }
          content = content + '<img src="img/Powered-by-Foursquare-full-color-small.png"/>';
          infowindow.setContent(content);
        },
        error: function() {
          infowindow.setContent('<div>Service Temporary Unavailable.</div><div>Please Try Again Later.</div>');
        }

      });

      // Open the infowindow on the correct marker.
      infowindow.open(map, marker);
    }
  };

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
  };

  this.filterKeyword = ko.observable('');

  this.showListing = function() {
    self.locations().forEach(function(location) {
      location.marker.setMap(null);
    });
    self.filteredLocations().forEach(function(location) { 
      location.marker.setMap(self.map);
      self.bounds.extend(location.marker.position);
    });
    self.map.fitBounds(self.bounds) ;
  };


  this.filteredLocations = ko.computed(function() {
    var filter = self.filterKeyword().toLowerCase();
    if (!filter) {
      return self.locations();
    } else {
      return ko.utils.arrayFilter(self.locations(), function(location) {
        return location.marker.title.toLowerCase().indexOf(filter) != -1;
      });
    }
  });

  this.showListing();
};

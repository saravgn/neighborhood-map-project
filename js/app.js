"use strict";

function init() {
    
    self = this;

    var MapViewModel = function() {

        //map options
        self.mapOptions = {
            zoom: 12,
            center: {lat: -33.861212, lng: 151.210691},
            // Adding Controls to the Map
            zoomControl: true,
            mapTypeControl: true,
            scaleControl: true,
            streetViewControl: true,
            rotateControl: true,
            fullscreenControl: true
        };
        
        self.map = new google.maps.Map(document.getElementById("map"), mapOptions);
        var infowindow = null;

        // sidneyMarkers grouped by categories
        self.beaches = ko.observableArray([
            { name: "Bondi Beach", lat: -33.890542, lng:151.274856, z:4},
            { name: "Coogee Beach", lat: -33.923036, lng:151.259052, z:5},
            { name: "Cronulla Beach", lat: -34.055286, lng:151.154942, z:3},
            { name: "Manly Beach", lat: -33.80010128657071, lng:151.28747820854187, z:2},
            { name: "Maroubra Beach", lat: -33.950198, lng:151.259302, z:1}
        ]);

        // icon for beach markers
        self.imageBeaches = {
            url: 'https://discoverycove.com/~/media/upload/icon-star-red.ashx?h=38&la=en&w=37',
            // scaledSize: new google.maps.Size(55, 55)
        };

        self.parks = ko.observableArray([
            { name: "Sydney Olympic Park", lat: -33.890542, lng:151.274856, z:3},
            { name: "Hide Park", lat: -33.872325, lng:151.210748, z:2},
            { name: "Royal Botanic Garden", lat: -33.864362, lng:151.218335, z:1}
        ]);

        self.imageParks = {
            url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            scaledSize: new google.maps.Size(55, 55)
        };

        self.attractions = ko.observableArray([
            { name: "Sea life Acquarium", lat: -33.869717, lng:151.202304, z:3},
            { name: "Luna Park", lat: -33.847930, lng:151.210021, z:2},
            { name: "Madame Tussouds", lat: -33.869408, lng:151.201819, z:1}
        ]);

        self.imageAttractions = {
            url: 'http://365psd.com/images/previews/8c4/waving-flag-icon-psd-image-2361flag-icon-512.png',
            scaledSize: new google.maps.Size(40, 40)
        };
        
        // Shapes define the clickable region of the icon.
        self.shape = {
            // coords: [1, 1, 1, 20, 18, 20, 18, 1],
            coords: [2, 2, 2, 40, 38, 40, 38, 3],
          type: 'poly'
        };

        self.marker;
        self.sidneyMarkers = ko.observableArray();
        self.currentMarkerName = ko.observable('Choose a marker to see ʘ‿ʘ');
        
        // add markers to the map
        function setIconsidneyMarkers(sidneyMarkersArray,image){
            for (var i = 0; i < sidneyMarkersArray().length; i++) {
                var beach = sidneyMarkersArray()[i];
                self.marker = new google.maps.Marker({
                  position: {lat: beach.lat, lng: beach.lng},
                  map: self.map,
                  icon: image,
                  shape: shape,
                  title: beach.name,
                  zIndex: beach.z,
                  mark_id: beach.name    
                });

                //click on marker action with closure
                marker.addListener('click', (function(markerCopy) {
                    return function(){
                        if(infowindow){
                            infowindow.close();
                        }
                        markerCopy.setAnimation(google.maps.Animation.BOUNCE);
                        setTimeout(function() {
                                markerCopy.setAnimation("");
                        }, 1500);
                        self.currentMarkerName(markerCopy.title);
                        var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=300x200&location=' + markerCopy.title + '';
                        // open windows for marker information on click from Google API
                        infowindow = new google.maps.InfoWindow({
                        content: '<div id="content">'+
                                        '<div id="siteNotice">'+
                                        '<h2 id="firstHeading" class="firstHeading">City: ' + markerCopy.title + '</h2>' +
                                        '</div>'+
                                        '<div id="bodyContent">'+
                                        '<img class="bgimg" src="' + streetviewUrl + '">'+
                                        '<br>'+
                                        '<h1>' + 'Position: ' + markerCopy.position + '</h1>'+
                                        '</div>'+
                                        '</div>'
                        });
                        infowindow.open(map, markerCopy); 
                        self.animate(this.name, this);
                    };
                })(marker));

                self.sidneyMarkers.push(self.marker);
            };
        };
        setIconsidneyMarkers(beaches, imageBeaches);
        setIconsidneyMarkers(parks, imageParks);
        setIconsidneyMarkers(attractions, imageAttractions);

        

        //search menu
        self.search = ko.observable('');
        var selectedMarker = null;

        self.onClickMarker = function(searchId) {
            self.animate(searchId, null);
        };
        
        self.animate = function(searchId, marker) {            
                self.sidneyMarkers().forEach(function(currentmarker) {
                    if (currentmarker.mark_id === searchId) {
                        selectedMarker = currentmarker;
                        currentmarker.setAnimation(google.maps.Animation.BOUNCE);
                        var currentIcon = currentmarker.getIcon();
                        currentmarker.setIcon('http://img03.deviantart.net/a031/i/2004/311/3/c/taz_by_abovetheflames.gif');   
                        self.map.setCenter(currentmarker.getPosition());
                        setTimeout(function() {
                                currentmarker.setAnimation("");
                                currentmarker.setIcon(currentIcon);
                        }, 2500);
                    }
                });
        };

        // OTHER FUNCTIONALITIES for menu list sidneyMarkers
        self.visibleBeaches = ko.observable(true);
        self.visibleParks = ko.observable(true);
        self.visibleAttractions = ko.observable(true);

        // self.setVisibilityBeachesTrue = function(){
        //     self.visibleBeaches(false);
        //     // console.log(visibleBeaches());
        //     return false;
        // };

        // self.setVisibilityParksTrue = function(){
        //     self.visibleParks(false);
        //     // console.log(visibleParks());
        //     return false;
        // };

        // self.setVisibilityAttractionsTrue = function(){
        //     self.visibleAttractions(false);
        //     // console.log(visibleAttractions());
        //     return false;
        // };

        // // make the menu visible
        // self.resetVisibility = function () {
        //     self.visibleBeaches(true);
        //     self.visibleParks(true);
        //     self.visibleAttractions(true);
        // };

        // chosen marker detail
        // self.currentMarkerName = ko.observable();
        // self.currentMarkerLat = ko.observable();
        // self.currentMarkerLng = ko.observable();
        // self.currentMarkerZ = ko.observable();

        // function setCurrentMarkerDetail(marker){
        //     self.currentMarkerName(marker.name);
        //     self.currentMarkerLat(marker.lat);
        //     self.currentMarkerLng(marker.lng);
        //     self.currentMarkerZ(marker.z);
        // };

        // self.onClickBeaches = function (marker) {
        //     self.setVisibilityAttractionsTrue();
        //     self.setVisibilityParksTrue();
        //     setCurrentMarkerDetail(marker);
        // };

        // // those are required to execute double 
        // // function with knockout
        // self.onClickAttractions = function (marker) {
        //     self.setVisibilityBeachesTrue();
        //     self.setVisibilityParksTrue();
        //     setCurrentMarkerDetail(marker);
        // };

        // self.onClickParks = function (marker) {
        //     self.setVisibilityBeachesTrue();
        //     self.setVisibilityAttractionsTrue();
        //     setCurrentMarkerDetail(marker);
        // };

        // takes the user input name for marker and searches in the 
        // list of markers, if there is a marker with that name 
        // it makes it visible to the user
        self.search.subscribe(function(chosenMarkerName) {
            chosenMarkerName = chosenMarkerName.toLowerCase();
            var mod = false;
            ko.utils.arrayForEach(self.sidneyMarkers(), function(sidneyMarker) {
                var markerTitleLC = sidneyMarker.title.toLowerCase();
                if (markerTitleLC.search(chosenMarkerName) === -1) {
                    if (sidneyMarker.getVisible() === true) {
                        mod = true;
                    }
                    sidneyMarker.setVisible(false);
                } else {
                    if (sidneyMarker.getVisible() === false) {
                        mod = true;
                    }
                    sidneyMarker.setVisible(true);
                }
            });
            if (mod === true) {
                var smarkers = self.sidneyMarkers().slice(0);
                self.sidneyMarkers([]);
                self.sidneyMarkers(smarkers);
            }
        });
    };
    // Activates knockout
    var mapview = new MapViewModel();
    ko.applyBindings(mapview);
};




    
    






    



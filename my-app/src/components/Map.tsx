import L from 'leaflet'

var truckIcon = L.icon({
    iconUrl: 'https://sunshine-autos.ucoz.com/_ld/0/75951138.png',
    iconSize:     [58, 49], 
  });

var truckIcon1 = L.icon({
    iconUrl: 'https://i.imgur.com/puSMlJB.png',
    iconSize:     [58, 49], 
  });


export var trucksIcons = new Array();
trucksIcons[0] = truckIcon;
trucksIcons[1] = truckIcon1;


export var startIcon = L.icon({
    iconUrl: 'https://pixelartmaker-data-78746291193.nyc3.digitaloceanspaces.com/image/18e8ade00a66467.png',
    iconSize: [45,30],
});

export var destinationIcon = L.icon({
    iconUrl: 'https://cdn.picpng.com/flag/flag-icon-flag-icon-destination-53089.png',
    iconSize: [45,30],
});
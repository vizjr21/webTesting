"use strict";

function initMap() {
  const myLatLng = {
    lat: 52.63842010498047,
    lng: -1.1509653329849243
  };
  const map = new google.maps.Map(document.getElementById("gmp-map"), {
    zoom: 12,
    center: myLatLng,
    fullscreenControl: false,
    zoomControl: true,
    streetViewControl: false
  });
  new google.maps.Marker({
    position: myLatLng,
    map,
    title: "My location"
  });
}
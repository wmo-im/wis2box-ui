<template>
  <section id="home-map">
    <l-map
      ref="wisMap"
      :zoom="zoom"
      :center="center"
      :bounds="bounds"
      style="height: 80vh"
    >
      <l-geo-json :geojson="geojson" :options="geojsonOptions"></l-geo-json>
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    </l-map>
  </section>
</template>

<script>
import { circleMarker, geoJSON } from "leaflet/dist/leaflet-src.esm";
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LGeoJson } from "@vue-leaflet/vue-leaflet";

let oapi = import.meta.env.VITE_APP_OAPI;

export default {
  name: "Home",
  components: {
    LMap,
    LTileLayer,
    LGeoJson,
  },
  data() {
    return {
      bounds: [
        [42, -142],
        [84, -52],
      ],
      geojson: null,
      geojsonLayer: geoJSON(null, null),
      geojsonOptions: {
        onEachFeature: function (feature, layer) {
          layer.bindPopup(
            '<a target="_window_url" href="' +
              feature.properties.url +
              '">' +
              feature.properties.name +
              "</a>"
          );
        },
        pointToLayer: function (feature, latLng) {
          // style markers according to properties
          let fillColor;
          let lineColor;
          switch (feature.properties.status) {
            case "operational":
              fillColor = "SpringGreen";
              lineColor = "SeaGreen";
              break;
            case "nonReporting":
              fillColor = "Salmon";
              lineColor = "FireBrick";
              break;
            case "closed":
              fillColor = "SlateGrey";
              lineColor = "DimGrey";
              break;
            default:
              // undefined status
              fillColor = "Tan";
              lineColor = "Sienna";
          }
          const markerStyle = {
            radius: 10,
            fillColor: fillColor,
            color: lineColor,
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
          };
          return circleMarker(latLng, markerStyle);
        },
      },
      attribution:
        '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      center: [0, 0],
      zoom: 1,
    };
  },
  async created() {
    this.loading = true;
    const response = await fetch(
      oapi + "/collections/stations/items?f=json"
    );
    const data = await response.json();
    this.geojson = data;

    // update bounds
    this.bounds = geoJSON(this.geojson).getBounds();
    this.loading = false;
  },
};
</script>
<template>
  <section id="home-map">
    <p>
      <l-map ref="map" v-model="zoom" :center="center" :bounds="bounds" style="height:80vh">
        <l-geo-json :geojson="geojson" :options="geojsonOptions">
        </l-geo-json>
        <l-tile-layer :url="url" :attribution="attribution"/>
      </l-map>
    </p>
  </section>
</template>

<script>
import "leaflet/dist/leaflet.css"
import { LMap, LTileLayer, LGeoJson } from "@vue-leaflet/vue-leaflet";

let oapi = process.env.VUE_APP_OAPI;

export default {
  name: "Home",
  components: {
    LMap,
    LTileLayer,
    LGeoJson
  },
  data() {
    return {
      bounds: [],
      geojson: null,
      geojsonOptions: {
        onEachFeature: function(feature, layer) {
          layer.bindPopup('<a target="_window_url" href="' + feature.properties.url + '">' + feature.properties.name + '</a>');
        },
      },
      optionsStyle: {
        style: function(feature) {
          let color;
          switch (feature.properties.status) {
            case 'operational':
              color = 'green';
              break;
            case 'nonReporting':
              color = 'red';
              break;
            case 'closed':
              color = 'grey';
              break;
            }
          return {'color': color, 'weight': 21};
        }
      },
      attribution: "&copy; <a href=\"https://osm.org/copyright\">OpenStreetMap</a> contributors",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      center: [0, 0],
      zoom: 1
    };
  },
  async beforeMount() {
    const { circleMarker } = await import("leaflet/dist/leaflet-src.esm");

    // And now the Leaflet circleMarker function can be used by the options:
    this.geojsonOptions.pointToLayer = (feature, latLng) =>
      circleMarker(latLng, { radius: 8 });
    this.mapIsReady = true;
  },
  async created() {
    this.loading = true;
    const response = await fetch(oapi + "/collections/stations/items?f=json")
    const data = await response.json();
    this.geojson = data;
    this.bounds = [[42, -142],[84, -52]];
//    this.bounds = this.geojson.getBounds();
    this.loading = false;
  }
};

</script>

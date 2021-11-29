<template id="home">
  <v-container>
    <h1>{{ $t("messages.welcome") }}</h1>
  </v-container>
  <div :style="{ visibility: loading ? 'visible' : 'hidden' }">
    <v-progress-linear striped indeterminate color="primary" />
  </div>
  <div
    :style="{ visibility: !loading ? 'visible' : 'hidden' }"
    class="text-center"
    id="home-map"
  >
    <p>
      <l-map
        ref="wisMap"
        :zoom="zoom"
        :center="center"
        :bounds="bounds"
        style="height: 80vh"
      >
        <l-geo-json
          :geojson="geojson"
          :options="geojsonOptions"
          @click="mapClick"
        ></l-geo-json>
        <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      </l-map>
    </p>
    <chart-dialog :feature="feature" />
  </div>
</template>

<script>
import { circleMarker, geoJSON } from "leaflet/dist/leaflet-src.esm";
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LGeoJson } from "@vue-leaflet/vue-leaflet";
import ChartDialog from "../components/ChartDialog.vue";

let oapi = process.env.VUE_APP_OAPI;

export default {
  name: "Home",
  template: "#home",
  components: {
    LMap,
    LTileLayer,
    LGeoJson,
    ChartDialog,
  },
  data: function () {
    return {
      bounds: [
        [42, -142],
        [84, -52],
      ],
      geojson: null,
      geojsonLayer: geoJSON(null, null),
      geojsonOptions: {
        onEachFeature: function (feature, layer) {
          layer.bindTooltip(feature.properties.name);
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
      feature: {
        station: null,
        datastreams: [],
      },
    };
  },
  async created() {
    this.loading = true;
    const response = await fetch(
      oapi + "/collections/stations/items?f=json&limit=100"
    );
    const data = await response.json();
    this.geojson = data;

    // update bounds
    this.bounds = geoJSON(this.geojson).getBounds();
    this.loading = false;
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    mapClick(e) {
      console.log(e);
      e.originalEvent.stopPropagation();
      console.log(this.feature);
      this.feature.station = e.layer.feature;
      this.feature.datastreams.length = 0;
      for (const dstream of e.layer.feature.properties.Datastreams) {
        const dstream_id = dstream.split("/").pop();
        this.feature.datastreams.push(dstream_id);
      }
      console.log(this.feature);
      this.$root.toggleDialog();
    },
  },
};
</script>

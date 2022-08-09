<template id="dataset-map">
  <div class="dataset-map">
    <div :style="{ visibility: loading ? 'visible' : 'hidden' }">
      <v-progress-linear striped indeterminate color="primary" />
    </div>
    <div
      :style="{ visibility: !loading ? 'visible' : 'hidden' }"
      class="text-center"
    >
      <l-map
        :ref="dataset.id"
        :zoom="zoom"
        :center="center"
        :options="{ zoomControl: false }"
        style="height: 160px; width: 256px"
        @ready="onReady()"
      >
        <l-geo-json :geojson="dataset" />
        <l-tile-layer :url="url" :attribution="attribution" />
      </l-map>
    </div>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import { latLngBounds } from "leaflet/dist/leaflet-src.esm";
import { LMap, LTileLayer, LGeoJson } from "@vue-leaflet/vue-leaflet";

export default {
  name: "datasets",
  template: "#datasets",
  components: {
    LMap,
    LTileLayer,
    LGeoJson,
  },
  props: ["dataset"],
  data: function () {
    return {
      loading: false,
      zoom: 0,
      center: [0, 0],
      attribution:
        '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    };
  },
  methods: {
    onReady() {
      this.$nextTick(() => {
        this.map = this.$refs[this.dataset.id]["leafletObject"];
        this.loadDataset();
      });
    },
    async loadDataset() {
      this.loading = true;
      let [x1, y1, x2, y2] = [
        this.dataset.geometry.coordinates[0][0][0],
        this.dataset.geometry.coordinates[0][0][1],
        this.dataset.geometry.coordinates[0][2][0],
        this.dataset.geometry.coordinates[0][2][1],
      ];

      this.center = [(y2 + y1) / 2, (x2 + x1) / 2];
      var bounds = latLngBounds([
        [x1, y1],
        [x2, y2],
      ]);
      this.map.fitBounds(bounds);
      this.loading = false;
    },
  },
};
</script>

<template id="dataset-map">
  <div class="dataset-map">
    <div v-if="loading">
      <v-progress-linear striped indeterminate color="primary" />
    </div>
    <div v-show="!loading">
      <l-map :ref="dataset.id" :center="center" :options="options" :maxZoom="16" style="height: 160px; width: 256px"
        @ready="onReady()">
        <l-geo-json :geojson="dataset" />
        <l-tile-layer :url="url" />
      </l-map>
    </div>
  </div>
</template>

<script lang="ts">
import "leaflet/dist/leaflet.css";
import { geoJSON } from "leaflet";
import { LMap, LTileLayer, LGeoJson } from "@vue-leaflet/vue-leaflet";
import { defineComponent } from "vue";

export default defineComponent({
  name: "DatasetMap",
  components: {
    LMap,
    LTileLayer,
    LGeoJson,
  },
  props: ["dataset"],
  data: function () {
    return {
      loading: false,
      center: [0, 0],
      options: {
        zoomControl: false,
        doubleClickZoom: false,
        dragging: false,
        zoomSnap: 0.25,
      },
      url: window.VUE_APP_BASEMAP_URL,
    };
  },
  methods: {
    onReady() {
      this.loading = true;
      this.$nextTick(() => {
        this.map = this.$refs[this.dataset.id]["leafletObject"];
        this.map.fitBounds(geoJSON(this.dataset).getBounds());
        this.map.zoomOut(0.25);
        this.map.setMinZoom(this.map.getZoom());
        this.map.setMaxZoom(this.map.getZoom());
        this.map.attributionControl.setPrefix("");
        this.loading = false;
      });
    },
  },
});
</script>

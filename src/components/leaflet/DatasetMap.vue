<script setup lang="ts">
import { defineProps } from "vue";
import type { Dataset } from "@/lib/types";

defineProps<{ dataset: Dataset }>();

</script>

<template>
  <div v-if="loading">
    <v-progress-linear striped indeterminate color="primary" />
  </div>
  <div v-show="!loading">
    <l-map :ref="dataset.id" :center="center" :options="options" :maxZoom="16" style="height: 160px; width: 256px"
      @ready="onReady()">
      <l-geo-json :geojson="dataset.geometry" />
      <l-tile-layer :url="url" />
    </l-map>
  </div>
</template>

<script lang="ts">
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LGeoJson } from "@vue-leaflet/vue-leaflet";
import type { LatLngBounds, Map } from "leaflet";
import L from "leaflet";

export default {
  components: {
    LMap,
    LTileLayer,
    LGeoJson,
  },
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
      map: null as unknown as Map,
      url: window.VUE_APP_BASEMAP_URL,
    };
  },
  methods: {
    onReady() {
      this.loading = true;
      this.$nextTick(() => {
        this.map = this.$refs[this.dataset.id]["leafletObject"];
        this.map.fitBounds(L.geoJSON(this.dataset.geometry).getBounds());
        this.map.attributionControl.setPrefix("");
        this.loading = false;
      });
    },
  },
};
</script>

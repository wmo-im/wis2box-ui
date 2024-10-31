<script setup lang="ts">
import { defineProps } from "vue";
import type { Dataset } from "@/lib/types";

defineProps<{ dataset: Dataset }>();

</script>

<template>
  <div v-if="loading">
    <v-progress-linear striped indeterminate color="primary" />
    loading
  </div>
  <div v-show="!loading">
    <l-map :ref="dataset.id" :center="center" :options="options" :maxZoom="16" style="height: 160px; width: 256px"
      @ready="onReady">
      <l-geo-json :geojson="dataset.geometry" />
      <l-tile-layer :url="url" />
    </l-map>
  </div>
</template>

<script lang="ts">
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LGeoJson } from "@vue-leaflet/vue-leaflet";
import type { Map } from "leaflet";
import L from "leaflet";

export default {
  components: {
    LMap,
    LTileLayer,
    LGeoJson,
  },
  data: function () {
    return {
      loading: true,  // Initially set loading to true
      center: [0, 0] as [number, number], // center is a tuple of [lat, lng]
      options: {
        zoomControl: false,
        doubleClickZoom: false,
        dragging: false,
        scrollWheelZoom: false,  // Disable scroll wheel zoom
        zoomSnap: 0.25,
      },
      map: null as unknown as Map,
      url: window.VUE_APP_BASEMAP_URL,
    };
  },

  mounted() {
    setTimeout(function () { window.dispatchEvent(new Event('resize')) }, 250);
  },
  methods: {
    onReady() {
      this.$nextTick(() => {
        this.map = this.$refs[this.dataset.id]["leafletObject"];
        this.map.fitBounds(L.geoJSON(this.dataset.geometry).getBounds());
        this.map.attributionControl.setPrefix("");
        this.map.zoomIn(4);
        this.loading = false;  // Set loading to false once the map is ready
      });
    },
  },
};
</script>

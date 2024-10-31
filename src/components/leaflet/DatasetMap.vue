<!-- This component displays a single simple map for a given station/dataset. It is intended to give the user a brief overview and does not
  show any datapoints / labels.
-->

<script setup lang="ts">
import { defineProps, ref, onMounted, nextTick } from "vue";
import type { Dataset } from "@/lib/types";
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LGeoJson } from "@vue-leaflet/vue-leaflet";
import type { Map } from "leaflet";
import L from "leaflet";

const props = defineProps<{ dataset: Dataset }>();

const loading = ref(true);
const center = ref<[number, number]>([0, 0]); // center is a tuple of [lat, lng]
const options = {
  zoomControl: false,
  doubleClickZoom: false,
  dragging: false,
  scrollWheelZoom: false, // Disable scroll wheel zoom
  zoomSnap: 0.25,
};
const map = ref<Map | null>(null);
const url = window.VUE_APP_BASEMAP_URL;

// Create a ref for the map component
const mapRef = ref<InstanceType<typeof LMap> | null>(null);

onMounted(() => {
  // Trigger a resize event after a brief delay. Needed to fix a vue leaflet bug: https://github.com/vue-leaflet/Vue2Leaflet/issues/96
  setTimeout(() => window.dispatchEvent(new Event("resize")), 250);
});

const onReady = () => {
  nextTick(() => {
    if (mapRef.value && mapRef.value["leafletObject"]) {
      map.value = mapRef.value["leafletObject"];
      if (map.value) {
        map.value.fitBounds(L.geoJSON(props.dataset.geometry).getBounds());
        map.value.attributionControl.setPrefix("");
        map.value.zoomIn(4);
        loading.value = false;
      }
    }
    else {
      console.error("Map ref not found");
    }
  });
};
</script>

<template>
  <div v-if="loading">
    <v-progress-linear striped indeterminate color="primary" />
  </div>
  <div v-show="!loading">
    <l-map ref="mapRef" :center="center" :options="options" :maxZoom="16" style="height: 160px; width: 256px"
      @ready="onReady">
      <l-geo-json :geojson="dataset.geometry" />
      <l-tile-layer :url="url" />
    </l-map>
  </div>
</template>

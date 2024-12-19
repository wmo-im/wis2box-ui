<script setup lang="ts">
import { defineProps, ref, onMounted, nextTick } from "vue";
import type { Dataset } from "@/lib/types";
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LGeoJson } from "@vue-leaflet/vue-leaflet";
import L, { type PointTuple } from "leaflet";

const props = defineProps<{ dataset: Dataset }>();

const loading = ref(true);
const url = window.VUE_APP_BASEMAP_URL;
const zoom = 1; 
const geoJsonRef = ref<typeof LGeoJson | null>(null); // Ref to the LGeoJson component

onMounted(async () => {
  loading.value = true;
  await nextTick();
  loading.value = false;
});

const onMapReady = (map: L.Map) => {
  if (props.dataset.geometry) {
    const geoJsonLayer = L.geoJSON(props.dataset.geometry); 
    geoJsonLayer.addTo(map); 

    const bounds = geoJsonLayer.getBounds();
    if (bounds.isValid()) {
      const padding: PointTuple = [3, 3];
      map.fitBounds(bounds, { padding }); 
    }
    
    // Make the map static so it just shows the bbox
    // If the user wants to interact with the map, they should click into the WisMap component
    map.attributionControl.remove();
    map.zoomControl.remove();
    map.invalidateSize();
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();

    // this is needed to handle the case where the bounds stretch to the end of the map
    // for instance for the bbox of the entire northern hemisphere.
    // without this, there may be gray borders at the edge of the map
    map.setMaxBounds([
    [ -90, -180 ],
    [ 90, 180 ]    
  ]);

  }
};
</script>

<template>
  <div v-if="loading">
    <v-progress-linear striped indeterminate color="primary" />
  </div>
  
  <LMap 
    :zoom="zoom" 
    :maxZoom="16" 
    style="height: 160px; width: 256px" 
    @ready="onMapReady"
  >
    <LTileLayer :url="url" />
    
    <LGeoJson ref="geoJsonRef" :geojson="props.dataset.geometry" />
  </LMap>
</template>

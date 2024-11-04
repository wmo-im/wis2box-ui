<!-- WisMap displays a leaflet map with all the stations labeled on it -->

<script setup lang="ts">
defineProps({
  params: Object,
  features: Object,
})
</script>

<template id="wis-map">
  <v-progress-linear v-if="loading" striped indeterminate color="primary" />
  <div class="text-center">
    <v-row justify="center" fill-height no-gutters>
      <v-col :cols="smAndDown ? 12 : 4" :order="smAndDown ? 'last' : 'start'">
        <station-info :features="features" :map="map" class="ma-1" />
      </v-col>
      <v-col :cols="smAndDown ? 12 : 8">
        <v-card class="ma-1">
          <l-map ref="wisMap" :zoom="zoom" :center="center" :maxZoom="16" :minZoom="2" style="height: 60vh"
            @ready="onReady()">
            <template v-if="!loading">
              <WisStation :features="features" :map="map" />
            </template>
            <l-tile-layer :url="url" :attribution="attribution" />
            <l-control position="bottomleft">
              <v-card width="124px" class="legend pa-2" border="1">
                <strong>{{ $t("messages.no_of_observations") }}</strong>
                <v-divider class="my-2" />
                <v-row no-gutters justify="center" v-for="(item, i) in legend" :key="i">
                  <v-col cols="3">
                    <i class="dot" :style="`background: ${item.color}`" />
                  </v-col>
                  <v-col>{{ item.range }}</v-col>
                </v-row>
              </v-card>
            </l-control>
          </l-map>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import "leaflet/dist/leaflet.css";
import { geoJSON } from "leaflet";
import { LControl, LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";

import WisStation from "../station/WisStation.vue";
import StationInfo from "../station/StationInfo.vue";

import { defineComponent } from "vue";
import type { Map } from "leaflet";
import { catchAndDisplayError } from "@/lib/errors";

export default defineComponent({
  components: {
    LControl,
    LMap,
    LTileLayer,
    WisStation,
    StationInfo,
  },
  data() {
    return {
      loading: true,
      map: undefined as unknown as Map, // TODO: Type this properly
      features_: this.features,
      center: [0, 0] as [number, number],
      zoom: 1,
      attribution: window.VUE_APP_BASEMAP_ATTRIBUTION,
      url: window.VUE_APP_BASEMAP_URL,
      legend: [
        { color: "#009900", range: "20 or more" },
        { color: "#FF9900", range: "8 - 19" },
        { color: "#FF3300", range: "1 - 7" },
        { color: "#708090", range: "None" },
      ],
    };
  },
  computed: {
    smAndDown() {
      return this.$vuetify.display.smAndDown;
    },
  },
  methods: {
    onReady() {
      this.$nextTick(() => {
        this.map = this.$refs.wisMap.leafletObject;
        this.map.attributionControl.setPrefix("");
        this.map.zoomControl.setPosition("topright");
        this.loadStations(); // Start loading stations on map ready
      });
    },
    async loadStations() {
      this.loading = true; // Set loading to true before fetching data
      try {
        const response = await fetch(`${window.VUE_APP_OAPI}/processes/station-info/execution`, {
          method: "POST",
          body: JSON.stringify({ inputs: this.params }),
        });
        if (response.ok) {
          const data = await response.json();
          this.features_.stations = data.value; // Update features with fetched data

          const bounds_ = geoJSON(this.features_.stations).getBounds();
          this.map.fitBounds(bounds_); // Fit map bounds to the fetched stations
        } else {
          const errorText = await response.text();
          console.error(`Error: ${errorText}`);
          catchAndDisplayError(`${this.$t("messages.does_not_exist")}: ${this.$t("messages.how_to_link_station")}`);
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false; // Reset loading state after fetch completes
      }
    },
  },
});
</script>

<style scoped>
.legend .dot {
  height: 16px;
  width: 16px;
  display: inline-block;
  border-radius: 50%;
  opacity: 0.8;
}
</style>

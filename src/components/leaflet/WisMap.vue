<!-- WisMap displays a leaflet map with all the stations labeled on it -->

<template id="wis-map">
  <v-progress-linear v-if="loading" striped indeterminate color="primary" />
  <div class="text-center">
    <v-row justify="center" fill-height no-gutters>
      <v-col :cols="smAndDown ? 12 : 4" :order="smAndDown ? 'last' : 'start'" v-if="map !== undefined">
        <StationInfo :topic="topic" :features="features" :map="map" class="ma-1" />
      </v-col>
      <v-col :cols="smAndDown ? 12 : 8">
        <v-card class="ma-1">
          <l-map ref="wisMap" :zoom="zoom" :center="center" :maxZoom="16" :minZoom="2" style="height: 60vh"
            @ready="onReady()">
            <template v-if="!loading">
              <!-- @vue-expect-error types not correct for map in underlying library -->
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

import { type PropType } from "vue";

import "leaflet/dist/leaflet.css";
import { geoJSON } from "leaflet";
import { LControl, LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";

import WisStation from "../station/WisStation.vue";
import StationInfo from "../station/StationInfo.vue";

import { defineComponent } from "vue";
import type { Map } from "leaflet";
import { LegendColors, type ItemsResponse } from "@/lib/types";

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
      center: [0, 0] as [number, number],
      zoom: 1,
      attribution: window.VUE_APP_BASEMAP_ATTRIBUTION,
      url: window.VUE_APP_BASEMAP_URL,
      legend: [
        { color: LegendColors.Green, range: "20 or more" },
        { color: LegendColors.Yellow, range: "8 - 19" },
        { color: LegendColors.Red, range: "1 - 7" },
        { color: LegendColors.Gray, range: "None" },
      ],
    };
  },
  props: {
    features: {
      type: Object as PropType<ItemsResponse>,
      required: true
    },
    topic: {
      type: String,
      required: true
    }
  },
  computed: {
    smAndDown() {
      return this.$vuetify.display.smAndDown;
    },
  },
  created() {
    // Ensure that features prop is properly set
    if (!this.features || !this.features.features) {
      console.error("Features prop is not properly set:", this.features);
    }
  },
  methods: {
    onReady() {
      this.$nextTick(() => {
        this.loading = true;
        // @ts-expect-error map ref is not typable
        this.map = this.$refs.wisMap["leafletObject"];
        this.map.attributionControl.setPrefix("");
        this.map.zoomControl.setPosition("topright");

        const bounds_ = geoJSON(this.features).getBounds();
        this.map.fitBounds(bounds_); // Fit map bounds to the fetched stations\
        this.loading = false;
      });
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

<template id="wis-map">
  <div class="wis-map">
    <div :style="{ visibility: loading ? 'visible' : 'hidden' }">
      <v-progress-linear striped indeterminate color="primary" />
    </div>
    <div
      :style="{ visibility: !loading ? 'visible' : 'hidden' }"
      class="text-center"
    >
      <v-layout>
        <station-info :features="features" :map="map" />
        <v-row justify="center" fill-height>
          <v-main>
            <v-card class="ma-4">
              <p>
                <l-map
                  ref="wisMap"
                  :zoom="zoom"
                  :center="center"
                  maxZoom="16"
                  minZoom="3"
                  style="height: 60vh"
                  @ready="onReady()"
                >
                  <wis-station :features="features" :map="map" />
                  <l-tile-layer :url="url" :attribution="attribution" />
                </l-map>
              </p>
            </v-card>
          </v-main>
        </v-row>
      </v-layout>
    </div>
  </div>
</template>



<script>
import "leaflet/dist/leaflet.css";
import { geoJSON } from "leaflet/dist/leaflet-src.esm";
import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";

import WisStation from "./WisStation.vue";
import StationInfo from "./StationInfo.vue";

import { defineComponent } from "vue";

export default defineComponent({
  name: "WisMap",
  template: "#wis-map",
  components: {
    LMap,
    LTileLayer,
    WisStation,
    StationInfo,
  },
  props: ["params", "features"],
  data: function () {
    return {
      params_: {
        f: "json",
        limit: 10,
      },
      loading: true,
      map: undefined,
      features_: this.features,
      center: [0, 0],
      zoom: 1,
      attribution:
        '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    };
  },
  methods: {
    onReady() {
      this.$nextTick(() => {
        this.map = this.$refs.wisMap.leafletObject;
        this.map.zoomControl.setPosition("topright");
        this.loadStations();
      });
    },
    async loadStations() {
      this.loading = true;
      var self = this;
      await this.$http({
        method: "get",
        url: "/collections/stations/items",
        params: Object.assign({}, self.params_, self.params),
      })
        .then(function (response) {
          self.features_.stations = response.data;
        })
        .catch(function (error) {
          console.log(error);
        })
        .then(function () {
          self.loading = false;
        });
      var bounds_ = geoJSON(this.features_.stations).getBounds();
      this.map.fitBounds(bounds_);
    },
  },
});
</script>

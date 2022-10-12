<template id="wis-map">
  <div class="wis-map">
    <div v-if="loading || vals.loading">
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
                  minZoom="2"
                  style="height: 60vh"
                  @ready="onReady()"
                >
                  <wis-station :vals="vals" :features="features" :map="map" />
                  <l-tile-layer :url="url" :attribution="attribution" />
                  <l-control position="bottomright">
                    <v-card width="125px" class="legend pa-2">
                      <strong> {{ $t("messages.no_of_observations") }} </strong>
                      <v-divider class="my-2" />
                      <v-row
                        no-gutters
                        justify="center"
                        v-for="(item, i) in legend"
                        :key="i"
                      >
                        <v-col>
                          <i class="dot" :style="`background: ${item.color}`" />
                        </v-col>
                        <v-col>
                          {{ item.range }}
                        </v-col>
                      </v-row>
                    </v-card>
                  </l-control>
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
import { LControl, LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";

import WisStation from "../station/WisStation.vue";
import StationInfo from "../station/StationInfo.vue";
let oapi = window.VUE_APP_OAPI;

import { defineComponent } from "vue";

export default defineComponent({
  name: "WisMap",
  template: "#wis-map",
  components: {
    LControl,
    LMap,
    LTileLayer,
    WisStation,
    StationInfo,
  },
  props: ["params", "features"],
  data: function () {
    return {
      numberMatched: 0,
      limit_: null,
      vals: {
        loading: true,
      },
      loading: true,
      map: undefined,
      features_: this.features,
      center: [0, 0],
      zoom: 1,
      attribution: window.VUE_APP_BASEMAP_ATTRIBUTION,
      url: window.VUE_APP_BASEMAP_URL,
      legend: [
        {
          color: "#009900",
          range: "20 - 24",
        },
        {
          color: "#FF9900",
          range: "8 - 19",
        },
        {
          color: "#FF3300",
          range: "1 - 7",
        },
        {
          color: "#000000",
          range: "None",
        },
      ],
    };
  },
  computed: {
    params_: function () {
      return {
        f: "json",
        limit: this.limit_,
      };
    },
    items: function () {
      const opts = [10, 25, 50, 100, 150, 200];
      const items = new Set();

      for (const item of opts) {
        if (item < this.numberMatched) {
          items.add(item);
        }
      }
      items.add(this.numberMatched);
      return items;
    },
  },
  methods: {
    onReady() {
      this.$nextTick(() => {
        this.map = this.$refs.wisMap.leafletObject;
        this.map.attributionControl.setPrefix("");
        this.map.zoomControl.setPosition("topright");
        this.loadStations();
      });
    },
    async loadStations() {
      this.loading = true;
      var self = this;
      await this.$http({
        method: "get",
        url: `${oapi}/collections/stations/items`,
        params: Object.assign({}, self.params, self.params_),
      })
        .then(function (response) {
          self.features_.stations = response.data;
          self.numberMatched = response.data.numberMatched;
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

<style scoped>
.legend .dot {
  height: 16px;
  width: 16px;
  display: inline-block;
  border-radius: 50%;
  opacity: 0.8;
}
</style>

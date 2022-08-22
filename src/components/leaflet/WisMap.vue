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
                  minZoom="2"
                  style="height: 60vh"
                  @ready="onReady()"
                >
                  <wis-station :features="features" :map="map" />
                  <l-tile-layer :url="url" :attribution="attribution" />
                  <l-control position="bottomleft">
                    <v-card width="95px" max-height="40px">
                      <v-select
                        v-model="limit_"
                        :items="[10, 25, 50, numberMatched]"
                        :label="$t('station.limit')"
                        hide-details
                        density="compact"
                      />
                    </v-card>
                  </l-control>
                  <l-control position="bottomright">
                    <v-card width="125px" class="legend pa-2" >
                      <strong>
                      {{ $t("messages.no_of_observations") }}
                      </strong><br />
                      <template v-for="(item, i) in legend" :key="i">
                        <i :style="`background: ${item.color}`" />
                        {{ item.range }} <br />
                      </template>
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

import WisStation from "./WisStation.vue";
import StationInfo from "./StationInfo.vue";

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
      limit_: 500,
      loading: true,
      map: undefined,
      features_: this.features,
      center: [0, 0],
      zoom: 1,
      attribution:
        '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      legend: [
        {
          color: "SlateGrey",
          range: "None",
        },
        {
          color: "Salmon",
          range: "0 - 7",
        },
        {
          color: "Orange",
          range: "7 - 14",
        },
        {
          color: "Tan",
          range: "14 - 19",
        },
        {
          color: "SpringGreen",
          range: "19 - 24",
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
  },
  watch: {
    limit_: {
      handler() {
        this.loadStations();
      },
    },
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
.legend i {
  width: 18px;
  height: 18px;
  float: left;
  margin-right: 8px;
  opacity: 0.8;
}
</style>
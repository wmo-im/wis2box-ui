<template id="wis-map">
  <div class="wis-map">
    <div :style="{ visibility: loading ? 'visible' : 'hidden' }">
      <v-progress-linear striped indeterminate color="primary" />
    </div>
    <div
      :style="{ visibility: !loading ? 'visible' : 'hidden' }"
      class="text-center"
    >
      <p>
        <l-map
          ref="wisMap"
          :zoom="zoom"
          :center="center"
          maxZoom="16"
          style="height: 75vh"
          @ready="onReady()"
        >
          <wis-station :features="features" :map="map" :params="params" />
          <l-tile-layer :url="url" :attribution="attribution" />
        </l-map>
      </p>
    </div>
  </div>
</template>



<script>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";

import WisStation from "./WisStation.vue";

import { defineComponent } from "vue";

export default defineComponent({
  name: "WisMap",
  template: "#wis-map",
  components: {
    LMap,
    LTileLayer,
    WisStation,
  },
  props: ["params", "features"],
  data: function () {
    return {
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
        this.loading = false;
      });
    },
  },
});
</script>

<template id="station-info">
  <div class="station-info">
    <v-navigation-drawer permanent :width="400">
      <v-toolbar>
        <h3 class="text-no-wrap mx-4">
          {{ station_name || $t("chart.station") }}
        </h3>
        <v-spacer />
        <v-btn
          color="pink"
          icon
          v-show="station !== null"
          @click="features_.station = null"
        >
          X
        </v-btn>
      </v-toolbar>
      <v-divider />
      <v-card flat class="text-center" v-show="station === null">
        <station-list :features="features" :map="map" />
      </v-card>

      <v-card flat class="text-center" v-show="station !== null">
        <station-status :features="features" :map="map" />
      </v-card>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import StationList from "./StationList.vue";
import StationStatus from "./StationStatus.vue";

export default defineComponent({
  components: { StationList, StationStatus },
  name: "StationInfo",
  template: "#station-info",
  props: ["features", "map"],
  data() {
    return {
      features_: this.features,
    };
  },
  computed: {
    station: function () {
      return this.features_.station;
    },
    station_name: function () {
      if (this.station) {
        return this.station.properties.name;
      } else {
        return this.station;
      }
    },
  },
});
</script>

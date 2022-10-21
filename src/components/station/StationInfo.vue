<template id="station-info">
  <div class="station-info">
    <v-navigation-drawer permanent :width="400">
      <v-toolbar>
        <template v-slot:prepend>
          <v-toolbar-title class="ml-2">
            {{ station_name || $t("chart.station") }}
          </v-toolbar-title>
        </template>

        <template v-slot:append>
          <v-toolbar-items v-if="station !== null">
            <v-btn
              variant="outlined"
              size="small"
              color="#014e9e"
              :target="station.id"
              :title="station.id"
              :href="station.properties.url"
            >
              OSCAR
              <v-icon end icon="mdi-open-in-new"></v-icon>
            </v-btn>
            <v-btn color="pink" icon @click="features_.station = null">
              <v-icon icon="mdi-close"></v-icon>
            </v-btn>
          </v-toolbar-items>
        </template>
      </v-toolbar>

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

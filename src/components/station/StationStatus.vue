<template id="station-status">
  <div class="station-status">
    <v-tabs grow v-model="tab" color="#014e9e">
      <v-tab v-for="(item, i) in tabs" :value="i" :key="i">
        {{ $t(item) }}
      </v-tab>
    </v-tabs>
    <v-divider />
    <v-window v-model="tab">
      <v-window-item :value="0" eager>
        <station-latest :features="features" :map="map" />
      </v-window-item>
      <v-window-item :value="1" eager>
        <station-history :features="features" :map="map" />
      </v-window-item>
    </v-window>
    <div class="text-center ma-2">
      <v-snackbar v-model="snackbar">
        {{ msg }}
        <template v-slot:actions>
          <v-btn color="pink" @click="snackbar = false">
            <v-icon icon="mdi-close"></v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import StationHistory from "./StationHistory.vue";
import StationLatest from "./StationLatest.vue";

export default defineComponent({
  components: { StationLatest, StationHistory },
  props: ["features", "map"],
  data() {
    return {
      features_: this.features,
      snackbar: false,
      msg: "",
      tab: null,
      data: [],
      layout: {
        height: 300,
        width: 450,
        showlegend: false,
        xaxis: {
          type: "date",
        },
        yaxis: {
          dtick: 1,
        },
      },
      config: {
        displayModeBar: false,
        responsive: true,
      },
      tabs: ["station.latest", "station.status"],
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

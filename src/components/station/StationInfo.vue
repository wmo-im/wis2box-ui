<template id="station-info">
  <v-card flat height="60vh" class="scroll">
    <v-toolbar>
      <v-toolbar-title>
        {{ station_name || $t("chart.station") }}
      </v-toolbar-title>

      <template v-slot:prepend v-if="station !== null">
        <v-btn icon @click="features.station = null">
          <v-icon icon="mdi-arrow-left"></v-icon>
        </v-btn>
      </template>

      <template v-slot:append v-if="station != null">
        <v-btn variant="outlined" size="small" color="#014e9e" @click.stop="openData(station)" class="my-auto">
          {{ $t("navigation.data") }}
          <v-icon end icon="mdi-chart-scatter-plot" />
        </v-btn>
      </template>
    </v-toolbar>

    <v-card flat class="text-center" v-show="station === null">
      <station-list :features="features" :map="map" />
    </v-card>

    <v-card flat class="text-center" v-show="station !== null">
      <station-status :features="features" :map="map" />
    </v-card>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import StationList from "./StationList.vue";
import StationStatus from "./StationStatus.vue";
import { useGlobalStateStore } from "@/stores/global";

export default defineComponent({
  components: { StationList, StationStatus },
  props: ["features", "map"],
  computed: {
    station: function () {
      return this.features.station;
    },
    station_name: function () {
      if (this.station) {
        return this.station.properties.name;
      } else {
        return this.station;
      }
    },
  },
  methods: {
    openData(station: string) {
      const store = useGlobalStateStore();
      this.features.station = station;
      store.toggleDialog();
    },
  },
});
</script>

<style scoped>
.scroll {
  overflow-y: scroll;
}
</style>

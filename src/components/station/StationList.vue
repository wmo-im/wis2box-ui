<template id="station-list">
  <div class="station-list">
    <v-list>
      <v-hover v-slot="{ isHovering, props }">
        <template v-for="(s, i) in stations" :key="i">
          <v-list-item
            v-bind="props"
            lines="3"
            :class="{ 'on-hover': isHovering }"
            @click="onClick(s)"
            @mouseover="onHover(s)"
          >
            <template v-slot:title class="mx-1">
              <h4 v-html="clean(s.properties.name)" />
              <i class="dot" :style="`background: ${getColor(s)}`" />
            </template>
            <template v-slot:append>
              <v-btn
                variant="outlined"
                size="small"
                color="#014e9e"
                @click.stop="openData(s)"
                class="mr-1"
              >
                {{ $t("navigation.data") }}
                <v-icon end icon="mdi-chart-scatter-plot"></v-icon>
              </v-btn>
            </template>
          </v-list-item>
          <v-divider v-if="i+1 < stations.length" />
        </template>
      </v-hover>
    </v-list>
  </div>
</template>

<script>
import { defineComponent } from "vue";

import { clean } from "@/scripts/helpers.js";

export default defineComponent({
  name: "StationList",
  template: "#station-list",
  props: ["features", "map"],
  data() {
    return {
      features_: this.features,
    };
  },
  computed: {
    stations: function () {
      if (this.features.stations === null) {
        return [];
      } else {
        const stns = [...this.features.stations.features].sort((a, b) => {
          const nameA = a.properties.name.toUpperCase(); // ignore upper and lowercase
          const nameB = b.properties.name.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          } else if (nameA > nameB) {
            return 1;
          } else {
            return 0;
          }
        });
        return stns;
      }
    },
  },
  methods: {
    clean,
    onClick(station) {
      this.features_.station = station;
      const latlng = [
        station.geometry.coordinates[1],
        station.geometry.coordinates[0],
      ];
      this.map.flyTo(latlng);
    },
    onHover(station) {
      const latlng = [
        station.geometry.coordinates[1],
        station.geometry.coordinates[0],
      ];
      this.map.openPopup(station.properties.name, latlng);
    },
    openData(station) {
      this.features_.station = station;
      this.$root.toggleDialog();
    },
    getColor(station) {
      let hits = station.properties.num_obs;
      if (hits === 0) {
        return "#708090";
      } else if (hits <= 7) {
        return "#FF3300";
      } else if (hits <= 19) {
        return "#FF9900";
      } else {
        return "#009900";
      }
    },
  },
});
</script>

<style scoped>
.dot {
  height: 16px;
  width: 16px;
  display: inline-block;
  border-radius: 50%;
  opacity: 0.8;
}
</style>
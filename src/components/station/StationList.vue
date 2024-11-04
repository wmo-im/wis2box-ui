THe station list component represents the list of all stations which you can click into in order to get the latest
values and history
<script setup lang="ts">

// props: ["features", "map"],

defineProps<{
  stations: ItemsResponse;
  map: any;
}>();

</script>

<template id="station-list">
  <v-list>
    <v-hover v-slot="{ isHovering, props }">
      <template v-for="(s, i) in stations" :key="i">
        <v-list-item v-bind="props" :class="{ 'on-hover': isHovering }" @click="onClick(s)" @mouseover="onHover(s)">
          <template v-slot:prepend>
            <i class="dot" :style="`background: ${getColor(s)}`" />
            <h4 class="ml-1 text-left" v-text="clean(s.properties.name)" />
          </template>
          <template v-slot:append>
            <v-btn variant="outlined" size="small" color="#014e9e" :target="s.id" :title="s.id"
              :href="s.properties.url">
              OSCAR
              <v-icon end icon="mdi-open-in-new" />
            </v-btn>
          </template>
        </v-list-item>
        <v-divider v-if="i + 1 < stations.length" />
      </template>
    </v-hover>
  </v-list>
</template>

<script lang="ts">
import { defineComponent } from "vue";


import { clean } from "@/lib/helpers.js";
import type { ItemsResponse } from "@/lib/types";

type stationSchema = {
  properties: { num_obs: number; name: string; url: string; };
  geometry: { coordinates: number[]; };
};


export default defineComponent({
  data() {
    return {
      selectedStation: null,
    };
  },
  computed: {
    stations: function () {
      if (this.stations === null) {
        return [];
      } else {
        const stns = [...this.stations.features].sort((a, b) => {
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
    onClick(station: stationSchema) {
      this.selectedStation = station;
      const latlng = [
        station.geometry.coordinates[1],
        station.geometry.coordinates[0],
      ];
      this.map.flyTo(latlng);
    },
    onHover(station: stationSchema) {
      const latlng = [
        station.geometry.coordinates[1],
        station.geometry.coordinates[0],
      ];
      this.map.openPopup(station.properties.name, latlng);
    },
    getColor(station: stationSchema) {
      const hits = station.properties.num_obs;
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

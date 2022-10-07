<template id="station-list">
  <div class="station-list">
    <v-list>
      <v-hover v-slot="{ isHovering, props }">
        <v-list-item
          v-for="(s, i) in stations"
          :key="i"
          v-bind="props"
          :class="{ 'on-hover': isHovering }"
          @click="onClick(s)"
          @mouseover="onHover(s)"
        >
          <h4 class="text-left" v-html="clean(s.properties.name)" />
          <template v-slot:append>
            <v-btn
              variant="outlined"
              size="small"
              color="#014e9e"
              @click.stop="openData(s)"
              class="mx-3"
            >
              {{ $t("navigation.data") }}
              <v-icon end icon="mdi-chart-scatter-plot"></v-icon>
            </v-btn>
            <v-btn
              variant="outlined"
              size="small"
              color="#014e9e"
              :target="s.id"
              :title="s.id"
              :href="s.properties.url"
            >
              OSCAR
              <v-icon end icon="mdi-open-in-new"></v-icon>
            </v-btn>
          </template>
        </v-list-item>
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
  },
});
</script>

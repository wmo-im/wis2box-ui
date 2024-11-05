<script setup lang="ts">
import { computed } from 'vue';
import { useGlobalStateStore } from "@/stores/global";

const store = useGlobalStateStore();

const selectedStation = computed(() => store.selectedStation);

</script>

<template id="station-info">
  <v-card flat height="60vh" class="scroll">
    <v-toolbar>
      <v-toolbar-title>
        {{ selectedStation?.properties.name || $t("chart.station") }}
      </v-toolbar-title>

      <template v-slot:prepend v-if="selectedStation">
        <v-btn icon @click="store.clearSelectedStation">
          <v-icon icon="mdi-arrow-left"></v-icon>
        </v-btn>
      </template>

      <template v-slot:append v-if="selectedStation != null">
        <v-btn variant="outlined" size="small" color="#014e9e" @click.stop="openData(selectedStation.properties.name)"
          class="my-auto">
          {{ $t("navigation.data") }}
          <v-icon end icon="mdi-chart-scatter-plot" />
        </v-btn>
      </template>
    </v-toolbar>

    <v-card flat class="text-center" v-if="!selectedStation">
      <StationList :features="features" :map="map" />
    </v-card>
    <v-card flat class="text-center" v-else>
      <StationStatus :features="features" :map="map" />
    </v-card>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import StationList from "./StationList.vue";
import StationStatus from "./StationStatus.vue";
import type { ItemsResponse } from "@/lib/types";
import router from "@/router";

export default defineComponent({
  components: { StationList, StationStatus },
  props: {
    features: {
      type: Object as PropType<ItemsResponse>,
      required: true,
    },
    map: {
      type: Object,
      required: true,
    },
  },
  methods: {
    openData(station: string) {
      router.push(`/fixed-land-station-map/${station}/data`);
    },
  },
});
</script>

<style scoped>
.scroll {
  overflow-y: scroll;
}
</style>

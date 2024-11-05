<!-- ChartDialog is the main component for displaying station data
    in greater detail. It contains a list of observed properties
    as well as a table and plot of data for each property
-->

<template id="chart-dialog">
  <v-overlay class="align-center justify-center" v-model="open">
    <v-card :width="$vuetify.display.width" :max-height="$vuetify.display.height * 0.95" max-width="1100"
      class="pa-4 scroll">

      <!-- x icon to close the dialog -->
      <v-row justify="end">
        <v-btn variant="text" color="pink" icon @click="open = !open">
          <v-icon icon="mdi-close"> </v-icon>
        </v-btn>
      </v-row>

      <v-card-title class="text-h4">
        {{ selectedStation.properties.name }}
      </v-card-title>
      <v-spacer />

      <v-card-subtitle>
        {{ selectedStation.properties.id }}
      </v-card-subtitle>

      <v-progress-linear v-if="loading" indeterminate color="primary" />

      <v-responsive height="590">
        <DataViewer :datastreams="datastreams" :topic="topic" :selected-station="selectedStation" />
      </v-responsive>
    </v-card>
  </v-overlay>
</template>

<script lang="ts">
import type { Datastreams, Feature, ItemsResponse } from "@/lib/types";
import DataViewer from "./data/DataViewer.vue";

import { defineComponent, type PropType } from "vue";
import { catchAndDisplayError } from "@/lib/errors";
import { useGlobalStateStore } from "@/stores/global";

export default defineComponent({
  components: {
    DataViewer,
  },
  data() {
    return {
      loading: false,
      stations: {} as ItemsResponse,
      open: true,
      datastreams: [] as Datastreams,
    };
  },
  props: {
    topic: {
      type: String,
      required: true
    },
    selectedStation: {
      type: Object as PropType<Feature>,
      required: true
    }
  },
  methods: {
    async fetchDatastreams() {
      this.loading = true;
      try {
        const url = `${window.VUE_APP_OAPI}/collections/${this.topic}/items?` + new URLSearchParams({
          wigos_station_identifier: this.selectedStation.id
        });
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ItemsResponse = await response.json();
        if (!data.features) {
          catchAndDisplayError(this.$t("chart.station") + this.$t("messages.no_observations_in_collection"));
        }

        // There is no way in OAF to get the enumeration of all distinct values
        // for a given property. So we need to just fetch a lot, then
        // use a set to get all unique values
        const propSet = new Set();

        for (const item of data.features) {
          if (propSet.has(item.properties.name)) {
            continue;
          }
          this.datastreams.push(item.properties);
          propSet.add(item.properties.name);
        }
      } catch (error) {
        catchAndDisplayError(error as string);
      } finally {
        console.log("done");
        this.loading = false;
      }
    },
  },
  async mounted() {
    await this.fetchDatastreams();
    const store = useGlobalStateStore();
    if (!store.selectedDatastream) {
      store.setSelectedDatastream(this.datastreams[0]);
    }
  },
});
</script>

<style scoped>
.scroll {
  overflow-y: scroll;
}
</style>

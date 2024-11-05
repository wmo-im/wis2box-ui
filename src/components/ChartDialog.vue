<!-- ChartDialog is a popup window which contains a sidebar with a list of observed properties.
 When an associated property is selected, it shows either a table or chart for the associated data -->

<template id="chart-dialog">
  <v-overlay class="align-center justify-center" v-model="featuresFetched">
    <v-card :width="$vuetify.display.width" :max-height="$vuetify.display.height * 0.95" max-width="1100"
      class="pa-4 scroll">
      <v-card-title class="text-h4" v-if="featuresFetched">
        {{
          selectedStation.properties.name }}
      </v-card-title>
      <v-spacer />
      <v-card-subtitle v-if="featuresFetched">
        {{ selectedStation.properties.id }}
      </v-card-subtitle>

      <v-responsive height="590" v-if="featuresFetched">
        <DataViewer :station="selectedStation" />
      </v-responsive>
    </v-card>
  </v-overlay>
</template>

<script lang="ts">
import type { Feature, ItemsResponse } from "@/lib/types";
import DataViewer from "./data/DataViewer.vue";

import { defineComponent, type PropType } from "vue";
import { getStationsFromCollection } from "@/lib/helpers";
import { catchAndDisplayError } from "@/lib/errors";

export default defineComponent({
  components: {
    DataViewer,
  },
  data() {
    return {
      loading: false,
      stations: {} as ItemsResponse
    };
  },
  computed: {
    featuresFetched() {
      return !this.loading && this.stations.features && this.stations.features.length > 0;
    }
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
  // add an onloaded event
  mounted() {
    this.loadStations();
  },
  methods: {
    async loadStations() {
      this.loading = true;
      try {
        this.stations = await getStationsFromCollection(this.topic);
      }
      catch (error) {
        catchAndDisplayError(error as string);
      }
      this.loading = false;
    },
  }
});
</script>

<style scoped>
.scroll {
  overflow-y: scroll
}
</style>

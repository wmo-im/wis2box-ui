<!-- ChartDialog is a popup window which contains a sidebar with a list of observed properties.
 When an associated property is selected, it shows either a table or chart for the associated data -->

<script setup lang="ts">

const props = defineProps({
  topic: String,
})

</script>

<template id="chart-dialog">
  <v-card :width="$vuetify.display.width" :max-height="$vuetify.display.height * 0.95" max-width="1100"
    class="pa-4 scroll">
    <v-card-title class="text-h4" v-if="!loading && stations.features && stations.features.length > 0">
      {{
        stations.features[0].properties.name }}
    </v-card-title>
    <v-spacer />
    <v-card-subtitle v-if="!loading && stations.features && stations.features.length > 0">
      {{ stations.features[0].properties.id }}
    </v-card-subtitle>

    <v-responsive height="590" v-if="!loading && stations.features && stations.features.length > 0">
      <DataViewer :station="stations.features[0]" />
    </v-responsive>
  </v-card>
</template>

<script lang="ts">
import type { ItemsResponse, ProcessResponse } from "@/lib/types";
import DataViewer from "./data/DataViewer.vue";

import { defineComponent } from "vue";
import { catchAndDisplayError } from "@/lib/errors";

export default defineComponent({
  components: {
    DataViewer,
  },
  data() {
    return {
      loading: false,
      features: {},
      stations: {} as ItemsResponse
    };
  },
  computed: {
  },
  // add an onloaded event
  mounted() {
    this.loadStations();
  },
  methods: {
    async loadStations() {
      this.loading = true; // Set loading to true before fetching data
      try {
        const response = await fetch(`${window.VUE_APP_OAPI}/processes/station-info/execution`, {
          method: "POST",
          body: JSON.stringify({ inputs: { collection: this.topic } }),
        });
        if (response.ok) {
          const data: ProcessResponse = await response.json();
          if (data.code !== "success") {
            throw new Error("Failed to get OGC API Process Info");
          }
          this.stations = data.value; // Update features with fetched data
        } else {
          catchAndDisplayError(`${this.$t("messages.does_not_exist")}: ${this.$t("messages.how_to_link_station")}`);
        }
      } catch (error) {
        catchAndDisplayError(error as string);
      } finally {
        this.loading = false;
      }
    },
  }
});
</script>

<style scoped>
.scroll {
  overflow-y: scroll
}
</style>

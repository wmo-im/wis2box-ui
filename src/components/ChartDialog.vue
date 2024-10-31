<!-- ChartDialog is a component which  -->

<script setup lang="ts">
const props = defineProps<{
  station?: {
    properties: {
      name: string;
    };
    id: string;
  };
  datastreams?: Array<object>
}>();
</script>

<template id="chart-dialog">
  <v-overlay class="align-center justify-center">
    <div>
      <v-card :width="$vuetify.display.width" :max-height="$vuetify.display.height * 0.95" max-width="1100"
        class="pa-4 scroll">
        <v-toolbar color="#FFF">
          <v-card-title class="text-h4">
            {{ props.station.properties.name }}
          </v-card-title>
          <v-spacer />
          <v-btn variant="text" color="pink" icon>
            <v-icon icon="mdi-close"></v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-subtitle>
          {{ props.station.id }}
        </v-card-subtitle>
        <v-responsive height="590">
          <data-viewer :station="props.station" :datastreams="props.datastreams" />
        </v-responsive>
      </v-card>
    </div>
  </v-overlay>
</template>

<script lang="ts">
import DataViewer from "./data/DataViewer.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    DataViewer,
  },
});
</script>

<style scoped>
.scroll {
  overflow-y: scroll;
}
</style>

<template id="chart-dialog">
  <div class="chart-dialog">
    <v-overlay class="align-center justify-center">
      <div>
        <v-card :width="$vuetify.display.width" :max-height="$vuetify.display.height * 0.95" max-width="1100"
          class="pa-4 scroll">
          <v-toolbar color="#FFF">
            <v-card-title class="text-h4">
              {{ station.properties.name }}
            </v-card-title>
            <v-spacer />
            <v-btn varaint="text" color="pink" icon>
              <v-icon icon="mdi-close"></v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-subtitle>
            {{ station.id }}
          </v-card-subtitle>
          <v-responsive height="590">
            <data-viewer :station="station" />
          </v-responsive>
        </v-card>
      </div>
    </v-overlay>
  </div>
</template>

<script lang="ts">
import DataViewer from "./data/DataViewer.vue";

import { defineComponent } from "vue";

export default defineComponent({
  components: {
    DataViewer,
  },
  props: ["features"],
  data: function () {
    return {
      station: this.features.station,
      datastreams: this.features.datastreams,
    };
  },
});
</script>

<style scoped>
.scroll {
  overflow-y: scroll
}
</style>

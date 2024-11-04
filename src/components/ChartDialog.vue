<script setup lang="ts">

defineProps({
  features: {
    type: Object,
    required: true,
  },
})

const store = useGlobalStateStore();
</script>

<template id="chart-dialog">
  <v-overlay v-model="store.dialog" class="align-center justify-center">
    <div>
      <v-card :width="$vuetify.display.width" :max-height="$vuetify.display.height * 0.95" max-width="1100"
        class="pa-4 scroll">
        <v-toolbar color="#FFF">
          <v-card-title class="text-h4">
            {{ features.station.properties.name }}
          </v-card-title>
          <v-spacer />
          <v-btn variant="text" color="pink" icon @click="store.toggleDialog">
            <v-icon icon="mdi-close"></v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-subtitle>
          {{ features.station.id }}
        </v-card-subtitle>

        <v-responsive height="590">
          <DataViewer :station="features.station" />
        </v-responsive>
      </v-card>
    </div>
  </v-overlay>
</template>

<script lang="ts">
import { useGlobalStateStore } from "@/stores/global";
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
  overflow-y: scroll
}
</style>

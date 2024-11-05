<!-- The Map view displays a Map with an associated chart dialog if the user requests the chart data -->
<template>
  <v-card flat>
    <template v-if="featuresReady">
      <WisMap :features="features" />
    </template>
    <v-progress-linear v-else striped indeterminate color="primary" />
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import WisMap from "@/components/leaflet/WisMap.vue";
import { getStationsFromCollection } from "@/lib/helpers";
import type { ItemsResponse } from "@/lib/types";
import { catchAndDisplayError } from "@/lib/errors";

export default defineComponent({
  components: {
    WisMap,
  },
  props: {
    topic: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      features: {} as ItemsResponse,
      featuresReady: false,
    };
  },

  async mounted() {
    this.featuresReady = false;
    try {
      this.features = await getStationsFromCollection(this.topic);
      this.featuresReady = true;
    } catch (error) {
      catchAndDisplayError(error as string);
    }
  }
});
</script>

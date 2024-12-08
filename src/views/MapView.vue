<template>
  <v-progress-linear v-if="!featuresReady" striped indeterminate color="primary" />
  <v-card flat>
    <!-- For some reason, the v-progress-linear will not show up
         unless there is a dummy div in the template.
    -->
    <div v-show="!featuresReady" style="height: 10px;"></div>
    <WisMap :topic="topic" :features="features" v-if="featuresReady" />
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import WisMap from "@/components/leaflet/WisMap.vue";
import type { ItemsResponse, ProcessResponse } from "@/lib/types";
import { catchAndDisplayError } from "@/lib/errors";
import { fetchWithToken } from "@/lib/helpers";

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
      const response = await fetchWithToken(
        `${window.VUE_APP_OAPI}/processes/station-info/execution`,
        {
          method: 'POST',
          body: JSON.stringify({ inputs: { collection: this.topic } }),
        },
      )
      if (response.ok) {
        const data: ProcessResponse = await response.json()
        // It is possible for a process to return an ok HTTP status code but an error in the json
        if (data.code !== 'success') {
          catchAndDisplayError(`${this.$t("messages.how_to_link_station")}`, undefined, response.status)
        }
        this.features = data.value // value represents the result of the process
      } else {
        catchAndDisplayError(`${this.$t("messages.how_to_link_station")}`, undefined, response.status)
      }
    } catch (error) {
      catchAndDisplayError(error as string);
    } finally {
      this.featuresReady = true;
    }
  },
});
</script>

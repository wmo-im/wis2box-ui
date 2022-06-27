<template id="chart-dialog">
  <div class="chart-dialog">
    <v-overlay v-model="$root.dialog" class="align-center justify-center">
      <div>
        <v-card min-width="1100" class="pa-4">
          <v-responsive height="590">
            <data-viewer :station="station" />
          </v-responsive>
        </v-card>
      </div>
    </v-overlay>
  </div>
</template>

<script>
import DataViewer from "./data/DataViewer.vue";

import { defineComponent } from "vue";

export default defineComponent({
  name: "ChartDialog",
  template: "#chart-dialog",
  components: {
    DataViewer,
  },
  props: ["features"],
  data: function () {
    return {
      features_: this.features,
    };
  },
  computed: {
    station: function () {
      return this.features_.station;
    },
    datastreams: function () {
      return this.features_.datastreams;
    },
  },
});
</script>

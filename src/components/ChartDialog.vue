<template id="chart-dialog">
  <div class="chart-dialog">
    <v-dialog v-model="$root.dialog">
      <v-card :min-height="410 * datastreams.length" min-width="750" v-click-outside="$root.toggleDialog">
        <v-card-actions>
          <v-row>
            <v-spacer />
            <v-btn @click="$root.toggleDialog"> X </v-btn>
          </v-row>
        </v-card-actions>
        <v-container>
          <v-card
            v-for="(datastream, i) in datastreams"
            :key="i"
            height="400"
            width="700"
          >
            <chart-plot :datastream="datastream" :key="datastream" />
          </v-card>
        </v-container>
        <div style="flex: 1 1 auto;"></div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import ChartPlot from "./ChartPlot.vue";

export default {
  name: "ChartDialog",
  template: "#chart-dialog",
  components: {
    ChartPlot,
  },
  props: ["feature"],
  data: function () {
    return {
      feature_: this.feature,
      station: this.feature.station,
      datastreams: this.feature.datastreams,
    };
  },
  mounted: function() {
    console.log(this.feature_);
  }
};
</script>

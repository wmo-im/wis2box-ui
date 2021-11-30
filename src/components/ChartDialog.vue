<template id="chart-dialog">
  <div class="chart-dialog">
    <v-dialog v-model="$root.dialog" scrollable>
      <v-card
        min-height="450"
        min-width="750"
        v-click-outside="$root.toggleDialog"
      >
        <v-card-actions>
          <v-row>
            <v-spacer />
            <v-btn @click="$root.toggleDialog"> X </v-btn>
          </v-row>
        </v-card-actions>
        <v-item-group>
          <v-row>
            <v-col key="0" cols="12">
              <v-item>
                <v-card max-height="400">
                  <wis-map
                    :feature="feature_"
                    :params="{ Datastreams: feature_.datastreams[0] }"
                  />
                </v-card>
              </v-item>
            </v-col>
            <v-col
              v-for="(datastream, i) in datastreams"
              cols="12"
              :key="i + 1"
            >
              <v-item>
                <v-card>
                  <chart-plot :datastream="datastream" :key="datastream" />
                </v-card>
              </v-item>
            </v-col>
          </v-row>
        </v-item-group>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import WisMap from "./WisMap.vue";
import ChartPlot from "./ChartPlot.vue";

export default {
  name: "ChartDialog",
  template: "#chart-dialog",
  components: {
    WisMap,
    ChartPlot,
  },
  props: ["feature"],
  data: function () {
    return {
      panel: [],
      feature_: this.feature,
      station: this.feature.station,
      datastreams: this.feature.datastreams,
    };
  },
  mounted: function () {
    console.log(this.feature_);
  },
  methods: {
    // Create an array the length of our items
    // with all values as true
    all() {
      this.panel = [...Array(this.items).keys()].map((k, i) => i);
    },
    // Reset the panel
    none() {
      this.panel = [];
    },
  },
};
</script>

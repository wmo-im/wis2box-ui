<template id="chart-dialog">
  <div class="chart-dialog">
    <v-row justify="center">
      <v-dialog v-model="$root.dialog" scrollable>
        <v-card
          min-height="450"
          min-width="750"
        >
          <v-card-actions>
            <v-row>
              <v-spacer />
              <v-btn @click="$root.toggleDialog"> X </v-btn>
            </v-row>
          </v-card-actions>
          <v-card-text>
            <v-item-group>
              <v-row>
                <v-col key="0" cols="12">
                  <v-item>
                    <v-card max-height="400">
                      <wis-map
                        :feature="feature_"
                        :params="{ '@iot.id': station.id }"
                      />
                    </v-card>
                  </v-item>
                </v-col>
                <v-col
                  v-for="(d, i) in datastreams"
                  cols="12"
                  :key="i + 1"
                >
                  <v-item>
                    <v-card>
                      <chart-plot :datastream="d" />
                    </v-card>
                  </v-item>
                </v-col>
              </v-row>
            </v-item-group>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import WisMap from "./WisMap.vue";
import ChartPlot from "./ChartPlot.vue";

let oapi = process.env.VUE_APP_OAPI;

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
      feature_: this.feature,
    };
  },
  methods: {
    async loadDatastreams() {
      if (this.feature_.station === null){ return; }
      var self = this;
      await this.$root.axios({
          method: "get",
          url: oapi + "/collections/Datastreams/items",
          params: {
            f: "json",
            Thing: self.feature_.station.id,
            limit: self.feature_.station.properties.Datastreams.length,
          },
        })
        .then(function (response) {
          // handle success
          self.feature_.datastreams = response.data.features;
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })        
        .then(function () {
          console.log("done");
        });
    },
  },
  computed: {
    station: function() {
      console.log(this.feature_);
      this.loadDatastreams();
      return this.feature_.station;
    },
    datastreams: function() { 
      console.log(this.feature_);
      return this.feature_.datastreams;
    },
  },
};
</script>

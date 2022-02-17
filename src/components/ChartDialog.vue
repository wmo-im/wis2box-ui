<template id="chart-dialog">
  <div class="chart-dialog">
    <v-row justify="center">
      <v-dialog v-model="$root.dialog" fullscreen overlay-opacity="0">
        <v-card width="100%" max-height="800">
          <v-card-actions>
            <v-row>
              <v-spacer />
              <v-btn large rounded dark @click="$root.toggleDialog"> X </v-btn>
            </v-row>
          </v-card-actions>
          <v-card-text>
            <v-card max-height="200">
              <tabs v-model="selectedTab">
                <tab :val="0">
                  <v-btn
                    flat
                    @click="selectedTab = 0"
                    v-html="$t('station.map')"
                  />
                </tab>
                <tab :val="1">
                  <v-btn
                    flat
                    @click="selectedTab = 1"
                    v-html="$t('station.properties')"
                  />
                </tab>
                <tab :val="2">
                  <v-btn
                    flat
                    @click="selectedTab = 2"
                    v-html="$t('chart.chart')"
                  />
                </tab>
                <tab v-for="(d, i) in datastreams" :key="`t${i}`" :val="i + 3">
                  <v-btn
                    flat
                    @click="selectedTab = i + 3"
                    v-html="d.properties.ObservedProperty.name"
                  />
                </tab>
              </tabs>
            </v-card>
            <v-card min-height="450">
              <div v-show="selectedTab === 0">
                <wis-map
                  :feature="feature_"
                  :params="{ wigos_id: station.id }"
                />
              </div>
              <div v-show="selectedTab === 1">
                <v-card class="text-center">
                  <table class="striped">
                    <tr v-for="(v, k) in station.properties" :key="k">
                      <th>{{ k }}</th>
                      <td style="word-wrap: break-word">{{ v }}</td>
                      <v-divider />
                    </tr>
                  </table>
                </v-card>
              </div>
              <div v-show="selectedTab === 2">
                <v-container fluid>
                  <plotter-dialog :station="station.id" />
                </v-container>
              </div>
              <div
                v-for="(d, i) in datastreams"
                :key="`tp${i}`"
                v-show="selectedTab === i + 3"
              >
                <chart-plot :datastream="d" />
              </div>
            </v-card>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import WisMap from "./WisMap.vue";
import ChartPlot from "./ChartPlot.vue";
import PlotterDialog from "./PlotterDialog.vue";
import { Tabs, Tab } from "vue3-tabs";
import { defineComponent } from "vue";
let oapi = process.env.VUE_APP_OAPI;

export default defineComponent({
  name: "ChartDialog",
  template: "#chart-dialog",
  components: {
    PlotterDialog,
    WisMap,
    ChartPlot,
    Tabs,
    Tab,
  },
  props: ["feature"],
  data: function () {
    return {
      selectedTab: 0,
      feature_: this.feature,
    };
  },
  methods: {
    async loadDatastreams() {
      if (this.feature_.station === null) {
        return;
      }
      this.selectedTab = 0;
      var self = this;
      await this.$http({
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
    station: function () {
      this.loadDatastreams();
      return this.feature_.station;
    },
    datastreams: function () {
      return this.feature_.datastreams;
    },
  },
});
</script>

<style scoped>
.tab {
  padding: 10px 0px;
  margin: 10px 20px;
}
.active-tab {
  border-width: 0px;
  border-top-width: 2px;
  border-style: solid;
}
</style>

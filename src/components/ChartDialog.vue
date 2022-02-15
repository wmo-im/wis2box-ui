<template id="chart-dialog">
  <div class="chart-dialog">
    <v-dialog v-model="$root.dialog" max-height="70%" width="100%">
      <v-row justify="center" align="center">
        <v-card min-width="900">
          <v-card-text>
            <v-card max-height="200">
              <tabs v-model="selectedTab">
                <tab :val="0">
                  <v-btn flat @click="selectedTab = 0">
                    {{ $t("station.map") }}
                  </v-btn>
                </tab>
                <tab :val="1">
                  <v-btn flat @click="selectedTab = 1">
                    {{ $t("station.properties") }}
                  </v-btn>
                </tab>
                <tab v-for="(d, i) in datastreams" :key="`t${i}`" :val="i + 2">
                  <v-btn flat @click="selectedTab = i + 2">
                    {{ d.properties.ObservedProperty.name }}
                  </v-btn>
                </tab>
              </tabs>
            </v-card>
            <v-card max-height="450">
              <div v-show="selectedTab === 0">
                <wis-map
                  :feature="feature_"
                  :params="{ wigos_id: station.id }"
                />
              </div>
              <div v-show="selectedTab === 1">
                <v-card>
                  <table class="striped">
                    <tr v-for="(v, k) in station.properties" :key="k">
                      <th>{{ k }}</th>
                      <td style="word-wrap: break-word">{{ v }}</td>
                      <v-divider />
                    </tr>
                  </table>
                </v-card>
              </div>
              <div
                v-for="(d, i) in datastreams"
                :key="`tp${i}`"
                v-show="selectedTab === i + 2"
              >
                <chart-plot :datastream="d" />
              </div>
            </v-card>
          </v-card-text>
          <v-card-actions>
            <v-row>
              <v-spacer />
              <v-btn @click="$root.toggleDialog"> X </v-btn>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-row>
    </v-dialog>
  </div>
</template>

<script>
import WisMap from "./WisMap.vue";
import ChartPlot from "./ChartPlot.vue";
import { Tabs, Tab } from "vue3-tabs";
import { defineComponent } from "vue";
let oapi = process.env.VUE_APP_OAPI;

export default defineComponent({
  name: "ChartDialog",
  template: "#chart-dialog",
  components: {
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

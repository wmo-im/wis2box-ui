<template id="chart-dialog">
  <div class="chart-dialog">
    <v-dialog v-model="$root.dialog" app content-class="chart-dialog">
      <v-row justify="center">
        <v-card min-width="1200" min-height="600" max-height="800" style="position: fixed; top: -400px;">
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
                  <v-row justify="center" align="center">
                    <v-col v-html="$t('station.wigos_id')" />
                    <v-col v-html="station.properties.wigos_id" />
                    <v-divider />
                  </v-row>
                  <v-row justify="center" align="center">
                    <v-col v-html="$t('station.name')" />
                    <v-col>
                      <a :href="station.properties.url">{{
                        station.properties.name
                      }}</a>
                    </v-col>
                    <v-divider />
                  </v-row>
                  <v-row justify="center" align="center">
                    <v-col v-html="$t('station.status')" />
                    <v-col v-html="station.properties.status" />
                    <v-divider />
                  </v-row>
                </v-card>
              </div>
              <div v-show="selectedTab === 2">
                <v-container fluid>
                  <plotter-dialog :station="station.id" />
                </v-container>
              </div>
            </v-card>
          </v-card-text>
        </v-card>
      </v-row>
    </v-dialog>
  </div>
</template>

<script>
import WisMap from "./WisMap.vue";
import PlotterDialog from "./PlotterDialog.vue";
import { Tabs, Tab } from "vue3-tabs";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ChartDialog",
  template: "#chart-dialog",
  components: {
    PlotterDialog,
    WisMap,
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
  computed: {
    station: function () {
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

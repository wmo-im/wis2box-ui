<template id="chart-dialog">
  <div class="chart-dialog">
    <v-dialog v-model="$root.dialog" app content-class="chart-dialog">
      <v-row justify="center">
        <v-card
          min-width="1100"
          height="700"
          style="position: fixed; top: -350px"
        >
          <v-toolbar>
            <v-toolbar-title v-html="station.properties.name" />
            <v-spacer />
            <v-btn @click="$root.toggleDialog" close icon> X </v-btn>
            <template v-slot:extension>
              <v-tabs
                align-with-title
                v-model="selectedTab"
                color="#014e9e"
                grow
              >
                <v-tab v-for="(item, i) in tabs" :value="i" :key="i">
                  {{ $t(item) }}
                </v-tab>
              </v-tabs>
            </template>
          </v-toolbar>

          <v-card flat height="590">
            <div v-show="selectedTab === 0">
              <wis-map :feature="feature_" :params="{ wigos_id: station.id }" />
            </div>
            <div v-show="selectedTab === 1">
              <v-card class="text-center">
                <v-row justify="center" align="center">
                  <v-col v-html="$t('station.name')" />
                  <v-col>
                    <a target="_blank" :href="station.properties.url">{{
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
                <v-row justify="center" align="center">
                  <v-col v-html="$t('station.wigos_id')" />
                  <v-col v-html="station.properties.wigos_id" />
                  <v-divider />
                </v-row>
              </v-card>
            </div>
            <div v-show="selectedTab === 2 || selectedTab === 3">
              <data-viewer :choice="selectedTab" :station="station.id" />
            </div>
          </v-card>
        </v-card>
      </v-row>
    </v-dialog>
  </div>
</template>

<script>
import WisMap from "./WisMap.vue";
import DataViewer from "./data/DataViewer.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ChartDialog",
  template: "#chart-dialog",
  components: {
    DataViewer,
    WisMap,
  },
  props: ["feature"],
  data: function () {
    return {
      selectedTab: 0,
      tabs: ["station.map", "station.properties", "chart.chart", "table.table"],
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

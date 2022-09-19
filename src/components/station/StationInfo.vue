<template id="station-info">
  <div class="station-info">
    <v-navigation-drawer permanent :width="400">
      <v-toolbar>
        <h3 class="text-no-wrap mx-4">
          {{ station_name || $t("chart.station") }}
        </h3>
        <v-spacer />
        <v-btn
          color="pink"
          icon
          v-show="station !== null"
          @click="features_.station = null"
        >
          X
        </v-btn>
      </v-toolbar>
      <v-divider />
      <v-card flat class="text-center" v-show="station === null">
        <station-list :features="features" :map="map" />
      </v-card>

      <v-card flat v-show="station !== null">
        <v-tabs grow v-model="tab" color="#014e9e">
          <v-tab v-for="(item, i) in tabs" :value="i" :key="i">
            {{ $t(item) }}
          </v-tab>
        </v-tabs>
        <v-divider />
        <v-window v-model="tab">
          <v-window-item :value="0" eager>
            <h5 class="text-left">
              {{ $t("messages.from") + " " + latestResultTime }}
            </h5>
            <v-table>
              <table>
                <tr v-for="(item, i) in recentObservations" :key="i">
                  <th width="50%">{{ $root.parseForNameAndTime(item) }}</th>
                  <td width="50%">{{ item.value + " " + item.units }}</td>
                </tr>
              </table>
            </v-table>
          </v-window-item>
          <v-window-item :value="1" eager>
            <v-row justify="center">
              <div id="stationStatus" />
            </v-row>
          </v-window-item>
        </v-window>
      </v-card>

      <div class="text-center ma-2">
        <v-snackbar v-model="snackbar">
          {{ msg }}
          <template v-slot:actions>
            <v-btn color="pink" variant="text" @click="snackbar = false">
              X
            </v-btn>
          </template>
        </v-snackbar>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import Plotly from "plotly.js-dist-min";

import { defineComponent } from "vue";
import StationList from "./StationList.vue";

export default defineComponent({
  components: { StationList },
  name: "StationInfo",
  template: "#station-info",
  props: ["features", "map"],
  data() {
    return {
      features_: this.features,
      snackbar: false,
      msg: "",
      recentObservations: [],
      dailyObservations: [],
      latestResultTime: null,
      tab: null,
      tabs: ["station.latest", "station.status"],
    };
  },
  computed: {
    station: function () {
      return this.features_.station;
    },
    station_name: function () {
      if (this.station) {
        return this.station.properties.name;
      } else {
        return this.station;
      }
    },
  },
  watch: {
    "features_.station": {
      async handler(station) {
        if (station.links.length === 0) {
          this.msg = `
            ${this.$root.clean(station.properties.name)} ${this.$t(
            "messages.no_linked_collections"
          )}. ${this.$t("messages.how_to_link_station")}`;
          this.snackbar = true;
          this.loading = false;
          this.tab = null;
        } else {
          this.loadObservations(station);
        }
      },
    },
  },
  methods: {
    async loadObservations(station) {
      var self = this;
      await this.$http({
        method: "get",
        url: station.links[0].href + "/items",
        params: {
          f: "json",
          sortby: "+resultTime",
          wigos_station_identifier: station.id,
          limit: 1,
        },
      })
        .then(function (response) {
          // handle success
          self.loadRecentObservations(
            station,
            response.data.features[0].properties.resultTime,
            response.data.numberMatched
          );
          var index = response.data.features[0].properties.index;
          self.loadDailyObservations(station, index);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
          if (error.response.status === 401) {
            self.msg = self.$t("messages.not_authorized");
            self.snackbar = true;
          }
        })
        .then(function () {
          self.tab = 0;
          self.loading = false;
          console.log("done");
        });
    },
    async loadRecentObservations(station, limit) {
      this.loading = true;
      var self = this;
      await this.$http({
        method: "get",
        url: station.links[0].href + "/items",
        params: {
          f: "json",
          datetime: `${self.latestResultTime}/..`,
          wigos_station_identifier: station.id,
          limit: limit,
        },
      }).then(function (response) {
        // handle success
        self.recentObservations = response.data.features.map(
          (obs) => obs.properties
        );
      });
    },
    async loadDailyObservations(station, index) {
      this.loading = true;
      var self = this;

      const startTime = new Date();
      startTime.setDate(startTime.getDate() - 1);

      var plot = document.getElementById("stationStatus");
      plot.innerHTML = "";

      await this.$http({
        method: "get",
        url: station.links[0].href + "/items",
        params: {
          f: "json",
          datetime: `${startTime.toISOString()}/..`,
          index: index,
          wigos_station_identifier: station.id,
          limit: 24,
        },
      }).then(function (response) {
        // handle success
        var trace = {
          x: response.data.features.map((obs) => obs.properties.resultTime),
          type: "histogram",
          xbins: {
            size: 3600000,
          },
        };
        var data = [trace];

        var layout = {
          height: 300,
          width: 450,
          bargap: 0.01,
          title:
            self.$t("messages.no_of_observations") +
            ": " +
            response.data.numberMatched,
          xaxis: {
            range: [startTime.toISOString(), new Date().toISOString()],
            type: "date",
          },
          yaxis: {
            dtick: 1,
          },
        };

        var config = {
          displayModeBar: false,
          responsive: true,
        };

        Plotly.newPlot("stationStatus", data, layout, config);
      });
    },
  },
});
</script>

<style scoped>
tr:nth-child(odd) {
  background-color: #eeeeee;
}
th,
td {
  padding: 8px;
}
</style>
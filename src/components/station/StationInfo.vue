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
        <v-list>
          <v-hover v-slot="{ isHovering, props }">
            <v-list-item
              v-for="(s, i) in stations"
              :key="i"
              v-bind="props"
              :class="{ 'on-hover': isHovering }"
              @click="onClick(s)"
              @mouseover="onHover(s)"
            >
              <h4 class="text-left" v-html="$root.clean(s.properties.name)" />
              <template v-slot:append>
                <v-btn
                  variant="outlined"
                  size="small"
                  color="#014e9e"
                  @click.stop="openData(s)"
                  class="mx-3"
                >
                  {{ $t("navigation.data") }}
                  <v-icon end icon="mdi-chart-scatter-plot"></v-icon>
                </v-btn>
                <v-btn
                  variant="outlined"
                  size="small"
                  color="#014e9e"
                  :target="s.id"
                  :title="s.id"
                  :href="s.properties.url"
                >
                  OSCAR
                  <v-icon end icon="mdi-open-in-new"></v-icon>
                </v-btn>
              </template>
            </v-list-item>
          </v-hover>
        </v-list>
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

export default defineComponent({
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
    stations: function () {
      if (this.features.stations === null) {
        return [];
      } else {
        const stns = [...this.features.stations.features].sort((a, b) => {
          const nameA = a.properties.name.toUpperCase(); // ignore upper and lowercase
          const nameB = b.properties.name.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          } else if (nameA > nameB) {
            return 1;
          } else {
            return 0;
          }
        });
        return stns;
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
    onClick(station) {
      this.features_.station = station;
      const latlng = [
        station.geometry.coordinates[1],
        station.geometry.coordinates[0],
      ];
      this.map.flyTo(latlng);
    },
    onHover(station) {
      const latlng = [
        station.geometry.coordinates[1],
        station.geometry.coordinates[0],
      ];
      this.map.openPopup(station.properties.name, latlng);
    },
    openData(station) {
      this.features_.station = station;
      this.$root.toggleDialog();
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
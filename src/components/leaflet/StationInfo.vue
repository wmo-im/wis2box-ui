<template id="station-info">
  <div class="station-info">
    <v-navigation-drawer permanent width="450">
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-list-item class="pa-2 text-h6 text-center" v-bind="props">
            {{ station_name || $t("chart.station") }}
          </v-list-item>
        </template>
        <v-list>
          <v-list-item
            v-for="(station, i) in features_.stations.features"
            :key="i"
            @click="onClick(station)"
          >
            <v-list-item-title v-html="$root.clean(station.properties.name)" />
          </v-list-item>
        </v-list>
      </v-menu>

      <v-divider />

      <v-card width="450" class="text-center" v-show="station">
        <v-tabs v-model="tab" color="#014e9e" optional>
          <v-tab v-for="(item, i) in tabs" :value="i" :key="i">
            {{ $t(item) }}
          </v-tab>
          <v-tab @click="$root.toggleDialog" :value="tabs.length">
            {{ $t("navigation.data") }}
          </v-tab>
        </v-tabs>
        <v-divider />
        <v-window v-model="tab">
          <v-window-item :value="0" v-show="!snackbar">
            <h5 class="text-left">
              {{ $t("messages.from") + " " + latestResultTime }}
            </h5>
            <v-table>
              <table>
                <tr v-for="(item, i) in recentObservations" :value="i" :key="i">
                  <th>{{ $root.parseForNameAndTime(item) }}</th>
                  <td>{{ item.value + " " + item.units }}</td>
                </tr>
              </table>
            </v-table>
          </v-window-item>
          <v-window-item :value="1" eager>
            <v-card class="text-center">
              <div id="stationStatus" />
            </v-card>
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
      tab: -1,
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
        if (station.links.length == 0) {
          this.msg = `
            ${this.$root.clean(station.properties.name)} ${this.$t(
            "messages.no_linked_collections"
          )}. ${this.$t("messages.how_to_link_station")}`;
          this.snackbar = true;
          this.loading = false;
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
          sortby: "-resultTime",
          wigos_station_identifier: station.id,
          limit: 1,
        },
      })
        .then(function (response) {
          // handle success
          self.latestResultTime =
            response.data.features[0].properties.resultTime;
          var limit = response.data.numberMatched;
          self.loadRecentObservations(station, limit);
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
        console.log(response);
        if (response.data.features.length === 0) {
          plot.innerHTML =
            station.id +
            self.$t("messages.no_observations_in_collection") +
            self.$t("messages.from") +
            " " +
            startTime.toISOString();
        }
        var trace = {
          x: response.data.features.map((obs) => obs.properties.resultTime),
          type: "histogram",
          nbinsx: 24,
        };
        var data = [trace];

        var layout = {
          height: 300,
          width: 450,
          bargap: 0.01,
          title: self.$t("messages.no_of_observations"),
          xaxis: {
            range: [startTime.toISOString(), new Date()],
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
      this.map.openPopup(station.properties.name, latlng);
    },
  },
});
</script>
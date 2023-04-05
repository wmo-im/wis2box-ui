<template id="station-history">
  <div class="station-history">
    <div
      class="pt-0 mb-2"
      :style="{ visibility: loading ? 'visible' : 'hidden' }"
    >
      <v-progress-linear height="6" indeterminate color="primary" />
    </div>
    <v-row justify="center">
      <div
        class="plot-history"
        :id="'station-history-' + wigos_station_identifier"
      />
    </v-row>
  </div>
</template>

<script>
import Plotly from "plotly.js-dist-min";
import { clean, hasLinks } from "@/scripts/helpers.js";
let oapi = window.VUE_APP_OAPI;

import { defineComponent } from "vue";

export default defineComponent({
  name: "StationHistory",
  template: "#station-history",
  props: ["features", "map"],
  data() {
    return {
      now: new Date(),
      loading: true,
      features_: this.features,
      data: [],
      layout: {
        height: 300,
        width: 450,
        showlegend: false,
        xaxis: {
          type: "date",
          // dtick: 86400000.0,
          showgrid: true,
          gridcolor: "#d5e3f0",
          gridwidth: 2,
        },
        yaxis: {
          autorange: true,
          showgrid: false,
          zeroline: false,
          showline: false,
          autotick: true,
          ticks: "",
          showticklabels: false,
        },
      },
      config: {
        displayModeBar: false,
        responsive: true,
      },
    };
  },
  computed: {
    station: function () {
      return this.features_.station;
    },
    wigos_station_identifier: function () {
      if (this.station) {
        return this.station.properties.wigos_station_identifier;
      } else {
        return "";
      }
    },
  },
  watch: {
    "features_.station": {
      async handler(station) {
        if (station !== null) {
          this.data = [];
          for (var plot of document.getElementsByClassName("plot-history")) {
            this.plot(plot);
          }
        }
        if (hasLinks(station)) {
          this.loadObservations(station);
        } else if (station !== null) {
          this.$root.catch(`
            ${clean(station.properties.name)} ${this.$t(
            "messages.no_linked_collections"
          )}<br>${this.$t("messages.how_to_link_station")}`);
          this.loading = false;
        }
      },
    },
  },
  methods: {
    plot(plot) {
      Plotly.purge(plot);
      Plotly.newPlot(plot, this.data, this.layout, this.config);
    },
    async loadObservations(station) {
      this.loading = true;
      var self = this;
      this.data = [];
      await this.$http({
        method: "get",
        url: oapi + "/collections/" + station.properties.topic + "/items",
        params: {
          f: "json",
          sortby: "+resultTime",
          wigos_station_identifier: station.id,
          limit: 1,
        },
      })
        .then(function (response) {
          // handle success
          var ort = response.data.features[0].properties.resultTime;
          self.oldestResultTime = new Date(ort);
          var index = response.data.features[0].properties.index;
          if (self.inDays(self.oldestResultTime, self.now) > 30) {
            self.loadAllObservations(station, index);
          } else {
            self.loadDailyObservations(station, index);
          }
        })
        .catch(this.$root.catch);
    },
    async loadAllObservations(station, index) {
      this.loading = true;
      this.layout.xaxis.range = [
        this.oldestResultTime.toISOString(),
        this.now.toISOString(),
      ];
      var self = this;
      await this.$http({
        method: "get",
        url: oapi + "/collections/" + station.properties.topic + "/items",
        params: {
          f: "json",
          index: index,
          wigos_station_identifier: station.id,
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
        var plot = document.getElementById("station-history-" + station.id);
        if (plot !== null) {
          self.data.push(trace);
          self.plot(plot);
        }
      }).catch(this.$root.catch);
      this.loading = false;
    },
    async loadDailyObservations(station, index) {
      this.loading = true;
      this.layout.xaxis.range = [
        this.oldestResultTime.toISOString(),
        this.now.toISOString(),
      ];
      var self = this;
      for (
        var d = new Date(this.oldestResultTime.toISOString());
        d <= this.now;
        this.iterDate(d)
      ) {
        var date_ = d.toISOString().split("T")[0];
        await this.$http({
          method: "get",
          url: oapi + "/collections/" + station.properties.topic + "/items",
          params: {
            f: "json",
            datetime: date_,
            index: index,
            wigos_station_identifier: station.id,
          },
        }).then(function (response) {
          // handle success
          let fillColor;
          let hits = response.data.numberMatched;
          if (hits === 0) {
            self.getNextDate(station, index, d);
          } else {
            if (hits <= 7) {
              fillColor = "#FF3300";
            } else if (hits <= 19) {
              fillColor = "#FF9900";
            } else {
              fillColor = "#009900";
            }
            var trace = {
              x: response.data.features.map((obs) => obs.properties.resultTime),
              type: "histogram",
              marker: {
                color: fillColor,
              },
              xbins: {
                size: 3600000,
              },
              name: date_,
            };
            var plot = document.getElementById("station-history-" + station.id);
            if (plot !== null) {
              self.data.push(trace);
              self.plot(plot);
            }
          }
        }).catch(this.$root.catch);
      }
      this.loading = false;
    },
    inDays: function (d1, d2) {
      var t2 = d2.getTime();
      var t1 = d1.getTime();

      return Math.floor((t2 - t1) / (24 * 3600 * 1000));
    },
    iterDate(d) {
      var nextDate = new Date(d.toISOString());
      nextDate.setDate(d.getDate() + 1);
      if (nextDate < d) {
        nextDate.setDate(d.getDate());
        nextDate.setMonth(d.getMonth() + 1);
        if (nextDate < d) {
          nextDate.setMonth(d.getMonth());
          nextDate.setFullYear(d.getFullYear() + 1);
        }
      }
      d.setFullYear(nextDate.getFullYear());
      d.setMonth(nextDate.getMonth());
      d.setDate(nextDate.getDate());
    },
    getNextDate(station, index, d) {
      var nextDate = new Date(d.toISOString());
      this.iterDate(nextDate);
      this.$http({
        method: "get",
        url: oapi + "/collections/" + station.properties.topic + "/items",
        params: {
          f: "json",
          datetime: `${nextDate.toISOString()}/..`,
          sortby: "+resultTime",
          index: index,
          limit: 1,
          wigos_station_identifier: station.id,
        },
      })
        .then(function (response) {
          var next;
          if (response.data.numberMatched > 0) {
            next = new Date(response.data.features[0].properties.resultTime);
          } else {
            next = new Date();
          }
          d.setFullYear(next.getFullYear());
          d.setMonth(next.getMonth());
          d.setDate(next.getDate());
        })
        .catch(this.$root.catch);
    },
  },
});
</script>

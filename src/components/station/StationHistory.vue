<template id="station-history">
  <div class="station-history">
    <div
      class="pt-0 mb-2"
      :style="{ visibility: loading ? 'visible' : 'hidden' }"
    >
      <v-progress-linear height="6" indeterminate color="primary" />
    </div>
    <v-row justify="center">
      <div id="station-history-plot" />
    </v-row>
  </div>
</template>

<script>
import Plotly from "plotly.js-dist-min";

import { defineComponent } from "vue";

export default defineComponent({
  name: "StationHistory",
  template: "#station-history",
  props: ["features", "map"],
  data() {
    return {
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
    plot() {
      var plot = document.getElementById("station-history-plot");
      Plotly.purge(plot);
      Plotly.newPlot(plot, this.data, this.layout, this.config);
    },
    async loadObservations(station) {
      this.loading = true;
      var self = this;
      this.data = [];
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
          self.oldestResultTime =
            response.data.features[0].properties.resultTime;
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
        });
    },
    async loadDailyObservations(station, index) {
      this.loading = true;
      var now = new Date();
      var then = new Date(this.oldestResultTime);
      this.layout.xaxis.range = [then.toISOString(), now.toISOString()];
      var self = this;
      for (
        var d = new Date(this.oldestResultTime);
        d <= now;
        this.iterDate(d)
      ) {
        var date_ = d.toISOString().split("T")[0];
        await this.$http({
          method: "get",
          url: station.links[0].href + "/items",
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
          } else if (hits <= 7) {
            fillColor = "#FF3300";
          } else if (hits <= 19) {
            fillColor = "#FF9900";
          } else if (hits <= 24) {
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
          self.data.push(trace);
          self.plot();
        });
      }
      this.loading = false;
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
        url: station.links[0].href + "/items",
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
        .catch(function (error) {
          console.log(error);
        });
    },
  },
});
</script>

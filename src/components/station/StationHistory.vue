<template id="station-history">
  <div class="station-history">
    <v-row justify="center">
      <div id="stationHistory" />
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
      features_: this.features,
      data: [],
      layout: {
        height: 300,
        width: 450,
        showlegend: false,
        xaxis: {
          type: "date",
          dtick: 86400000.0,
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
      var plot = document.getElementById("stationHistory");
      Plotly.purge(plot);
      Plotly.newPlot(plot, this.data, this.layout, this.config);
      this.loading = false;
    },
    async loadObservations(station) {
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
        })
        .then(function () {
          self.tab = 0;
          self.loading = false;
          console.log("done");
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
        d.setDate(d.getDate() + 1)
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
            fillColor = "#000000";
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
    },
  },
});
</script>

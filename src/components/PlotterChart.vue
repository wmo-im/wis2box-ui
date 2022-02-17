<template id="plotter-chart">
  <div class="plotter-chart">
    <v-card min-height="600px">
      <div :style="{ visibility: loading ? 'visible' : 'hidden' }">
        <v-progress-linear striped indeterminate color="primary" />
      </div>
      <div :style="{ visibility: !loading ? 'visible' : 'hidden' }">
        <v-container>
          <v-row justify="center" align="end">
            <div :id="'plotly-chart-' + choices_.collection.id" />
          </v-row>
        </v-container>
      </div>
    </v-card>
  </div>
</template>

<script>
import Plotly from "plotly.js-dist-min";
import { defineComponent } from "vue";
import { mdiDownload } from "@mdi/js";

let oapi = process.env.VUE_APP_OAPI;

export default defineComponent({
  name: "Plotter-Chart",
  template: "#plotter-chart",
  props: ["choices"],
  watch: {
    choices_: {
      handler(newValue) {
        if (newValue.collection !== "" && newValue.datastream !== "") {
          this.data = [];
          this.config.modeBarButtonsToAdd = [];
          for (var station of this.choices_.station) {
            this.loadCollection(newValue.collection, station);
          }
        }
      },
      deep: true,
    },
  },
  data: function () {
    return {
      trace: {
        type: "scatter",
        x: [],
        y: [],
      },
      choices_: this.choices,
      data: [],
      loading: true,
      layout: {
        title: "",
        height: "600",
        width: "700",
        legend: { x: 1, xanchor: "right", y: 1 },
        xaxis: {
          autorange: true,
          type: "date",
          range: [null, null],
          rangeslider: { range: [null, null] },
        },
        yaxis: {
          type: "linear",
          autorange: true,
          title: null,
        },
      },
      config: {
        modeBarButtonsToAdd: [],
      },
    };
  },
  methods: {
    plot() {
      var plot = document.getElementById(
        "plotly-chart-" + this.choices.collection.id
      );
      Plotly.purge(plot);
      Plotly.newPlot(plot, this.data, this.layout, this.config);
      this.loading = false;
    },
    getCol(features, key) {
      if (key.includes(".")) {
        const split = key.split(".");
        if (split.length === 2) {
          return features.map(function (row) {
            return row["properties"][split[0]][split[1]];
          });
        } else if (split.length === 3) {
          return features.map(function (row) {
            return row["properties"][split[0]][split[1]][split[2]];
          });
        }
      } else {
        return features.map(function (row) {
          return row["properties"][key];
        });
      }
    },
    newTrace(features, x, y, station_id) {
      const Trace = JSON.parse(JSON.stringify(this.trace));
      Trace.x = this.getCol(features, x);
      Trace.y = this.getCol(features, y);
      Trace.name = station_id;
      this.data.push(Trace);
    },
    async loadCollection(collection, station_id) {
      this.loading = true;
      var self = this;
      const range = collection.extent.temporal.interval;
      const title = collection.description;
      this.layout.title = title;
      this.layout.xaxis.range = range;
      this.layout.xaxis.rangeslider = { range: range };

      await this.$http({
        method: "get",
        url: oapi + "/collections/" + collection.id + "/items",
        params: {
          f: "json",
          "wmo:wigos_station_identifier": station_id,
          resulttype: "hits",
        },
      })
        .then(function (response) {
          // handle success
          self.loadObservations(
            collection.id,
            response.data.numberMatched,
            station_id
          );
        })
        .catch(function (error) {
          // handle error
          console.log(error);
          self.loading = false;
        })
        .then(function () {
          console.log("done");
        });
    },
    async loadObservations(collection_id, limit, station_id) {
      if (limit === 0) {
        console.log(station_id + " has no observations in " + collection_id);
        return;
      } else {
        var self = this;
        this.loading = true;
        await this.$http({
          method: "get",
          url: oapi + "/collections/" + collection_id + "/items",
          params: {
            f: "json",
            "wmo:wigos_station_identifier": station_id,
            limit: limit,
          },
        })
          .then(function (response) {
            // handle success
            self.config.modeBarButtonsToAdd.push({
              name: "Data Source " + station_id,
              icon: {
                width: 24,
                height: 24,
                path: mdiDownload,
              },
              click: function () {
                window.location.href = response.request.responseURL;
              },
            });
            var title =
              self.choices_.datastream.name +
              " (" +
              self.choices_.datastream.units +
              ")";
            self.layout.yaxis.title = title;
            self.newTrace(
              response.data.features,
              "phenomenonTime",
              "observations." + self.choices_.datastream.id + ".value",
              station_id
            );
            self.plot();
          })
          .catch(function (error) {
            // handle error
            console.log(error);
            self.loading = false;
          })
          .then(function () {
            console.log("done");
          });
      }
    },
  },
});
</script>

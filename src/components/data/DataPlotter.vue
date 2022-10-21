<template id="data-plotter">
  <div class="data-plotter">
    <v-card min-height="500px" class="ma-4">
      <v-alert v-show="alert.value" type="warning" v-html="alert.msg" />

      <div :style="{ visibility: loading ? 'visible' : 'hidden' }">
        <v-progress-linear striped indeterminate color="primary" />
      </div>
      <div :style="{ visibility: !loading ? 'visible' : 'hidden' }">
        <v-card class="mx-auto" flat>
          <div :id="'plotly-chart-' + choices_.collection.id" />
        </v-card>
      </div>
    </v-card>
  </div>
</template>

<script>
import Plotly from "plotly.js-dist-min";
import { defineComponent } from "vue";
import { mdiOpenInNew } from "@mdi/js";

let oapi = window.VUE_APP_OAPI;

export default defineComponent({
  name: "DataPlotter",
  template: "#data-plotter",
  props: ["choices", "alert"],
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
        this.loading = false;
      },
      deep: true,
    },
  },
  data: function () {
    return {
      trace: {
        type: "scatter",
        mode: "lines",
        x: [],
        y: [],
        line: {
          color: "#014e9e",
        },
        name: "",
      },
      scatter: {
        type: "scatter",
        mode: "markers",
        x: [],
        y: [],
        marker: {
          size: 5,
          color: "#014e9e",
        },
        name: "",
      },
      choices_: this.choices,
      data: [],
      loading: false,
      layout: {
        title: "",
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
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToAdd: [],
        modeBarButtonsToRemove: [
          "zoom2d",
          "pan2d",
          "select2d",
          "lasso2d",
          "zoomIn2d",
          "zoomOut2d",
          "autoScale2d",
        ],
      },
      font: { size: 14 },
      alert_: this.alert,
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
    newTrace(features, x, y) {
      const Trace = JSON.parse(JSON.stringify(this.trace));
      Trace.x = this.getCol(features, x);
      Trace.y = this.getCol(features, y);
      this.data.push(Trace);

      const Scatter = JSON.parse(JSON.stringify(this.scatter));
      Scatter.x = this.getCol(features, x);
      Scatter.y = this.getCol(features, y);
      this.data.push(Scatter);
      this.setDateLayout(features[features.length - 1]);
    },
    async loadCollection(collection, station_id) {
      this.loading = true;
      var self = this;
      const title = collection.description;
      const datastream = this.choices_.datastream;

      this.alert_.msg =
        station_id + this.$t("messages.no_observations_in_collection") + title;

      await this.$http({
        method: "get",
        url: `${oapi}/collections/${collection.id}/items`,
        params: {
          f: "json",
          name: datastream.id,
          index: datastream.index,
          wigos_station_identifier: station_id,
          resulttype: "hits",
        },
      })
        .then(function (response) {
          // handle success
          self.loadObservations(
            collection.id,
            response.data.numberMatched,
            datastream,
            station_id
          );
        })
        .catch(function (error) {
          // handle error
          if (error.response.status === 401) {
            self.alert_.msg = self.$t("messages.not_authorized");
            self.alert_.value = true;
          }
          console.log(error);
          self.loading = false;
        })
        .then(function () {
          console.log("done");
        });
    },
    async loadObservations(collection_id, limit, datastream, station_id) {
      if (limit === 0) {
        this.alert_.value = true;
        this.loading = false;
        return;
      } else {
        var self = this;
        this.loading = true;
        await this.$http({
          method: "get",
          url: `${oapi}/collections/${collection_id}/items`,
          params: {
            f: "json",
            name: datastream.id,
            index: datastream.index,
            wigos_station_identifier: station_id,
            sortby: "-resultTime",
            limit: limit,
          },
        })
          .then(function (resp) {
            // handle success
            var dataURL = resp.request.responseURL;
            self.config.modeBarButtonsToAdd.push({
              name: self.$t("chart.data_source"),
              icon: {
                width: 24,
                height: 24,
                path: mdiOpenInNew,
              },
              click: function () {
                const [start, end] = self.layout.xaxis.range;
                var timeExtent = `${new Date(
                  start + "Z"
                ).toISOString()}/${new Date(end + "Z").toISOString()}`;
                window.location.href = `${dataURL}&datetime=${timeExtent}`;
              },
            });
            self.newTrace(resp.data.features, "resultTime", "value");
            self.layout.yaxis.title = datastream.units;
            self.layout.title = datastream.name;
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
    setDateLayout(f) {
      var startTime = new Date(
        new Date(f.properties.resultTime).setUTCHours(0, 0, 0, 0)
      ).toISOString();
      var endTime = new Date(
        new Date().setUTCHours(23, 59, 59, 999)
      ).toISOString();
      this.layout.xaxis.range = [startTime, endTime];
      this.layout.xaxis.rangeslider.range = [startTime, endTime];
    },
  },
});
</script>

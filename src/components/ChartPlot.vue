<template id="chart-plot">
  <div class="chart-plot">
    <div :style="{ visibility: loading ? 'visible' : 'hidden' }">
      <v-progress-linear striped indeterminate color="primary" />
    </div>
    <div
      :style="{ visibility: !loading ? 'visible' : 'hidden' }"
      class="text-center"
    >
      <div :id="'plotly-chart-' + datastream.id" />
    </div>
  </div>
</template>

<script>
import Plotly from "plotly.js-dist-min";
let oapi = process.env.VUE_APP_OAPI;

export default {
  name: "ChartPlot",
  template: "#chart-plot",
  props: ["datastream"],
  mounted: function () {
    this.$nextTick(() => {
      this.loadDatastream(this.datastream);
    });
  },
  data: function () {
    return {
      trace: {
        type: "scatter",
        mode: "lines",
        x: [],
        y: [],
        line: { color: "#17BECF" },
      },
      data: [],
      loading: true,
      layout: {
        title: "",
        height: "400",
        width: "700",
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
        font: { size: 18 },
      },
    };
  },
  methods: {
    plot() {
      var plot = document.getElementById("plotly-chart-" + this.datastream.id);
      Plotly.newPlot(plot, this.data, this.layout);
    },
    getCol(features, key) {
      return features.map(function (row) {
        return row["properties"][key];
      });
    },
    newTrace(features, x, y) {
      const Trace = JSON.parse(JSON.stringify(this.trace));
      Trace.x = this.getCol(features, x);
      Trace.y = this.getCol(features, y);
      this.data.push(Trace);
      console.log(this.data);
    },
    async loadDatastream(datastream) {
      this.loading = true;
      var self = this;
      console.log(datastream);
      const range = datastream.properties.phenomenonTime.split("/");
      const title = datastream.properties.ObservedProperty.description;
      const unit = datastream.properties.unitOfMeasurement.symbol
      this.layout.title = title;
      this.layout.yaxis.title = title + " (" + unit + ")";
      this.layout.xaxis.range = range;
      this.layout.xaxis.rangeslider = { range: range };

      await this.$root.axios({
          method: "get",
          url: oapi + "/collections/Observations/items",
          params: {
            f: "json",
            Datastream: datastream.id,
            resulttype: "hits",
          },
        })
        .then(function (response) {
          // handle success
          self.loadObservations(datastream.id, response.data.numberMatched);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .then(function () {
          console.log("done");
        });
    },
    async loadObservations(datastreamID, limit) {
      var self = this;
      this.loading = true;
      this.$root.axios({
          method: "get",
          url: oapi + "/collections/Observations/items",
          params: {
            f: "json",
            Datastream: datastreamID,
            sortby: "-phenomenonTime",
            limit: limit,
          },
        })
        .then(function (response) {
          // handle success
          self.newTrace(response.data.features, "phenomenonTime", "result");
          self.plot();
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .then(function () {
          self.loading = false;
        });
    },
  },
};
</script>

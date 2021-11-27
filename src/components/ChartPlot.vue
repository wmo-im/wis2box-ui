<template>
  <v-container v-if="loading">
    <v-row>
      <v-spacer />
      <v-progress-circular indeterminate color="primary" />
      <v-spacer />
    </v-row>
  </v-container>
  <v-container v-else />
  <v-container>
    <div id="plotly-chart" />
  </v-container>
</template>

<script>
import Plotly from "plotly.js-dist-min";
let oapi = process.env.VUE_APP_OAPI;

export default {
  name: "ChartPlot",
  template: "#plotly-chart",
  props: ["datastream"],
  data() {
    return {
      trace: {
        type: "scatter",
        mode: "lines",
        name: "Stream Gage Height",
        x: [],
        y: [],
        line: { color: "#17BECF" },
      },
      data: [],
      loading: false,
      layout: {
        title: "Stream Gage Height",
        height: "100%",
        width: "100%",
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
      var plot = document.getElementById("plotly-chart");
      Plotly.newPlot(plot, this.data, this.layout);
    },
    get_col(features, key) {
      return features.map(function (row) {
        return row["properties"][key];
      });
    },
    new_trace(features, x, y) {
      const newTrace = JSON.parse(JSON.stringify(this.trace));
      newTrace.x = this.get_col(features, x);
      newTrace.y = this.get_col(features, y);
      this.data.push(newTrace);
      console.log(this.data);
    },
    async load_datastream(datastream) {
      var self = this;
      this.loading = true;
      await this.$root
        .axios({
          method: "get",
          url: oapi + "/collections/Datastreams/items/" + datastream,
          params: {
            f: "json",
          },
        })
        .then(function (response) {
          // handle success
          console.log(response.data.properties);
          const range = response.data.properties.phenomenonTime.split("/");
          const title = response.data.properties.ObservedProperty.description;
          const unit = response.data.properties.unitOfMeasurement.symbol;
          self.layout.yaxis.title = title + " (" + unit + ")";
          self.layout.xaxis.range = range;
          self.layout.xaxis.rangeslider = { range: range };
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
      var limit;
      await this.$root
        .axios({
          method: "get",
          url: oapi + "/collections/Observations/items",
          params: {
            f: "json",
            Datastream: datastream,
            resulttype: "hits",
          },
        })
        .then(function (response) {
          // handle success
          console.log(response.data);
          limit = response.data.numberMatched;
          self.load_observations(datastream, limit);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .then(function () {
          console.log("done");
        });
    },
    async load_observations(datastream, limit) {
      var self = this;
      self.$root
        .axios({
          method: "get",
          url: oapi + "/collections/Observations/items",
          params: {
            f: "json",
            Datastream: datastream,
            sortby: "-phenomenonTime",
            limit: limit,
          },
        })
        .then(function (response) {
          // handle success
          console.log(response.data);
          self.new_trace(response.data.features, "phenomenonTime", "result");
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .then(function () {
          // always executed
          self.plot();
          self.loading = false;
        });
    },
  },
  mounted() {
    console.log(this.datastream);
    this.load_datastream(this.datastream);
  },
};
</script>

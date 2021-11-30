<template id="chart-plot">
  <div class="chart-plot">
    <div :style="{ visibility: loading ? 'visible' : 'hidden' }">
      <v-progress-linear striped indeterminate color="primary" />
    </div>
    <div
      :style="{ visibility: !loading ? 'visible' : 'hidden' }"
      class="text-center"
    >
      <div :id="'plotly-chart-' + datastream" />
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
  data() {
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
      var plot = document.getElementById("plotly-chart-" + this.datastream);
      Plotly.newPlot(plot, this.data, this.layout, { scrollZoom: false });
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
          const range = response.data.properties.phenomenonTime.split("/");
          const title = response.data.properties.ObservedProperty.description;
          const unit = response.data.properties.unitOfMeasurement.symbol;
          self.layout.title = title;
          self.layout.yaxis.title = title + " (" + unit + ")";
          self.layout.xaxis.range = range;
          self.layout.xaxis.rangeslider = { range: range };
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
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
          self.load_observations(datastream, response.data.numberMatched);
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
      this.loading = true;
      this.$root
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
          self.new_trace(response.data.features, "phenomenonTime", "result");
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
  mounted() {
    this.load_datastream(this.datastream);
  },
};
</script>

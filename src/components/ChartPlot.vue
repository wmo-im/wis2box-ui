<template>
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
  // props: ["datastream_"],
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
      features: [],
      data: [],
      loading: false,
      datastreams: [],
      datastream: null,
      layout: {
        title: "Stream Gage Height",
        height: "100%",
        width: "100%",
        xaxis: {
          autorange: true,
          type: "date",
          range: [null, null],
          rangeslider: {range: [null, null]},
        },
        yaxis: {
          type: "linear",
          autorange: true,
          title: null,
        },
        font: { size: 18 },
      },
      title_: this.title,
    };
  },
  methods: {
    plot() {
      var plot = document.getElementById("#plotly-chart");
      Plotly.newPlot(plot, this.data, this.layout);
    },
    get_col(features, key) {
      return features.map(function(row) {
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
      await this.$root.axios(
        {
            method: "get",
            url: oapi + "/collections/Datastreams/items/" + datastream,
            params: {
              f: "json",
            },
        }
      )
      .then(
        function(response) {
          // handle success
          console.log(response.data.properties);
          const range = response.data.properties.phenomenonTime.split("/");
          const title = response.data.properties.ObservedProperty.description;
          const unit = response.data.properties.unitOfMeasurement.symbol;
          self.layout.yaxis.title = title + " (" + unit + ")";
          self.layout.xaxis.range = range;
          self.layout.xaxis.rangeslider = {"range": range};
        }
      )
      .catch(
        function(error) {
          // handle error
          console.log(error);
        }
      );
      var limit;
      await this.$root.axios(
        {
          method: "get",
          url: oapi + "/collections/Observations/items",
          params: {
            f: "json",
            Datastream: datastream,
            resulttype: "hits"
          },
        }
      )
      .then(
        function(response) {
          // handle success
          console.log( response.data );
          limit = response.data.numberMatched;
          self.load_observations(datastream, limit);
        }
      )
      .catch(
        function(error) {
          // handle error
          console.log(error);
        }
      )
      .then(
        function(){
          console.log("done");
        }
      );
    },
    async load_observations(datastream, limit){
      var self = this;
      self.$root.axios(
        {
          method: "get",
          url: oapi + "/collections/Observations/items",
          params: {
            f: "json",
            Datastream: datastream,
            sortby: "-phenomenonTime",
            limit: limit,
          },
        }
      )
      .then(
        function(response) {
          // handle success
          console.log(response.data)
          self.new_trace(response.data.features, "phenomenonTime", "result");
          self.plot();
        }
      )
      .catch(
        function (error) {
          // handle error
          console.log(error);
        }
      )
      .then(
        function() {
          // always executed
          self.loading = false;
        }
      );
    }
  },
  mounted() {
    // var self = this;
    // this.$root.axios(
    //   {
    //     method: "get",
    //     url: oapi + "/collections/Datastreams/items",
    //     params: {
    //       f: "json",
    //       limit: 2000
    //     },
    //   }
    // )
    // .then(
    //   function(response) {
    //     // handle success
    //     console.log( response.data );
    //     for (const d of response.data.features){
    //       self.datastreams.push(d.id);
    //     }
    //   }
    // )
    // .catch(
    //   function(error) {
    //     // handle error
    //     console.log(error);
    //   }
    // );
    this.load_datastream("'6f40a6c607b545999e3677a843be7695'");
    this.plot();
  },
  // watch: {
  //   datastream(d) {
  //     this.load_datastream(d);
  //     this.plot();
  //   },
  // },
};
</script>

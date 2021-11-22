<template>
  <v-container>
    <div id="PlotlyChart" />
  </v-container>
</template>

<script>
import Plotly from "plotly.js-dist-min";

export default {
  name: "ChartPlot",
  props: ["title"],
  data() {
    return {
      data: [
        {
          x: [0, 1, 2, 3, 4],
          y: [1, 5, 3, 7, 5],
          mode: "lines+markers",
          type: "scatter",
        },
      ],
      layout: {
        title: null,
        height: "450",
        width: "700",
        font: { size: 18 },
      },
      title_: this.title,
    };
  },
  methods: {
    plot() {
      this.layout.title = this.title_;
      var el = document.getElementById("PlotlyChart");
      Plotly.newPlot(el, this.data, this.layout, {});
    },
  },
  mounted() {
    this.plot();
  },
  watch: {
    title(t) {
      this.layout.title = t;
    },
  },
};
</script>

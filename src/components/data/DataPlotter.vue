<script setup lang="ts">

import type { Choices, ItemsResponse } from "@/lib/types";

defineProps<{
  choices: Choices,
  alert: {
    value: boolean,
    msg: string,
  },
}>()

</script>

<template id="data-plotter">
  <div class="data-plotter">
    <v-card min-height="500px" class="ma-4">
      <v-alert v-show="alert.value" type="warning" :text="alert.msg" />
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

<script lang="ts">
import Plotly from "plotly.js-cartesian-dist-min";
import { defineComponent } from "vue";
import { mdiOpenInNew } from "@mdi/js";
import { catchAndDisplayError } from "@/lib/errors";

const oapi = window.VUE_APP_OAPI;

export default defineComponent({
  watch: {
    choices_: {
      handler(newValue) {
        if (newValue.collection !== "" && newValue.datastream !== "") {
          this.data = [];
          this.config.modeBarButtonsToAdd = [];
          for (const station of this.choices_.station) {
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
          range: [null, null] as [number | null, number | null],
          rangeslider: { range: [null, null] as [number | null, number | null] },
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
      const plot = document.getElementById(
        "plotly-chart-" + this.choices.collection.id
      );
      Plotly.purge(plot);
      Plotly.newPlot(plot, this.data, this.layout, this.config);
      this.loading = false;
    },
    getCol(features: ItemsResponse["features"], key: string) {
      if (key.includes(".")) {
        const split = key.split(".");
        if (split.length === 2) {
          return features.map(row => row["properties"][split[0]][split[1]]);
        } else if (split.length === 3) {
          return features.map(row => row["properties"][split[0]][split[1]][split[2]]);
        }
      } else {
        return features.map(row => row["properties"][key]);
      }
    },
    newTrace(features: ItemsResponse["features"], x: string, y: string) {
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
    async loadCollection(collection: { description: string; id: string; }, station_id: string) {
      this.loading = true;
      const title = collection.description;
      const datastream = this.choices_.datastream;

      this.alert_.msg =
        station_id + this.$t("messages.no_observations_in_collection") + title;

      try {
        const response = await fetch(`${oapi}/collections/${collection.id}/items?f=json&name=${datastream.id}&index=${datastream.index}&wigos_station_identifier=${station_id}&resulttype=hits`);
        const data = await response.json();
        this.loadObservations(collection.id, data.numberMatched, datastream, station_id);
      } catch (error) {
        catchAndDisplayError(error as string);
      } finally {
        console.log("done");
      }
    },
    async loadObservations(collection_id: string, limit: number, datastream, station_id: string) {
      if (limit === 0) {
        this.alert_.value = true;
        this.loading = false;
        return;
      } else {
        this.loading = true;
        try {
          const response = await fetch(`${oapi}/collections/${collection_id}/items?f=json&name=${datastream.id}&index=${datastream.index}&wigos_station_identifier=${station_id}&sortby=-resultTime&limit=${limit}`);
          const data: ItemsResponse = await response.json();
          const dataURL = response.url;
          this.config.modeBarButtonsToAdd.push({
            name: this.$t("chart.data_source"),
            icon: {
              width: 24,
              height: 24,
              path: mdiOpenInNew,
            },
            click: () => {
              const [start, end] = this.layout.xaxis.range;
              const timeExtent = `${new Date(start + "Z").toISOString()}/${new Date(end + "Z").toISOString()}`;
              window.location.href = `${dataURL}&datetime=${timeExtent}`;
            },
          });
          this.newTrace(data.features, "resultTime", "value");
          this.layout.yaxis.title = datastream.units;
          this.layout.title = datastream.name;
          this.plot();
        } catch (error) {
          catchAndDisplayError(error as string);
        } finally {
          console.log("done");
        }
      }
    },
    setDateLayout(f) {
      const startTime = new Date(
        new Date(f.properties.resultTime).setUTCHours(0, 0, 0, 0)
      ).toISOString();
      const endTime = new Date(
        new Date().setUTCHours(23, 59, 59, 999)
      ).toISOString();
      this.layout.xaxis.range = [startTime, endTime];
      this.layout.xaxis.rangeslider.range = [startTime, endTime];
    },
  },
});
</script>

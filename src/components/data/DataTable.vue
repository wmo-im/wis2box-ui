<!-- This component represents the table which displays all the data for
 a specific station
-->

<template id="data-table">
  <v-card min-height="500px" class="ma-4">
    <v-progress-linear striped indeterminate color="primary" v-if="loading" />
    <div>
      <v-container>
        <v-row justify="center" align="end">
          <div id="plotly-table" />
        </v-row>
      </v-container>

      <v-table v-show="title !== ''" fixed-header height="500px">
        <thead>
          <tr>
            <th class="text-center" v-html="$t('table.phenomenon_time')" />
            <th class="text-center" v-html="title" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="(_, i) in data.time" :key="i">
            <td v-html="data.phenomenonTime[i]" />
            <td v-html="data.value[i]" />
          </tr>
        </tbody>
      </v-table>
    </div>
  </v-card>
</template>

<script lang="ts">
// have to ignore the dist-min import since it doesn't have ts types
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Plotly from "plotly.js-cartesian-dist-min";
import { defineComponent, type PropType } from "vue";
import { mdiDownload } from "@mdi/js";
import { catchAndDisplayError } from "@/lib/errors";
import type { Datastreams, Feature } from "@/lib/types";
import { clean, getColumnFromKey } from "@/lib/helpers";

const oapi = window.VUE_APP_OAPI;

export default defineComponent({
  props: {
    topic: {
      type: String,
      required: true,
    },
    selectedStation: {
      type: Object as PropType<Feature>,
      required: true,
    },
    selectedDatastream: {
      type: Object as PropType<Datastreams[0]>,
      required: true,
    }
  },
  mounted: function () {
    this.loadObservations();
  },
  watch: {
    selectedDatastream: function () {
      this.loadObservations();
    }
  },
  data() {
    return {
      data: {} as {
        time: string[],
        phenomenonTime: string[],
        value: string[],
      },
      loading: false,
      title: "",
      headerOverflow: 0,
      alert_: this.alert,
      layout: {
        height: 24,
        yaxis: {
          showgrid: false,
          zeroline: false,
          showline: false,
          ticks: "",
          showticklabels: false,
        },
        xaxis: {
          showgrid: false,
          zeroline: false,
          showline: false,
          ticks: "",
          showticklabels: false,
        },
      },
      config: {
        editable: false,
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToAdd: [] as {
          name: string,
          icon: {
            path: string
            height: number
            width: number
          },
          click: () => void
        }[],
        modeBarButtonsToRemove: [
          "toImage",
          "resetScale2d",
          "zoom2d",
          "pan2d",
          "select2d",
          "lasso2d",
          "zoomIn2d",
          "zoomOut2d",
          "autoScale2d",
        ],
      },
    };
  },
  methods: {
    onScroll(e: { target: { scrollTop: number; }; }) {
      this.headerOverflow = e.target.scrollTop;
    },
    getColumnFromKey,
    async loadObservations() {

      this.loading = true;

      try {
        const response = await fetch(`${oapi}/collections/${this.topic}/items?f=json&name=${this.selectedDatastream.name}&index=${this.selectedDatastream.index}&wigos_station_identifier=${this.selectedStation.id}&sortby=-resultTime`);
        const data = await response.json();
        this.plot(response.url);
        if (this.selectedDatastream.units === "CODE TABLE") {
          this.title = clean(`${this.selectedDatastream.name}`);
          this.data.value = this.getColumnFromKey(data.features, "description");
        } else {
          this.title = `${clean(this.selectedDatastream.name)} (${this.selectedDatastream.units})`;
          this.data.value = this.getColumnFromKey(data.features, "value");
        }
        this.data.time = this.getColumnFromKey(data.features, "resultTime");
        this.data.phenomenonTime = this.getColumnFromKey(data.features, "phenomenonTime");
      } catch (error) {
        catchAndDisplayError(error as string);
      } finally {
        this.loading = false;
        console.log("done");
      }
    },
    plot(url: string) {
      const plot = document.getElementById("plotly-table");
      if (plot !== null) {
        Plotly.purge(plot);
      }
      this.config.modeBarButtonsToAdd = [
        {
          name: this.$t("chart.download"),
          icon: {
            width: 24,
            height: 24,
            path: mdiDownload,
          },
          click: () => {
            window.location.href = url.replace("f=json", "f=csv");
          },
        },
      ];
      Plotly.newPlot(plot, [], this.layout, this.config);
    },
  },
});
</script>

<style scoped>
tr:nth-child(odd) {
  background-color: #eeeeee;
}

th,
td {
  padding: 8px;
  text-align: center;
}
</style>

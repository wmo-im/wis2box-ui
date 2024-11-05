<!-- This component represents the table which displays all the data for
 a specific station
-->
<script setup lang="ts">


defineProps<{
  choices: Choices,
  alert: {
    value: boolean,
    msg: string,
  }
}>()

</script>


<template id="data-table">
  <v-card min-height="500px" class="ma-4">
    <v-alert v-show="alert.value" type="warning" :text="alert.msg" />
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
          <tr v-for="(date, i) in data.time" :key="i">
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
import { defineComponent } from "vue";
import { mdiDownload } from "@mdi/js";
import { catchAndDisplayError } from "@/lib/errors";
import type { Choices, CollectionsResponse } from "@/lib/types";

const oapi = window.VUE_APP_OAPI;

export default defineComponent({
  mounted() {
    this.$nextTick(() => {
      if (this.choices_.collection.title !== "" && this.choices_.datastream.name !== "") {
        for (const station of this.choices_.station) {
          this.loadCollection(this.choices_.collection, station);
        }
      }
    });
  },
  watch: {
    choices: {
      handler(newValue) {
        if (this.loading) {
          return;
        }
        this.loading = true;
        if (newValue.collection !== "" && newValue.datastream !== "") {
          this.data = {};
          for (const station of this.choices_.station) {
            this.loadCollection(newValue.collection, station);
          }
        }
        this.loading = false;
      },
      deep: true,
    },
  },
  data() {
    return {
      choices_: this.choices as Choices,
      data: {},
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
        modeBarButtonsToAdd: [],
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
    getCol(features, key) {
      if (key.includes(".")) {
        const split = key.split(".");
        return features.map(row => {
          return split.length === 2
            ? row["properties"][split[0]][split[1]]
            : row["properties"][split[0]][split[1]][split[2]];
        });
      }
      return features.map(row => row["properties"][key]);
    },
    async loadCollection(collection: CollectionsResponse["collections"][number], station_id: string) {
      const title = collection.description;
      const datastream = this.choices_.datastream;

      this.alert_.msg =
        station_id + this.$t("messages.no_observations_in_collection") + title;

      this.loading = true;

      try {
        const response = await fetch(`${oapi}/collections/${collection.id}/items?f=json&name=${datastream.id}&index=${datastream.index}&wigos_station_identifier=${station_id}&resulttype=hits`);
        const data = await response.json();
        this.loadObservations(collection.id, data.numberMatched, datastream, station_id);
      } catch (error) {
        catchAndDisplayError(error as string);
      }
    },
    async loadObservations(collection_id: string, limit: number, datastream, station_id: string) {
      if (limit === 0) {
        this.alert_.value = true;
        this.loading = false;
        return;
      }

      this.loading = true;

      try {
        const response = await fetch(`${oapi}/collections/${collection_id}/items?f=json&name=${datastream.id}&index=${datastream.index}&wigos_station_identifier=${station_id}&sortby=-resultTime&limit=${limit}`);
        const data = await response.json();
        this.plot(response.url);
        if (datastream.units === "CODE TABLE") {
          this.title = `${datastream.name}`;
          this.data.value = this.getCol(data.features, "description");
        } else {
          this.title = `${datastream.name} (${datastream.units})`;
          this.data.value = this.getCol(data.features, "value");
        }
        this.data.time = this.getCol(data.features, "resultTime");
        this.data.phenomenonTime = this.getCol(data.features, "phenomenonTime");
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

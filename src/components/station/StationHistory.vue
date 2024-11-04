<!-- Station history displays -->

<template id="station-history">
  <div class="pt-0 mb-2" v-if="loading">
    <v-progress-linear height="6" indeterminate color="primary" />
  </div>
  <v-row justify="center">
    <div class="plot-history" :id="'station-history-' + wigos_station_identifier" />
  </v-row>
</template>

<script lang="ts">
import Plotly from "plotly.js-cartesian-dist-min";
import { clean, hasLinks } from "@/lib/helpers.js";
const oapi = window.VUE_APP_OAPI;

import { defineComponent } from "vue";
import { catchAndDisplayError } from "@/lib/errors";
import type { ItemsResponse } from "@/lib/types";

export default defineComponent({
  name: "StationHistory",
  props: ["features", "map"],
  data() {
    return {
      now: new Date(),
      loading: true,
      features_: this.features,
      oldestResultTime: null as Date | null,
      data: [],
      layout: {
        height: 300,
        width: 450,
        showlegend: false,
        xaxis: {
          type: "date",
          showgrid: true,
          gridcolor: "#d5e3f0",
          gridwidth: 2,
        },
        yaxis: {
          autorange: true,
          showgrid: false,
          zeroline: false,
          showline: false,
          autotick: true,
          ticks: "",
          showticklabels: false,
        },
      },
      config: {
        displayModeBar: false,
        responsive: true,
      },
    };
  },
  computed: {
    station() {
      return this.features_.station;
    },
    wigos_station_identifier() {
      return this.station ? this.station.properties.wigos_station_identifier : "";
    },
  },
  watch: {
    "features_.station": {
      async handler(station) {
        if (station !== null) {
          this.data = [];
          for (const plot of document.getElementsByClassName("plot-history")) {
            this.plot(plot);
          }
        }
        if (hasLinks(station)) {
          this.loadObservations(station);
        } else if (station !== null) {
          catchAndDisplayError(`
            ${clean(station.properties.name)} ${this.$t(
            "messages.no_linked_collections"
          )}, ${this.$t("messages.how_to_link_station")}`);
          this.loading = false;
        }
      },
    },
  },
  methods: {
    plot(plot: Element) {
      Plotly.purge(plot);
      Plotly.newPlot(plot, this.data, this.layout, this.config);
    },
    async loadObservations(station: { properties: { topic: string; }; id: number; }) {
      this.loading = true;
      this.data = [];
      // NOTE: It appears that sorting with +resultTime is not supported by the OAPI
      const url = `${oapi}/collections/${station.properties.topic}/items?f=json&sortby=resultTime&wigos_station_identifier=${station.id}&limit=1`

      try {
        const response = await fetch(url);

        // Clone the response to be able to read the body twice in case of an error
        const responseClone = response.clone();
        const data: ItemsResponse = await response.json();

        if (response.ok && data.features.length > 0) {
          const feature = data.features[0];
          if (feature && feature.properties && feature.properties.resultTime) {
            this.oldestResultTime = new Date(feature.properties.resultTime);
            const index = feature.properties.index;
            if (this.differenceInDays(this.oldestResultTime, this.now) > 30) {
              this.loadAllObservations(station, index);
            } else {
              this.loadDailyObservations(station, index);
            }
          } else {
            catchAndDisplayError(this.$t("chart.station") + this.$t("messages.no_observations_in_collection"));
          }
        } else {
          const errorBody = await responseClone.text();
          throw new Error(`${response.status}, ${errorBody}`);
        }
      } catch (error) {
        catchAndDisplayError(error as string, url);
      } finally {
        this.loading = false;
      }
    },
    async loadAllObservations(station: { properties: { topic: string; }; id: number; }, index: number) {
      this.loading = true;
      this.layout.xaxis.range = [
        this.oldestResultTime.toISOString(),
        this.now.toISOString(),
      ];

      try {
        const response = await fetch(`${oapi}/collections/${station.properties.topic}/items?f=json&index=${index}&wigos_station_identifier=${station.id}`);
        const data = await response.json();

        if (response.ok) {
          const trace = {
            x: data.features.map((obs) => obs.properties.resultTime),
            type: "histogram",
            xbins: {
              size: 3600000,
            },
          };
          const plot = document.getElementById("station-history-" + station.id);
          if (plot !== null) {
            this.data.push(trace);
            this.plot(plot);
          }
        } else {
          catchAndDisplayError(this.$t("messages.fetch_error"));
        }
      } catch (error) {
        catchAndDisplayError(error as string);
      } finally {
        this.loading = false;
      }
    },
    async loadDailyObservations(station: { properties: { topic: any; }; id: any; }, index: any) {
      this.loading = true;
      this.layout.xaxis.range = [this.oldestResultTime.toISOString(), this.now.toISOString()];
      for (const d = new Date(this.oldestResultTime.toISOString()); d <= this.now; this.iterDate(d)) {
        const date_ = d.toISOString().split("T")[0];
        try {
          const response = await fetch(`${oapi}/collections/${station.properties.topic}/items?f=json&datetime=${date_}&index=${index}&wigos_station_identifier=${station.id}`);
          const data = await response.json();

          if (response.ok) {
            let fillColor;
            const hits = data.numberMatched;
            if (hits === 0) {
              this.getNextDate(station, index, d);
            } else {
              fillColor = hits <= 7 ? "#FF3300" : hits <= 19 ? "#FF9900" : "#009900";
              const trace = {
                x: data.features.map((obs: { properties: { resultTime: any; }; }) => obs.properties.resultTime),
                type: "histogram",
                marker: { color: fillColor },
                xbins: { size: 3600000 },
                name: date_,
              };
              const plot = document.getElementById(`station-history-${station.id}`);
              if (plot !== null) {
                this.data.push(trace);
                this.plot(plot);
              }
            }
          } else {
            catchAndDisplayError(this.$t("messages.fetch_error"));
          }
        } catch (error) {
          catchAndDisplayError(error as string);
        }
      }
      this.loading = false;
    },
    differenceInDays(d1: Date, d2: Date) {
      const t2 = d2.getTime();
      const t1 = d1.getTime();
      return Math.floor((t2 - t1) / (24 * 3600 * 1000));
    },
    iterDate(d: Date) {
      const nextDate = new Date(d.toISOString());
      nextDate.setDate(d.getDate() + 1);
      if (nextDate < d) {
        nextDate.setDate(d.getDate());
        nextDate.setMonth(d.getMonth() + 1);
        if (nextDate < d) {
          nextDate.setMonth(d.getMonth());
          nextDate.setFullYear(d.getFullYear() + 1);
        }
      }
      d.setFullYear(nextDate.getFullYear());
      d.setMonth(nextDate.getMonth());
      d.setDate(nextDate.getDate());
    },
    async getNextDate(station: { properties: { topic: any; }; id: any; }, index: any, d: Date) {
      const nextDate = new Date(d.toISOString());
      this.iterDate(nextDate);
      try {
        const response = await fetch(`${oapi}/collections/${station.properties.topic}/items?f=json&datetime=${nextDate.toISOString()}/..&sortby=+resultTime&index=${index}&limit=1&wigos_station_identifier=${station.id}`);
        const data = await response.json();
        let next;
        if (data.numberMatched > 0) {
          next = new Date(data.features[0].properties.resultTime);
        } else {
          next = new Date();
        }
        d.setFullYear(next.getFullYear());
        d.setMonth(next.getMonth());
        d.setDate(next.getDate());
      } catch (error) {
        catchAndDisplayError(error as string);
      }
    },
  },
});
</script>

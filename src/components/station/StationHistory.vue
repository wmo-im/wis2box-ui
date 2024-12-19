<!-- StationHistory displays a plot of how many observations were gathered each day -->

<template id="station-history">
  <div class="pt-0 mb-2" v-if="loading">
    <v-progress-linear height="6" indeterminate color="primary" />
  </div>
  <v-row justify="center">
    <div class="plot-history" :id="'station-history-' + wigos_station_identifier" />
  </v-row>
</template>

<script lang="ts">
// @ts-expect-error no types from plotly min
import Plotly from "plotly.js-cartesian-dist-min";
import { clean, hasLinks } from "@/lib/helpers.js";

import { defineComponent, type PropType } from "vue";
import { catchAndDisplayError } from "@/lib/errors";
import type { Feature, ItemsResponse, Trace } from "@/lib/types";
import { fetchWithToken } from "@/lib/helpers";
import { t } from "@/locales/i18n"


export default defineComponent({
  props: {
    selectedStation: {
      type: Object as PropType<Feature>,
      required: true,
    },
  },
  data() {
    return {
      now: new Date(),
      loading: true,
      oldestreportTime: new Date(),
      data: [] as Trace[],
      layout: {
        height: 300,
        width: 450,
        showlegend: false,
        xaxis: {
          type: "date",
          showgrid: true,
          gridcolor: "#d5e3f0",
          gridwidth: 2,
          range: ["", ""] as [string, string],
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
    wigos_station_identifier() {
      return this.selectedStation ? this.selectedStation.properties.wigos_station_identifier : "";
    },
  },
  mounted() {
    this.fetchData();
  },
  // watch the selectedStation to update the plot when it changes
  watch: {
    selectedStation() {
      this.fetchData();
    },
  },
  methods: {
    async fetchData() {
      const station = this.selectedStation;
      if (station !== null) {
        this.data = [];
        for (const plot of document.getElementsByClassName("plot-history")) {
          this.plot(plot);
        }
        if (hasLinks(station)) {
          this.loadObservations(station);
        } else if (station !== null) {
          catchAndDisplayError(`
            ${clean(station.properties.name)} ${t(
            "messages.no_linked_collections"
          )}, ${t("messages.how_to_link_station")}`);
          this.loading = false;
        }
      }
    },
    plot(plot: Element) {
      Plotly.purge(plot);
      Plotly.newPlot(plot, this.data, this.layout, this.config);
    },
    async loadObservations(station: Feature) {
      this.loading = true;
      this.data = [];
      const url = `${window.VUE_APP_OAPI}/collections/${station.properties.topic}/items?f=json&sortby=reportTime&wigos_station_identifier=${station.id}&limit=1`;

      try {
        const response = await fetchWithToken(url);

        // Clone the response to be able to read the body twice in case of an error
        const responseClone = response.clone();
        const data: ItemsResponse = await response.json();
        
        const hasFeatures = data.features && data.features.length > 0;

        if (!hasFeatures ) {
          throw new Error(
            t("chart.station") + ` ${station.properties.name}` + t("messages.no_observations_in_collection")
          );
        } 

        if (response.ok) {
            const feature = data.features[0];
            if (feature && feature.properties && feature.properties.reportTime) {
              this.oldestreportTime = new Date(feature.properties.reportTime);
              const reportId = feature.properties.reportId;
              if (!reportId) {
                throw new Error("The reportId used to fetch groups of observations is not defined");
              }
              if (this.differenceInDays(this.oldestreportTime, this.now) > 30) {
                this.loadAllObservations(station, reportId);
              } else {
                this.loadDailyObservations(station, reportId);
              }
            } else {
              catchAndDisplayError(t("chart.station") + t("messages.no_observations_in_collection"));
            }
        } else {
          // If we checked for errors we know how to handle, but still have something wrong,
          // just display the raw error
          const errorBody = await responseClone.text();
          throw new Error(`${response.status}, ${errorBody}`);
        }
      } catch (error) {
        catchAndDisplayError(String(error));
      } finally {
        this.loading = false;
      }
    },
    async loadAllObservations(station: Feature, reportId: string) {
      this.loading = true;
      this.layout.xaxis.range = [
        this.oldestreportTime.toISOString(),
        this.now.toISOString(),
      ];

      try {
        const response = await fetchWithToken(`${window.VUE_APP_OAPI}/collections/${station.properties.topic}/items?f=json&reportId=${reportId}&wigos_station_identifier=${station.id}`);
        const data = await response.json();

        if (response.ok) {
          const trace = {
            x: data.features.map((obs: Feature) => obs.properties.reportTime),
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
        }
      } catch (error) {
        catchAndDisplayError(String(error));
      } finally {
        this.loading = false;
      }
    },
    async loadDailyObservations(station: Feature, reportId: string) {
      this.loading = true;
      this.layout.xaxis.range = [this.oldestreportTime.toISOString(), this.now.toISOString()];
      for (const d = new Date(this.oldestreportTime.toISOString()); d <= this.now; this.iterDate(d)) {
        const date_ = d.toISOString().split("T")[0];
        try {
          const response = await fetchWithToken(`${window.VUE_APP_OAPI}/collections/${station.properties.topic}/items?f=json&datetime=${date_}&reportId=${reportId}&wigos_station_identifier=${station.id}`);
          const data: ItemsResponse = await response.json();

          if (response.ok) {
            const hits = data.numberMatched;
            if (hits === 0) {
              this.getNextDate(station, reportId, d);
            } else {
              const fillColor = hits <= 7 ? "#FF3300" : hits <= 19 ? "#FF9900" : "#009900";
              const trace = {
                x: data.features.map((obs: Feature) => obs.properties.reportTime).filter((time) => time !== undefined),
                type: "histogram",
                marker: { color: fillColor },
                xbins: { size: 3600000 },
                name: date_,
              };
              if (trace.x.length === 0) {
                throw new Error("The server returned no reportTime values and thus could not consult the plot");
              }

              const plot = document.getElementById(`station-history-${station.id}`);
              if (plot !== null) {
                this.data.push(trace);
                this.plot(plot);
              }
            }
          } else {
            catchAndDisplayError("", undefined, response.status);
          }
        } catch (error) {
          catchAndDisplayError(String(error));
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
    async getNextDate(station: Feature, reportId: string, d: Date) {
      const nextDate = new Date(d.toISOString());
      this.iterDate(nextDate);
      try {
        const response = await fetchWithToken(`${window.VUE_APP_OAPI}/collections/${station.properties.topic}/items?f=json&datetime=${nextDate.toISOString()}/..&sortby=reportTime&reportId=${reportId}&limit=1&wigos_station_identifier=${station.id}`);
        const data: ItemsResponse = await response.json();
        let next;
        if (data.numberMatched > 0) {
          next = new Date(data.features[0].properties.reportTime || "");
        } else {
          next = new Date();
        }
        d.setFullYear(next.getFullYear());
        d.setMonth(next.getMonth());
        d.setDate(next.getDate());
      } catch (error) {
        catchAndDisplayError(String(error));
      }
    },
  },
});
</script>

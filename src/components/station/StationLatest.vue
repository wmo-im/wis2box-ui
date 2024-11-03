<!-- Display a table of variables and their most recent value for a specific station -->

<template id="station-status">
  <div class="station-status">
    <h5 class="text-left" v-if="latestResultTime">
      {{ $t("messages.from") + " " + latestResultTime }}
    </h5>
    <v-table>
      <table>
        <tr v-for="(item, i) in recentObservations" :key="i">
          <th width="50%">{{ getNameTime(item) }}</th>
          <td v-if="item.units !== 'CODE TABLE'" width="50%">
            {{ item.value + " " + item.units }}
          </td>
          <td v-else-if="item.units === 'CODE TABLE'" width="50%">
            {{ item.description }}
          </td>
        </tr>
      </table>
    </v-table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getNameTime, clean, hasLinks } from "@/lib/helpers.js";
import type { FeatureLayerForMap, Observation, Station } from "@/lib/types";
import { catchAndDisplayError } from "@/lib/errors";

const oapi = window.VUE_APP_OAPI;


export default defineComponent({
  props: ["features", "map"],
  data() {
    return {
      features_: this.features,
      recentObservations: [] as Observation[],
      latestResultTime: null,
      loading: false,
    };
  },
  watch: {
    "features_.station": {
      async handler(station) {
        this.latestResultTime = null;
        this.recentObservations = [];
        if (hasLinks(station)) {
          this.loadObservations(station);
        } else if (station !== null) {
          catchAndDisplayError(`
            ${clean(station.properties.name)} ${this.$t(
            "messages.no_linked_collections"
          )} <br> ${this.$t("messages.how_to_link_station")}`);
          this.loading = false;
        }
      },
    },
  },
  methods: {
    getNameTime,
    async loadObservations(station: Station) {
      try {
        const response = await fetch(`${oapi}/collections/${station.properties.topic}/items?f=json&sortby=-resultTime&wigos_station_identifier=${station.id}&limit=1`);
        const data = await response.json();

        const feature = data.features[0];
        if (feature && feature.properties && feature.properties.resultTime) {
          this.latestResultTime = feature.properties.resultTime;
          this.loadRecentObservations(station, data.numberMatched);
        } else {
          console.error(this.$t("chart.station") + this.$t("messages.no_observations_in_collection"));
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
        console.log("done");
      }
    },
    async loadRecentObservations(station: Station, limit: number) {
      this.loading = true;
      try {
        const response = await fetch(`${oapi}/collections/${station.properties.topic}/items?f=json&datetime=${this.latestResultTime}/..&wigos_station_identifier=${station.id}&limit=${limit}`);
        const data = await response.json();
        const features: FeatureLayerForMap[] = data.features;
        this.recentObservations = features.map((obs) => obs.properties);
      } catch (error) {
        catchAndDisplayError(error as string);
      } finally {
        this.loading = false;
      }
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
}
</style>

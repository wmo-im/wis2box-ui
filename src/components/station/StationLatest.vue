<template id="station-status">
  <div class="station-status">
    <h5 class="text-left">
      {{ $t("messages.from") + " " + latestResultTime }}
    </h5>
    <v-table>
      <table>
        <tr v-for="item in recentObservations" :key="i">
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
import { getNameTime, clean, hasLinks } from "@/scripts/helpers.js";

const oapi = window.VUE_APP_OAPI;

export interface Observation {
  units: string;
  value: string;
  description: string;
}

export default defineComponent({
  name: "StationLatest",
  template: "#station-latest",
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
          this.$root.catch(`
            ${clean(station.properties.name)} ${this.$t(
            "messages.no_linked_collections"
          )} <br> ${this.$t("messages.how_to_link_station")}`);
          this.loading = false;
          this.tab = null;
        }
      },
    },
  },
  methods: {
    getNameTime,
    async loadObservations(station) {
      try {
        const response = await fetch(`${oapi}/collections/${station.properties.topic}/items?f=json&sortby=-resultTime&wigos_station_identifier=${station.id}&limit=1`);
        const data = await response.json();

        const feature = data.features[0];
        if (feature && feature.properties && feature.properties.resultTime) {
          this.latestResultTime = feature.properties.resultTime;
          this.loadRecentObservations(station, data.numberMatched);
        } else {
          this.$root.catch(this.$t("chart.station") + this.$t("messages.no_observations_in_collection"));
        }
      } catch (error) {
        this.$root.catch(error);
      } finally {
        this.tab = 0;
        this.loading = false;
        console.log("done");
      }
    },
    async loadRecentObservations(station, limit) {
      this.loading = true;
      try {
        const response = await fetch(`${oapi}/collections/${station.properties.topic}/items?f=json&datetime=${this.latestResultTime}/..&wigos_station_identifier=${station.id}&limit=${limit}`);
        const data = await response.json();
        this.recentObservations = data.features.map(obs => obs.properties);
      } catch (error) {
        this.$root.catch(error);
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

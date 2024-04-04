<template id="station-status">
  <div class="station-status">
    <h5 class="text-left">
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

<script>
import { defineComponent } from "vue";
let oapi = window.VUE_APP_OAPI;

import { getNameTime, clean, hasLinks } from "@/scripts/helpers.js";

export default defineComponent({
  name: "StationLatest",
  template: "#station-latest",
  props: ["features", "map"],
  data() {
    return {
      features_: this.features,
      recentObservations: [],
      latestResultTime: null,
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
      var self = this;
      await this.$http({
        method: "get",
        url: oapi + "/collections/" + station.properties.topic + "/items",
        params: {
          f: "json",
          sortby: "-resultTime",
          wigos_station_identifier: station.id,
          limit: 1,
        },
      })
        .then(function (response) {
          // handle success
          var feature = response.data.features[0];
          if (feature && feature.properties && feature.properties.resultTime){
            self.latestResultTime = feature.properties.resultTime;
            self.loadRecentObservations(station, response.data.numberMatched);
          } else {
            self.$root.catch(self.$t("chart.station") + self.$t("messages.no_linked_collections"));
          }
        })
        .catch(this.$root.catch)
        .then(function () {
          self.tab = 0;
          self.loading = false;
          console.log("done");
        });
    },
    async loadRecentObservations(station, limit) {
      this.loading = true;
      var self = this;
      await this.$http({
        method: "get",
        url: oapi + "/collections/" + station.properties.topic + "/items",
        params: {
          f: "json",
          datetime: `${self.latestResultTime}/..`,
          wigos_station_identifier: station.id,
          limit: limit,
        },
      }).then(function (response) {
        // handle success
        self.recentObservations = response.data.features.map(
          (obs) => obs.properties
        );
      }).catch(this.$root.catch);
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

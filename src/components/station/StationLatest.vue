<template id="station-status">
  <div class="station-status">
    <h5 class="text-left">
      {{ $t("messages.from") + " " + latestResultTime }}
    </h5>
    <v-table>
      <table>
        <tr v-for="(item, i) in recentObservations" :key="i">
          <th width="50%">{{ $root.parseForNameAndTime(item) }}</th>
          <td width="50%">{{ item.value + " " + item.units }}</td>
        </tr>
      </table>
    </v-table>
  </div>
</template>

<script>
import { defineComponent } from "vue";

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
        if (station.links.length === 0) {
          this.msg = `
            ${this.$root.clean(station.properties.name)} ${this.$t(
            "messages.no_linked_collections"
          )}. ${this.$t("messages.how_to_link_station")}`;
          this.snackbar = true;
          this.loading = false;
          this.tab = null;
        } else {
          this.loadObservations(station);
        }
      },
    },
  },
  methods: {
    async loadObservations(station) {
      var self = this;
      await this.$http({
        method: "get",
        url: station.links[0].href + "/items",
        params: {
          f: "json",
          sortby: "-resultTime",
          wigos_station_identifier: station.id,
          limit: 1,
        },
      })
        .then(function (response) {
          // handle success
          self.latestResultTime =
            response.data.features[0].properties.resultTime;
          self.loadRecentObservations(station, response.data.numberMatched);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
          if (error.response.status === 401) {
            self.msg = self.$t("messages.not_authorized");
            self.snackbar = true;
          }
        })
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
        url: station.links[0].href + "/items",
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
      });
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

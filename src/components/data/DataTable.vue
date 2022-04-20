<template id="data-table">
  <div class="data-table">
    <v-card min-height="600px">
      <v-table v-show="title !== ''">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-center" v-html="$t('table.time')" />
              <th class="text-center" v-html="title" />
            </tr>
          </thead>
        </template>
      </v-table>

      <v-alert v-show="alert.value" type="warning" v-html="alert.msg" />

      <v-card id="scroll-target" class="overflow-y-auto" max-height="500">
        <v-table v-scroll:#scroll-target="onScroll">
          <template v-slot:default>
            <tbody>
              <tr v-for="(date, index) in data.time" :key="index">
                <td v-html="formatDate(date)" />
                <td v-html="data.value[index]" />
              </tr>
            </tbody>
          </template>
        </v-table>
      </v-card>
    </v-card>
  </div>
</template>

<script>
import { defineComponent } from "vue";

let oapi = window.VUE_APP_OAPI;

export default defineComponent({
  name: "DataTable",
  template: "#data-table",
  props: ["choices", "alert"],
  watch: {
    choices: {
      handler(newValue) {
        if (this.loading === true) {
          return;
        }
        this.loading = true;
        if (newValue.collection !== "" && newValue.datastream !== "") {
          this.data = {};
          for (var station of this.choices_.station) {
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
      choices_: this.choices,
      data: {},
      loading: false,
      title: "",
      headerOverflow: 0,
      alert_: this.alert,
    };
  },
  methods: {
    onScroll(e) {
      this.headerOverflow = e.target.scrollTop;
    },
    formatDate(date) {
      return new Date(date).toLocaleString(this.$t("code"), {
        timeZoneName: "short",
        timeZone: "UTC",
        hour12: false,
      });
    },
    getCol(features, key) {
      if (key.includes(".")) {
        const split = key.split(".");
        if (split.length === 2) {
          return features.map(function (row) {
            return row["properties"][split[0]][split[1]];
          });
        } else if (split.length === 3) {
          return features.map(function (row) {
            return row["properties"][split[0]][split[1]][split[2]];
          });
        }
      } else {
        return features.map(function (row) {
          return row["properties"][key];
        });
      }
    },
    newTable(features, colName) {
      this.data.time = this.getCol(features, "phenomenonTime");
      this.data.value = this.getCol(features, colName);
      this.loading = false;
    },
    async loadCollection(collection, station_id) {
      const title = collection.description;
      this.alert_.msg =
        station_id + this.$t("messages.no_observations_in_collection") + title;

      this.loading = true;
      var self = this;

      await this.$http({
        method: "get",
        url: oapi + "/collections/" + collection.id + "/items",
        params: {
          f: "json",
          wigos_station_identifier: station_id,
          resulttype: "hits",
        },
      })
        .then(function (response) {
          // handle success
          self.loadObservations(
            collection.id,
            response.data.numberMatched,
            station_id
          );
        })
        .catch(function (error) {
          // handle error
          if (error.response.status === 401) {
            self.alert_.msg = self.$t("messages.not_authorized");
            self.alert_.value = true;
          }
          console.log(error);
          self.loading = false;
        })
        .then(function () {
          console.log("done");
        });
    },
    async loadObservations(collection_id, limit, station_id) {
      if (limit === 0) {
        this.alert_.value = true;
        this.loading = false;
        return;
      } else {
        var self = this;
        this.loading = true;
        await this.$http({
          method: "get",
          url: oapi + "/collections/" + collection_id + "/items",
          params: {
            f: "json",
            wigos_station_identifier: station_id,
            sortby: "-phenomenonTime",
            limit: limit,
          },
        })
          .then(function (response) {
            // handle success
            self.title =
              self.choices_.datastream.name +
              " (" +
              self.choices_.datastream.units +
              ")";
            self.newTable(
              response.data.features,
              "observations." + self.choices_.datastream.id + ".value"
            );
          })
          .catch(function (error) {
            // handle error
            console.log(error);
            self.loading = false;
          })
          .then(function () {
            console.log("done");
          });
      }
    },
  },
});
</script>
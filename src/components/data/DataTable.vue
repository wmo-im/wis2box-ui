<template id="data-table">
  <div class="data-table">
    <v-card min-height="600px" class="ma-4">
      <v-alert v-show="alert.value" type="warning" v-html="alert.msg" />

      <v-table v-show="title !== ''" fixed-header height="600px">
        <thead>
          <tr>
            <th class="text-center" v-html="$t('table.result_time')" />
            <th class="text-center" v-html="$t('table.phenomenon_time')" />
            <th class="text-center" v-html="title" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="(date, i) in data.time" :key="i">
            <td v-html="date" />
             <td v-html="data.phenomenonTime[i]" />
            <td v-html="data.value[i]" />
          </tr>
        </tbody>
      </v-table>
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
  mounted: function () {
    this.$nextTick(() => {
      if (this.choices_.collection !== "" && this.choices_.datastream !== "") {
        for (var station of this.choices_.station) {
          this.loadCollection(this.choices_.collection, station);
        }
      }
    });
  },
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
    async loadCollection(collection, station_id) {
      const title = collection.description;
      const datastream = this.choices_.datastream;

      this.alert_.msg =
        station_id + this.$t("messages.no_observations_in_collection") + title;

      this.loading = true;
      var self = this;

      await this.$http({
        method: "get",
        url: oapi + "/collections/" + collection.id + "/items",
        params: {
          f: "json",
          name: datastream.id,
          index: datastream.index,
          wigos_station_identifier: station_id,
          resulttype: "hits",
        },
      })
        .then(function (response) {
          // handle success
          self.loadObservations(
            collection.id,
            response.data.numberMatched,
            datastream,
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
    async loadObservations(collection_id, limit, datastream, station_id) {
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
            name: datastream.id,
            index: datastream.index,
            wigos_station_identifier: station_id,
            sortby: "-resultTime",
            limit: limit,
          },
        })
          .then(function (response) {
            // handle success
            self.title = `${datastream.name} (${datastream.units})`;
            self.data.time = self.getCol(response.data.features, "resultTime");
            self.data.phenomenonTime = self.getCol(
              response.data.features,
              "phenomenonTime"
            );
            self.data.value = self.getCol(response.data.features, "value");
          })
          .catch(function (error) {
            // handle error
            console.log(error);
          })
          .then(function () {
            self.loading = false;
            console.log("done");
          });
      }
    },
  },
});
</script>

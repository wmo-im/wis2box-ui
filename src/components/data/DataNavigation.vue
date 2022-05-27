<template id="data-navigation">
  <div class="data-navigation">
    <v-navigation-drawer floating permanent color="#d5e3f0">
      <v-container>
        <v-list-item-title class="text-h6 py-2" v-html="$t('chart.options')" />

        <v-divider class="my-2" />

        <v-list-item-subtitle v-html="$t('chart.collection')" />
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-list-item
              class="font-weight-bold text-center py-3"
              v-bind="props"
            >
              {{ choices.collection.description || $t("chart.collection") }}
            </v-list-item>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, i) in choices.collections"
              :key="i"
              link
              @click="updateCollection(item)"
            >
              <v-list-item-title v-html="clean(item.title)" />
            </v-list-item>
          </v-list>
        </v-menu>

        <v-divider class="my-2" />

        <v-list-item-subtitle v-html="$t('chart.observed_property')" />
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-list-item
              class="font-weight-bold text-center py-3"
              v-bind="props"
            >
              {{ choices.datastream.name || $t("chart.observed_property") }}
            </v-list-item>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, i) in choices.datastreams"
              :key="i"
              link
              @click="updateData(item)"
            >
              <v-list-item-text v-html="this.clean(item.name)" />
            </v-list-item>
          </v-list>
        </v-menu>
      </v-container>
    </v-navigation-drawer>
  </div>
</template>

<script>
let oapi = window.VUE_APP_OAPI;

export default {
  name: "DataNavigation",
  template: "#data-navigation",
  props: ["choices", "alert"],
  data() {
    return {
      choices_: this.choices,
      alert_: this.alert,
    };
  },
  methods: {
    async updateCollection(newC) {
      this.choices_.collection = newC;
      const [station] = this.choices_.station;
      console.log(station);
      var request_url = `${oapi}/collections/${newC.id}/items?f=json&sortby=-resultTime&wigos_station_identifier=${station}&properties=resultTime&limit=1`;
      var response = await fetch(request_url);
      var data = await response.json();
      var resultTime = data.features[0].properties.resultTime;
      var resultCount = data.numberMatched;
      var self = this;
      await this.$http({
        method: "get",
        url: oapi + "/collections/" + newC.id + "/items",
        params: {
          wigos_station_identifier: station,
          datetime: `${resultTime}/..`,
          f: "json",
          limit: resultCount,
        },
      })
        .then(function (response) {
          // handle success
          for (const item of response.data.features) {
            self.choices_.datastreams.push(item.properties);
          }
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
    updateData(newD) {
      this.choices_.datastream = {
        id: newD.name,
        name: this.clean(newD.name),
        units: newD.units,
      }
    },
    clean(word) {
      if (typeof word === "string") {
        return (
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).replaceAll("_", " ");
      }
    },
  },
};
</script>

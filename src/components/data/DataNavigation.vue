<template id="data-navigation">
  <div class="data-navigation">
    <v-navigation-drawer permanent absolute color="#d5e3f0" class="text-center">
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-list-item class="pa-2 text-h6" v-bind="props">
            {{ choices.collection.description || $t("chart.collection") }}
          </v-list-item>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, i) in choices.collections"
            :key="i"
            :value="item.title"
            @click="updateCollection(item)"
          >
            <v-list-item-title v-html="$root.clean(item.title)" />
          </v-list-item>
        </v-list>
      </v-menu>

      <v-divider />

      <v-list-item-subtitle
        class="mt-2"
        v-html="$t('chart.observed_property')"
      />
      <v-list nav max-height="480px" bg-color="#d5e3f0">
        <template
          v-for="(item, i) in choices.datastreams"
          :key="i"
          class="mr-3"
        >
          <v-list-item
            :value="i"
            active-color="#014e9e"
            :active="model === i"
            class="text-left text-body-2"
            @click="updateData(item, i)"
          >
            {{ $root.clean(item.name) }}
          </v-list-item>
          <v-divider
            class="pb-1 mx-2"
            v-if="i < choices.datastreams.length - 1"
          />
        </template>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
let oapi = window.VUE_APP_OAPI;

export default {
  name: "DataNavigation",
  template: "#data-navigation",
  props: ["choices", "alert", "station"],
  data() {
    return {
      choices_: this.choices,
      alert_: this.alert,
      model: -1,
    };
  },
  watch: {
    "choices.collections": {
      handler(c) {
        if (this.station.links.length > 0) {
          for (const item of c) {
            if (this.station.links[0].title === item.id) {
              this.updateCollection(item);
            }
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    async updateCollection(newC) {
      this.choices_.collection = newC;
      var station = this.station.id;
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
    updateData(newD, index) {
      this.choices_.datastream = {
        id: newD.name,
        name: this.$root.clean(newD.name),
        units: newD.units,
      };
      this.model = index;
    },
  },
};
</script>

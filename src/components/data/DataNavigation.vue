<template id="data-navigation">
  <div class="data-navigation">
    <v-navigation-drawer floating permanent color="#d5e3f0">
      <v-list nav color="#d5e3f0">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title
              class="text-h6 py-2"
              v-html="$t('chart.options')"
            />

            <v-divider class="my-2" />

            <v-list-item-subtitle v-html="$t('chart.collection')" />
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-container fluid>
                  <v-btn
                    block
                    variant="text"
                    class="font-weight-bold"
                    v-bind="props"
                  >
                    {{
                      choices.collection.description || $t("chart.collection")
                    }}
                  </v-btn>
                </v-container>
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
            <v-menu class="my-2">
              <template v-slot:activator="{ props }">
                <v-container fluid>
                  <v-btn
                    block
                    variant="text"
                    class="font-weight-bold"
                    v-bind="props"
                  >
                    {{
                      choices.datastream.name || $t("chart.observed_property")
                    }}
                  </v-btn>
                </v-container>
              </template>
              <v-list>
                <v-list-item
                  v-for="(val, key, i) in choices.datastreams"
                  :key="i"
                  link
                  @click="updateData(key)"
                >
                  <v-list-item-text v-html="clean(key)" />
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item-content>
        </v-list-item>
      </v-list>
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
      var self = this;
      await this.$http({
        method: "get",
        url: oapi + "/collections/" + newC.id + "/items",
        params: {
          f: "json",
          limit: 1,
        },
      })
        .then(function (response) {
          // handle success
          self.choices_.datastreams =
            response.data.features[0].properties.observations;
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
      this.choices_.datastream = this.choices_.datastreams[newD];
      this.choices_.datastream.id = newD;
      this.choices_.datastream.name = this.clean(newD);
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

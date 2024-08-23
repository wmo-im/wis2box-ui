<template id="datasets">
  <div class="datasets">
    <v-card flat>
      <v-alert border="start" variant="contained-text" color="#014e9e">
        <h2>{{ $t("messages.welcome") }}</h2>
      </v-alert>
      <v-card class="pa-2">
        <v-row v-for="(item, i) in datasets" :key="i">
          <v-col sm="12" md="3">
            <v-container>
              <v-row justify="center" fill-height>
                <template v-if="item.hasObs">
                  <v-card class="pa-0 ma-0" @click="loadMap(item.id)">
                    <v-overlay open-on-hover contained activator="parent" class="align-center justify-center">
                      <v-btn flat>
                        {{ $t("datasets.map") }}
                      </v-btn>
                    </v-overlay>
                    <dataset-map :dataset="item" />
                  </v-card>
                </template>
                <template v-else>
                  <v-card class="pa-0 ma-0">
                    <dataset-map :dataset="item" />
                  </v-card>
                </template>
              </v-row>
            </v-container>
          </v-col>
          <v-col sm="12" md="9" class="text-center">
            <v-col>
              <h2>
                {{ item.properties.title }}
              </h2>
            </v-col>
            <v-col class="flex-nowrap">
              <span class="pt-2">
                <strong>{{ $t("datasets.topic") + ": " }}</strong>
                <code>{{ item.properties['wmo:topicHierarchy'] }}</code>
              </span>
            </v-col>
            <v-col>
              <v-btn-group
                v-show="$vuetify.display.mdAndUp"
                variant="outlined"
                divided
              >
                <v-btn
                  v-for="(item, i) in item.links"
                  :key="i"
                  :title="item.type"
                  :href="item.href"
                  :to="item.target"
                  :target="`_window_${item.type}`"
                >
                  {{ $t(`datasets.${item.msg}`) }}
                  <v-icon end :icon="item.icon" />
                </v-btn>
              </v-btn-group>
              <v-row
                v-show="$vuetify.display.smAndDown"
                v-for="(item, i) in item.links"
                :key="i"
                justify="center"
                class="my-1"
              >
                <v-btn
                  block
                  variant="outlined"
                  :title="item.type"
                  :href="item.href"
                  :to="item.target"
                  :target="`_window_${item.type}`"
                >
                  {{ $t(`datasets.${item.msg}`) }}
                  <v-icon end :icon="item.icon" />
                </v-btn>
              </v-row>
            </v-col>
          </v-col>
          <v-divider v-if="i + 1 < datasets.length" />
        </v-row>
      </v-card>
    </v-card>
  </div>
</template>

<script>
import DatasetMap from "../components/leaflet/DatasetMap.vue";

let oapi = window.VUE_APP_OAPI;

export default {
  name: "datasets",
  template: "#datasets",
  components: {
    DatasetMap,
  },
  data: function () {
    return {
      datasets: [],
    };
  },
  mounted() {
    this.loadDatasets();
  },
  methods: {
    async loadDatasets() {
      var self = this;
      await this.$http({
        method: "get",
        url: oapi + "/collections/discovery-metadata/items"
      })
        .then(function (response) {
          // handle success
          for (var c of response.data.features) {
            const links = [];
            c.hasObs = c.properties["wmo:topicHierarchy"].includes("surface-based-observations/synop");
            if (c.hasObs) {
              links.push({
                href: undefined,
                target: `/fixed-land-station-map/${c.id}`,
                type: "Map",
                msg: "explore",
                icon: "mdi-map-marker-circle",
              })
            }
            for (var link of c.links) {
              if (link.rel === "canonical") {
                links.push({
                  href: link.href,
                  target: undefined,
                  type: "OARec",
                  msg: "oarec",
                  icon: "mdi-open-in-new",
                });
              } else if (link.rel === "collection" && c.hasObs) {
                links.push({
                  href: link.href,
                  target: undefined,
                  type: "OAFeat",
                  msg: "oafeat",
                  icon: "mdi-open-in-new",
                });
              }
            }
            c.bbox = [
              c.geometry.coordinates[0][0][0],
              c.geometry.coordinates[0][0][1],
              c.geometry.coordinates[0][2][0],
              c.geometry.coordinates[0][2][1],
            ];
            c.links = links;
            self.datasets.push(c);
          }
        })
        .catch(this.$root.catch)
    },
    loadMap(topic) {
      this.$router.push(`/fixed-land-station-map/${topic}`);
    },
  },
};
</script>

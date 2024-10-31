<template id="datasets">
  <div class="datasets">
    <v-card flat>
      <v-alert border="start" variant="text" color="#014e9e">
        <h2>{{ $t("messages.welcome") }}</h2>
      </v-alert>
      <div class="d-flex justify-center mt-16">
        <v-progress-linear v-if="loading" indeterminate color="primary" />
      </div>

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
                  <i>
                    {{ $t("messages.no_observations_in_collection") }}
                  </i>

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
              <v-btn-group v-show="$vuetify.display.mdAndUp" variant="outlined" divided>
                <v-btn v-for="(item, i) in item.links" :key="i" :title="item.type" :href="item.href" :to="item.target"
                  :target="`_window_${item.type}`">
                  {{ $t(`datasets.${item.msg}`) }}
                  <v-icon end :icon="item.icon" />
                </v-btn>
              </v-btn-group>
              <v-row v-show="$vuetify.display.smAndDown" v-for="(item, i) in item.links" :key="i" justify="center"
                class="my-1">
                <v-btn block variant="outlined" :title="item.type" :href="item.href" :to="item.target"
                  :target="`_window_${item.type}`">
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

<script lang="ts">
import { defineComponent } from "vue";
import DatasetMap from "../components/leaflet/DatasetMap.vue";
import type { Dataset, ItemsResponse } from "@/lib/types";

const oapi = window.VUE_APP_OAPI;

export default defineComponent({
  components: {
    DatasetMap,
  },
  data: function () {
    return {
      datasets: [] as Dataset[],
      loading: true
    };
  },
  mounted() {
    this.loadDatasets();
  },
  methods: {
    async loadDatasets() {
      try {
        this.loading = true;
        const response = await fetch(oapi + "/collections/discovery-metadata/items");
        if (!response.ok) {
          throw new Error("Fetch failed with status: " + response.status);
        }
        const data: ItemsResponse = await response.json();
        for (const feature of data.features) {
          const uiLinks = [];

          const hasObs = feature.properties["wmo:topicHierarchy"].includes("surface-based-observations/synop");
          if (hasObs) {
            uiLinks.push({
              href: undefined,
              target: `/fixed-land-station-map/${feature.id}`,
              type: "Map",
              msg: "explore",
              icon: "mdi-map-marker-circle",
            });
          }
          for (const link of feature.links) {
            console.log(link.rel)
            if (link.rel === "canonical") {
              uiLinks.push({
                href: link.href,
                target: undefined,
                type: "OARec",
                msg: "oarec",
                icon: "mdi-open-in-new",
              });
            } else if (link.rel === "collection" && hasObs) {
              uiLinks.push({
                href: link.href,
                target: undefined,
                type: "OAFeat",
                msg: "oafeat",
                icon: "mdi-open-in-new",
              });
            }
          }
          const bbox = [
            feature.geometry.coordinates[0][0][0],
            feature.geometry.coordinates[0][0][1],
            feature.geometry.coordinates[0][2][0],
            feature.geometry.coordinates[0][2][1],
          ];
          const dataset: Dataset = {
            hasObs,
            bbox,
            uiLinks,
            ...feature,
          }
          this.datasets.push(dataset);
        }
      } catch (error) {
        console.error(error);
      }
      finally {
        this.loading = false
      }
    },
    loadMap(topic: string) {
      this.$router.push(`/fixed-land-station-map/${topic}`);
    },
  },
});
</script>

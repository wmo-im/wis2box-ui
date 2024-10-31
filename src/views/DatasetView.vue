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
        <v-row v-for="(dataset, index) in datasets" :key="index">
          <v-col sm="12" md="3">
            <v-container>
              <v-row justify="center" fill-height>
                <template v-if="dataset.hasObs">
                  <v-card class="pa-0 ma-0" @click="loadMap(dataset.id)">
                    <v-overlay open-on-hover contained activator="parent" class="align-center justify-center">
                      <v-btn flat>
                        {{ $t("datasets.map") }}
                      </v-btn>
                    </v-overlay>
                    <dataset-map :dataset="dataset" />
                  </v-card>
                </template>
                <template v-else>
                  <i>{{ $t("messages.no_observations_in_collection") }}</i>
                  <v-card class="pa-0 ma-0">
                    <dataset-map :dataset="dataset" />
                  </v-card>
                </template>
              </v-row>
            </v-container>
          </v-col>
          <v-col sm="12" md="9" class="text-center">
            <v-col>
              <h2>{{ dataset.properties.title }}</h2>
            </v-col>
            <v-col class="flex-nowrap">
              <span class="pt-2">
                <strong>{{ $t("datasets.topic") + ": " }}</strong>
                <code>{{ dataset.properties['wmo:topicHierarchy'] }}</code>
              </span>
            </v-col>
            <v-col>
              <v-btn-group v-show="$vuetify.display.mdAndUp" variant="outlined" divided>
                <v-btn v-for="(link, linkIndex) in dataset.uiLinks" :key="linkIndex" :title="link.type"
                  :href="link.href" :to="link.target" :target="`_window_${link.type}`">
                  {{ $t(`datasets.${link.msg}`) }}
                  <v-icon end :icon="link.icon" />
                </v-btn>
              </v-btn-group>
              <v-row v-show="$vuetify.display.smAndDown" v-for="(link, linkIndex) in dataset.uiLinks" :key="linkIndex"
                justify="center" class="my-1">
                <v-btn block variant="outlined" :title="link.type" :href="link.href" :to="link.target"
                  :target="`_window_${link.type}`">
                  {{ $t(`datasets.${link.msg}`) }}
                  <v-icon end :icon="link.icon" />
                </v-btn>
              </v-row>
            </v-col>
          </v-col>
          <v-divider v-if="index + 1 < datasets.length" />
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
  data() {
    return {
      datasets: [] as Dataset[],
      loading: true,
    };
  },
  mounted() {
    this.loadDatasets();
  },
  methods: {
    async loadDatasets() {
      try {
        this.loading = true;
        const response = await fetch(`${oapi}/collections/discovery-metadata/items`);
        if (!response.ok) {
          throw new Error("Fetch failed with status: " + response.status);
        }
        const data: ItemsResponse = await response.json();

        this.datasets = data.features.map(feature => {
          const hasObs = feature.properties["wmo:topicHierarchy"].includes("surface-based-observations/synop");
          const uiLinks = [];

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

          const bbox = feature.geometry.coordinates[0].flat(2);
          return {
            hasObs,
            bbox,
            uiLinks,
            ...feature,
          } as Dataset; // Type assertion for Dataset
        });
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    loadMap(topic: string) {
      this.$router.push(`/fixed-land-station-map/${topic}`);
    },
  },
});
</script>

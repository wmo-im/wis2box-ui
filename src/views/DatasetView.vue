<template>
  <v-card flat>
    <v-alert border="start" variant="outlined" color="#014e9e">
      <h2>{{ $t("messages.welcome") }}</h2>
    </v-alert>
    <v-card class="pa-2">
      <v-row v-for="item in datasets" :key="item.data.features[0].properties.id">
        <v-col sm="12" md="3">
          <v-container>
            <v-row justify="center" fill-height>
              <template v-if="item.hasObs">
                <v-card class="pa-0 ma-0" @click="loadMap(item.data.features[0].properties.id)">
                  <v-overlay open-on-hover contained activator="parent" class="align-center justify-center">
                    <v-btn flat>
                      {{ $t("datasets.map") }}
                    </v-btn>
                  </v-overlay>
                  <DatasetMap :dataset="item" />
                </v-card>
              </template>
              <template v-else>
                <v-card class="pa-0 ma-0">
                  <DatasetMap :dataset="item" />
                </v-card>
              </template>
            </v-row>
          </v-container>
        </v-col>
        <v-col sm="12" md="9" class="text-center">
          <v-col>
            <h2>
              {{ item.data.features[0].properties.title }}
            </h2>
          </v-col>
          <v-col class="flex-nowrap">
            <span class="pt-2">
              <strong>{{ $t("datasets.topic") + ": " }}</strong>
              <code>{{ item.data.features[0].properties['wmo:topicHierarchy'] }}</code>
            </span>
          </v-col>
          <v-col>
            <v-btn-group v-show="$vuetify.display.mdAndUp" variant="outlined" divided>
              <v-btn v-for="(link, i) in item.links" :key="i" :title="link.type" :href="link.href" :to="link.target"
                :target="`_window_${link.type}`">
                {{ $t(`datasets.${link.msg}`) }}
                <v-icon end :icon="link.icon" />
              </v-btn>
            </v-btn-group>
            <v-row v-show="$vuetify.display.smAndDown" v-for="(link, i) in item.links" :key="i" justify="center"
              class="my-1">
              <v-btn block variant="outlined" :title="link.type" :href="link.href" :to="link.target"
                :target="`_window_${link.type}`">
                {{ $t(`datasets.${link.msg}`) }}
                <v-icon end :icon="link.icon" />
              </v-btn>
            </v-row>
          </v-col>
        </v-col>
        <v-divider v-if="i + 1 < datasets.length" />
      </v-row>
    </v-card>
  </v-card>
</template>

<script lang="ts">

import DatasetMap from '@/components/leaflet/DatasetMap.vue';
import type { ItemsResponse } from '@/lib/types';

interface datasetWithMetadata {
  hasObs: boolean;
  data: ItemsResponse
  links: undefined
}

export default {
  data: function () {
    return {
      datasets: [] as datasetWithMetadata[],
    };
  },
  components: {
    DatasetMap,
  },
  mounted() {
    this.loadDatasets();
  },
  methods: {
    async loadDatasets() {
      try {
        const response = await fetch(`${window.VUE_APP_OAPI}/collections/discovery-metadata/items`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ItemsResponse = await response.json();

        for (const c of data.features) {
          const links = [];
          const hasObs = c.properties["wmo:topicHierarchy"].includes("surface-based-observations/synop");
          if (hasObs) {
            links.push({
              href: undefined,
              target: `/fixed-land-station-map/${c.properties.id}`,
              type: "Map",
              msg: "explore",
              icon: "mdi-map-marker-circle",
            });
          }
          for (const link of c.links) {
            if (link.rel === "canonical") {
              links.push({
                href: link.href,
                target: undefined,
                type: "OARec",
                msg: "oarec",
                icon: "mdi-open-in-new",
              });
            } else if (link.rel === "collection" && hasObs) {
              links.push({
                href: link.href,
                target: undefined,
                type: "OAFeat",
                msg: "oafeat",
                icon: "mdi-open-in-new",
              });
            }
          }
          const bbox = [
            c.geometry.coordinates[0][0][0],
            c.geometry.coordinates[0][0][1],
            c.geometry.coordinates[0][2][0],
            c.geometry.coordinates[0][2][1],
          ];
          this.datasets.push({
            hasObs,
            data: c,
            links,
            bbox,
          });
        }
      } catch (error) {
        console.error('Error loading datasets:', error);
      }
    },
    loadMap(topic: string) {
      this.$router.push(`/fixed-land-station-map/${topic}`);
    },
  },
};
</script>

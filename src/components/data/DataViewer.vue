<!-- Dataviewer is a popup window which contains variables and their associated tables / plots of data -->

<script setup lang="ts">

defineProps({
  station: {
    type: Object,
    required: true,
  }
})


</script>

<template id="data-viewer">
  <v-layout>
    <v-app-bar color="#EEEEEE" flat>
      <template v-slot:prepend v-if="$vuetify.display.smAndDown">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      </template>
      <v-toolbar-title v-show="$vuetify.display.mdAndUp" class="pa-2 text-h6">
        {{ choices.collection.title || $t("chart.collection") }}
      </v-toolbar-title>
      <v-tabs v-model="tab" end color="#014e9e">
        <v-tab v-for="(item, i) in tabs" class="text-center pa-2" :value="i" :key="i">
          {{ $t(item) }}
        </v-tab>
      </v-tabs>
    </v-app-bar>
    <DataNavigation :choices="choices" :station="station" :alert="alert" :drawer="{ model: drawer }" />
    <v-main>
      <v-window v-model="tab">
        <v-window-item :value="0">
          <DataPlotter :choices="choices" :alert="alert" />
        </v-window-item>
        <v-window-item :value="1">
          <DataTable :choices="choices" :alert="alert" />
        </v-window-item>
      </v-window>
    </v-main>
  </v-layout>
</template>

<script lang="ts">
import DataPlotter from "./DataPlotter.vue";
import DataNavigation from "./DataNavigation.vue";
import DataTable from "./DataTable.vue";
const oapi = window.VUE_APP_OAPI;
import { defineComponent } from "vue";
import { catchAndDisplayError } from "@/lib/errors";
import type { Choices, CollectionsResponse, ItemsResponse } from "@/lib/types";

export default defineComponent({
  components: {
    DataPlotter,
    DataNavigation,
    DataTable,
  },
  data() {
    return {
      drawer: true,
      tab: 0,
      tabs: ["chart.chart", "table.table"],
      choices: {
        collection: "",
        datastream: "",
        discovery_metadata: "",
        station: new Set([this.station.id]),
        stations: [],
        collections: [],
        datastreams: [],
      } as Choices,
      alert: {
        value: false,
        msg: "",
      },
    };
  },
  methods: {
    goBack() {
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        this.$router.push("/");
      }
    },
    async loadCollections() {
      const response = await fetch(`${oapi}/collections`);
      if (response.ok) {
        const data: CollectionsResponse = await response.json();
        this.parseCollections(data.collections);
      } else {
        console.error(response);
      }
    },
    async parseCollections(collections: CollectionsResponse["collections"]) {
      for (const c of collections) {
        if (c.id === "stations") {
          try {
            const response = await fetch(`${oapi}/collections/stations/items`);
            if (response.ok) {
              const data: ItemsResponse = await response.json();
              this.choices.stations = data;
            } else {
              console.error(response);
            }
          } catch (error) {
            console.error(error);
          }
        } else if (c.id === "discovery-metadata") {
          const url = `${oapi}/collections/discovery-metadata/items`;
          try {
            const response = await fetch(url);
            if (response.ok) {
              const data: ItemsResponse = await response.json();
              this.choices.discovery_metadata = data.features;
            } else {
              catchAndDisplayError(await response.text(), url);
            }
          } catch (error) {
            catchAndDisplayError(error as string, url);
          }
        } else if (c.id !== "messages") {
          this.choices.collections.push(c);
        }
      }
    }
  },
  watch: {
    "choices.datastream": {
      handler(datastream) {
        if (datastream !== "" && this.$vuetify.display.smAndDown) {
          this.drawer = false;
        }
      },
    },
  },
  mounted() {
    this.loadCollections();
  },
});
</script>

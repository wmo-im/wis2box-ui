<!-- Dataviewer is a popup window which contains variables and their associated tables / plots of data -->

<template id="data-viewer">
  <v-layout>
    <v-app-bar color="#EEEEEE" flat>
      <template v-slot:prepend v-if="$vuetify.display.smAndDown">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      </template>
      <v-toolbar-title v-show="$vuetify.display.mdAndUp" class="pa-2 text-h6">
        {{ selectedStation.properties.name || $t("chart.collection") }}
      </v-toolbar-title>
      <v-tabs v-model="tab" end color="#014e9e">
        <v-tab v-for="(item, i) in tabs" class="text-center pa-2" :value="i" :key="i">
          {{ $t(item) }}
        </v-tab>
      </v-tabs>
    </v-app-bar>
    <DataNavigation :datastreams="datastreams" :station="selectedStation" />
    <v-main style="height: 100vh">
      <v-window v-model="tab" style="height: 100%">
        <v-window-item :value="0">
          test
          <!-- <DataPlotter :choices="null" :alert="alert" /> -->
        </v-window-item>
        <v-window-item :value="1">
          <!-- <DataTable :choices="choices" :alert="alert" /> -->
        </v-window-item>
      </v-window>
    </v-main>
  </v-layout>

</template>

<script lang="ts">
import DataPlotter from "./DataPlotter.vue";
import DataNavigation from "./DataNavigation.vue";
import DataTable from "./DataTable.vue";
import { defineComponent, type PropType } from "vue";
import type { Choices, CollectionsResponse, Datastreams, Feature, ItemsResponse } from "@/lib/types";

export default defineComponent({
  components: {
    DataPlotter,
    DataNavigation,
    DataTable,
  },
  props: {
    selectedStation: {
      type: Object as PropType<Feature>,
      required: true,
    },
    datastreams: {
      type: Object as PropType<Datastreams>,
      required: true,
    }
  },
  data() {
    return {
      drawer: true,
      tab: 0,
      tabs: ["chart.chart", "table.table"],
      alert: {
        value: false,
        msg: "",
      },
    };
  },
});

</script>

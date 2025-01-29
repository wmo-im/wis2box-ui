<!-- Dataviewer is a popup window which contains variables and their associated tables / plots of data -->

<template id="data-viewer">
  <v-layout>
    <v-app-bar color="#EEEEEE" flat>
      <template v-slot:prepend v-if="$vuetify.display.smAndDown">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      </template>
      <v-toolbar-title v-show="$vuetify.display.mdAndUp" class="pa-2 text-h6">
        {{ verboseTopicName || $t("chart.collection") }}
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
        <v-window-item :value="0" v-if="selectedDatastream">
          <DataPlotter :selected-datastream="selectedDatastream" :selected-station="selectedStation" :topic="topic"
            :items-response="itemsResponse" :items-response-url="itemsResponseUrl" :loading="loading" />
        </v-window-item>
        <v-window-item :value="1" v-if="selectedDatastream">
          <DataTable :selected-datastream="selectedDatastream" :selected-station="selectedStation" :topic="topic"
            :items-response="itemsResponse" :items-response-url="itemsResponseUrl" :loading="loading" />
        </v-window-item>
      </v-window>
    </v-main>
  </v-layout>
</template>

<script lang="ts">
import DataPlotter from "@/components/data/DataPlotter.vue";
import DataNavigation from "@/components/data/DataNavigation.vue";
import DataTable from "@/components/data/DataTable.vue";
import { defineComponent, type PropType } from "vue";
import type { CollectionsResponse, Datastreams, Feature, ItemsResponse } from "@/lib/types";
import { useGlobalStateStore } from "@/stores/global";
import { fetchAllOAFFeatures, fetchWithToken } from "@/lib/helpers";
import { catchAndDisplayError } from "@/lib/errors";

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
    },
    topic: {
      type: String,
      required: true,
    }
  },
  computed: {
    selectedDatastream() {
      const store = useGlobalStateStore();

      return store.selectedDatastream;
    }
  },
  watch: {
    selectedDatastream: function () {
      this.loadObservations();
    }
  },
  async mounted() {
    const request = await fetchWithToken(`${window.VUE_APP_OAPI}/collections/${this.topic}`);
    if (request.ok) {
      const json: CollectionsResponse["collections"][0] = await request.json();
      this.verboseTopicName = json.title;
    }
    this.loadObservations();

  },
  methods: {
    async loadObservations() {
      if (!this.selectedDatastream) {
        return;
      }

      this.loading = true;
      try {
        const url = this.getObservationsUrl();
        const response = await fetchAllOAFFeatures(url);
        const data: ItemsResponse = await response.json();
        this.itemsResponse = data;
        this.itemsResponseUrl = response.url;
      } catch (error) {
        catchAndDisplayError(String(error));
      } finally {
        this.loading = false;
        console.log("done");
      }
    },
    getUrl() {
      return `${window.VUE_APP_OAPI}/collections/${this.topic}/items`
        + `?f=json&name=${this.selectedDatastream?.name}`
        + `&reportId=${this.selectedDatastream?.reportId}`
        + `&wigos_station_identifier=${this.selectedStation.id}`
        + '&sortby=reportTime';
    },
    getObservationsUrl() {
      return this.getUrl();
      // + `&limit=${this.chunkSize}${this.getOffset()}`; replace with datetime range
    },
  },
  data() {
    return {
      drawer: true,
      tab: 0,
      tabs: ["chart.chart", "table.table"],
      verboseTopicName: "",
      itemsResponse: {} as ItemsResponse,
      itemsResponseUrl: "",
      dateTimeRange: null,
      total: 0,
      startTime: null,
      endTime: null,
      loading: false
    };
  },
});
</script>
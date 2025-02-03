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
            :items-response="itemsResponsePaginated" :items-response-url="itemsResponseUrl" :loading="loading" />
        </v-window-item>
        <v-window-item :value="1" v-if="selectedDatastream">
          <DataTable :selected-datastream="selectedDatastream" :selected-station="selectedStation" :topic="topic"
            :items-response="itemsResponsePaginated" :items-response-url="itemsResponseUrl" :loading="loading" />
        </v-window-item>
        <v-container>
          <v-row no-gutter align="center" justify="space-between">
            <v-col cols="1">
              <div className="chunkInput">
                <label for="records">
                  Records
                </label>
                <input type="number" id="records" v-model="chunkSize" :min="1" :max="itemsResponse.numberMatched" style=""
                  title="Enter the number of records per request" />
              </div>
            </v-col>
            <v-col cols="11">
              <v-pagination v-if="totalPages > 1" v-model="page" :length="totalPages" />
            </v-col>
          </v-row>
        </v-container>
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
import { addParam, fetchAllOAFFeatures, fetchTotalFeatures, fetchWithToken, isLocalhost, replaceHostname, replaceParam } from "@/lib/helpers";
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
    },
    numberReturned() {
      return this.itemsResponse.numberReturned;
    }
  },
  watch: {
    selectedDatastream: function () {
      this.loadData();
    },
    page: function () {
      const startIndex = (this.page - 1) * this.chunkSize;
      const endIndex = startIndex + this.chunkSize;
      this.itemsResponsePaginated.features = this.itemsResponse.features.slice(startIndex, endIndex);
    },
    chunkSize: function () {
      this.page = 1;
      this.totalPages = Math.ceil(this.itemsResponse.numberReturned / this.chunkSize);

      const startIndex = (this.page - 1) * this.chunkSize;
      const endIndex = startIndex + this.chunkSize;
      this.itemsResponsePaginated.features = this.itemsResponse.features.slice(startIndex, endIndex);
    },
    numberReturned: function () {
      this.totalPages = Math.ceil(this.itemsResponse.numberReturned / this.chunkSize);
    }
  },
  async mounted() {
    const request = await fetchWithToken(`${window.VUE_APP_OAPI}/collections/${this.topic}`);
    if (request.ok) {
      const json: CollectionsResponse["collections"][0] = await request.json();
      this.verboseTopicName = json.title;
    }

    this.loadData();

  },
  methods: {

    async loadData() {
      if (!this.selectedDatastream) {
        return;
      }

      this.loading = true;
      try {
        await this.loadTotal();
        if (this.itemsResponse.numberMatched <= this.chunkSize) {
          await this.loadObservations();
        } else {

          await this.loadObservationsByChunk();
        }
      } catch (error) {
        catchAndDisplayError(String(error));
      } finally {
        this.loading = false;
        console.log("done");
      }
    },
    async loadTotal() {
      const url = this.getUrl();
      const total = await fetchTotalFeatures(url);
      this.itemsResponseUrl = addParam(url, 'limit', total.toString());
      this.itemsResponse.numberMatched = total;

    },
    async loadObservationsByChunk() {
      // Nested in loadData try catch
      let hasNextUrl = true;
      let nextUrl = this.getObservationsUrl();
      while (hasNextUrl) {
        const response = await fetchAllOAFFeatures(nextUrl);
        const data: ItemsResponse = await response.json();
        // TODO: clean this up
        if (!(this.itemsResponsePaginated.features.length > 0)) {
          this.itemsResponsePaginated.features = data.features
        }
        this.itemsResponse.features = this.itemsResponse.features.concat([...data.features])
        this.itemsResponse.numberReturned += data.features.length;
        hasNextUrl = this.hasNextUrl(data);
        if (hasNextUrl) {
          let _nextUrl = this.getNextUrl(data);
          if (isLocalhost()) {
            _nextUrl = replaceHostname(_nextUrl, window.VUE_APP_OAPI);
          }
          // If chunksize has changed, reflect this in the next request
          _nextUrl = replaceParam(_nextUrl, 'limit', this.chunkSize.toString());

          if (_nextUrl === nextUrl) {
            throw new Error('Next url matches previous, aborting request');
          }
          nextUrl = _nextUrl;
        }
      }
    },
    async loadObservations() {
      // Nested in loadData try catch
      const url = this.getObservationsUrl();
      const response = await fetchAllOAFFeatures(url);
      const data: ItemsResponse = await response.json();
      this.itemsResponse = JSON.parse(JSON.stringify(data));
      this.itemsResponsePaginated = JSON.parse(JSON.stringify(data));
    },
    getUrl() {
      const params = new URLSearchParams({
        f: 'json',
        name: this.selectedDatastream?.name ?? '',
        reportId: this.selectedDatastream?.reportId ?? '',
        wigos_station_identifier: this.selectedStation.id,
        sortby: 'reportTime',
      });

      return `${window.VUE_APP_OAPI}/collections/${this.topic}/items?${params.toString()}`;
    },
    getObservationsUrl() {
      const url = this.getUrl();
      return addParam(url, 'limit', this.chunkSize.toString());
    },
    hasNextUrl(data: ItemsResponse) {
      return data.links && data.links.length > 0 && data.links.some(link => link.rel === "next");
    },
    getNextUrl(data: ItemsResponse) {
      return data.links.find(link => link.rel === "next")?.href ?? '';
    },
  },
  data() {
    return {
      drawer: true,
      tab: 0,
      tabs: ["chart.chart", "table.table"],
      verboseTopicName: "",
      itemsResponse: { type: 'FeatureCollection', features: [], numberMatched: 0, numberReturned: 0, links: [] } as ItemsResponse,
      itemsResponsePaginated: { type: 'FeatureCollection', features: [], numberMatched: 0, numberReturned: 0, links: [] } as ItemsResponse,
      itemsResponseUrl: "",
      dateTimeRange: null,
      total: 0,
      totalPages: 0,
      page: 1,
      chunkSize: 500,
      startTime: null,
      endTime: null,
      loading: false,
    };
  },
});
</script>

<style scoped>
.chunkInput {
  display: flex;
  flex-direction: column;
  min-width: 65px;
}

.chunkInput>label {
  font-size: small;
}

.chunkInput>input {
  border: 1px solid;
  border-radius: 3px;
  padding-left: 2px;
}
</style>

<template id="data-viewer">
  <div class="data-viewer">
    <v-layout>
      <v-app-bar color="#EEEEEE" flat>
        <template v-slot:prepend v-if="$vuetify.display.smAndDown">
          <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        </template>
        <v-toolbar-title v-show="$vuetify.display.mdAndUp" class="pa-2 text-h6">
          {{ choices.collection.description || $t("chart.collection") }}
        </v-toolbar-title>
        <v-tabs v-model="tab" end color="#014e9e">
          <v-tab v-for="(item, i) in tabs" class="text-center pa-2" :value="i" :key="i">
            {{ $t(item) }}
          </v-tab>
        </v-tabs>
      </v-app-bar>
      <data-navigation :choices="choices" :station="station" :alert="alert" :drawer="{ model: drawer }" />
      <v-main>
        <v-window v-model="tab">
          <v-window-item :value="0">
            <data-plotter :choices="choices" :alert="alert" />
          </v-window-item>
          <v-window-item :value="1">
            <data-table :choices="choices" :alert="alert" />
          </v-window-item>
        </v-window>
      </v-main>
    </v-layout>
  </div>
</template>

<script lang="ts">
import DataPlotter from "./DataPlotter.vue";
import DataNavigation from "./DataNavigation.vue";
import DataTable from "./DataTable.vue";
const oapi = window.VUE_APP_OAPI;
import { defineComponent } from "vue";

export default defineComponent({
  name: "DataViewer",
  template: "#data-viewer",
  props: ["station"],
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
      },
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
      await this.$http({
        method: "get",
        url: `${oapi}/collections`
      })
        .then((response) => {
          this.parseCollections(response.data.collections);
        })
        .catch(this.$root.catch);
    },
    async parseCollections(collections) {
      for (const c of collections) {
        if (c.id === "stations") {
          await this.$http({
            method: "get",
            url: `${oapi}/collections/stations/items`
          })
            .then(function (response) {
              self.choices.stations = response.data;
            })
            .catch(this.$root.catch);
        } else if (c.id === "discovery-metadata") {
          await this.$http({
            method: "get",
            url: `${oapi}/collections/discovery-metadata/items`
          })
            .then(function (response) {
              self.choices.discovery_metadata = response.data.features;
            })
            .catch(this.$root.catch);
        } else if (c.id !== "messages") {
          this.choices.collections.push(c);
        }
      }
      this.loading = false;
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
    this.loading = true;
    this.loadCollections();

  },
});
</script>

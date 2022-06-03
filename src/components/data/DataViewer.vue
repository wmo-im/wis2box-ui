<template id="data-viewer">
  <div class="data-viewer">
    <v-layout>
      <data-navigation :choices="choices" :station="station" :alert="alert" />
      <v-row justify="center" fill-height>
        <v-main>
          <v-toolbar color="#d5e3f0">
            <v-spacer />
            <v-tabs v-model="tab" end>
              <v-tab
                v-for="(item, i) in tabs"
                class="text-center pa-2"
                :value="i"
                :key="i"
              >
                {{ $t(item) }}
              </v-tab>
            </v-tabs>
          </v-toolbar>
          <v-window v-model="tab">
            <v-window-item :value="0">
              <data-plotter :choices="choices" :alert="alert" />
            </v-window-item>
            <v-window-item :value="1">
              <data-table :choices="choices" :alert="alert" />
            </v-window-item>
          </v-window>
        </v-main>
      </v-row>
    </v-layout>
  </div>
</template>

<script>
import DataPlotter from "./DataPlotter.vue";
import DataNavigation from "./DataNavigation.vue";
import DataTable from "./DataTable.vue";
let oapi = window.VUE_APP_OAPI;
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
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
  },
  watch: {
    tab: {
      handler() {
        this.alert.value = false;
      },
    },
  },
  async created() {
    this.loading = true;
    const response = await fetch(oapi + "/collections?f=json");
    const data = await response.json();
    for (var c of data.collections) {
      if (c.id === "stations") {
        const response = await fetch(
          oapi + "/collections/stations/items?f=json"
        );
        this.choices.stations = await response.json();
      } else if (c.id === "discovery-metadata") {
        const response = await fetch(
          oapi + "/collections/discovery-metadata/items?f=json"
        );
        this.choices.discovery_metadata = await response.json();
      } else {
        this.choices.collections.push(c);
      }
    }
    this.loading = false;
  },
});
</script>

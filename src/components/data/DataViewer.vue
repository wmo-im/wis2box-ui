<template id="data-viewer">
  <div class="data-viewer">
    <v-card>
      <v-layout>
        <data-navigation :choices="choices" :alert="alert" />
        <v-main>
          <template v-if="choice === 2">
            <data-plotter :choices="choices" :alert="alert" />
          </template>
          <template v-else-if="choice === 3">
            <data-table :choices="choices" :alert="alert" />
          </template>
        </v-main>
      </v-layout>
    </v-card>
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
  props: ["station", "choice"],
  components: {
    DataPlotter,
    DataNavigation,
    DataTable,
  },
  data() {
    return {
      drawer: true,
      choices: {
        collection: "",
        datastream: "",
        discovery_metadata: "",
        station: new Set([this.station]),
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
    choice: {
      handler() {
        this.choices.datastream = "";
        this.choices.collection = "";
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
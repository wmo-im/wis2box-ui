<template id="plotter-dialog">
  <div class="plotter-dialog">
    <v-container fluid>
      <v-row fill-height>
        <plotter-navigation :choices="choices" />
        <v-col cols="9" offset="3">
          <template v-if="choice === 2">
            <plotter-chart :choices="choices" />
          </template>
          <template v-else-if="choice === 3">
            <data-table :choices="choices" />
          </template>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>



<script>
import PlotterChart from "@/components/PlotterChart.vue";
import PlotterNavigation from "@/components/PlotterNavigation.vue";
import DataTable from "@/components/DataTable.vue";
let oapi = process.env.VUE_APP_OAPI;
import { defineComponent } from "vue";

export default defineComponent({
  name: "PlotterDialog",
  template: "#plotter-dialog",
  props: ["station", "choice"],
  components: {
    PlotterChart,
    PlotterNavigation,
    DataTable,
  },
  data() {
    return {
      choices: {
        collection: "",
        datastream: "",
        discovery_metadata: "",
        station: new Set([this.station]),
        stations: [],
        collections: [],
        datastreams: [],
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
      }
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

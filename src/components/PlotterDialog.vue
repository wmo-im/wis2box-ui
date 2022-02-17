<template id="plotter-dialog">
  <div class="plotter-dialog">
    <v-container fluid>
      <v-row fill-height>
        <v-col cols="3">
          <plotter-navigation :choices="choices" />
        </v-col>
        <v-col cols="9" offset="3">
          <plotter-chart :choices="choices" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>



<script>
import PlotterChart from "@/components/PlotterChart.vue";
import PlotterNavigation from "@/components/PlotterNavigation.vue";
let oapi = process.env.VUE_APP_OAPI;
import { defineComponent } from "vue";

export default defineComponent({
  name: "PlotterDialog",
  template: "#plotter-dialog",
  props: ["station"],
  components: {
    PlotterChart,
    PlotterNavigation,
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

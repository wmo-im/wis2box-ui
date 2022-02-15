<template id="plotter">
  <v-card min-height="450" min-width="700">
    <v-row class="fill-height" no-gutters>
      <v-col cols="3">
        <plotter-navigation :choices="choices" />
      </v-col>
      <v-col cols="9" offset="3">
        <plotter-chart :choices="choices" />
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import PlotterChart from "@/components/PlotterChart.vue";
import PlotterNavigation from "@/components/PlotterNavigation.vue";

export default {
  name: "Plotter",
  components: {
    PlotterChart,
    PlotterNavigation,
  },
  data() {
    return {
      choices: {
        collection: "",
        stations: [],
      },
      array: [0, 50, 25, 75, 50, 100],
    };
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
  },
  // async created() {
  //   this.loading = true;
  //   const response = await fetch(oapi + "/collections?f=json");
  //   const data = await response.json();
  //   for (var c of data.collections) {
  //     this.collections.push(c.id);
  //   }
  //   this.loading = false;
  // },
};
</script>

<template>
  <v-layout>
    <v-card min-height="450" min-width="700">
      <v-row class="fill-height" no-gutters>
        <!-- <v-col cols="3">
          <chart-navigation :collections_choice="collections_choice" />
        </v-col> -->
        <v-col cols="12">
          <chart-plot datastream="'25d0db7725644ba0b506ab5c89ebfa8e'" />
        </v-col>
      </v-row>
    </v-card>
  </v-layout>
</template>

<script>
import ChartPlot from "@/components/ChartPlot.vue";
// import ChartNavigation from "@/components/ChartNavigation.vue";

export default {
  name: "Plot",
  components: {
    ChartPlot,
    // ChartNavigation,
  },
  data() {
    return {
      collections_choice: null,
      array: [0, 50, 25, 75, 50, 100],
    };
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    plot(feature) {
      this.$router.push(` path: "/plot", params: { id: ${feature.id} } });`);
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

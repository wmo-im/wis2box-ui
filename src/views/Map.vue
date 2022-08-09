<template id="map">
  <div class="dialog" :style="{ opacity: $root.dialog ? '1' : '0' }">
    <chart-dialog :features="features" />
  </div>
  <div class="map" :style="{ opacity: $root.dialog ? '0' : '1' }">
    <v-alert border="start" variant="contained-text" color="#014e9e">
      <h2>{{ $t("messages.welcome") }}</h2>
    </v-alert>

    <v-card flat>
      <wis-map :features="features" :params="{ limit: 25 }" />
    </v-card>
  </div>
</template>

<script>
import ChartDialog from "../components/ChartDialog.vue";
import WisMap from "../components/leaflet/WisMap.vue";

export default {
  name: "Map",
  template: "#map",
  components: {
    ChartDialog,
    WisMap,
  },
  data: function () {
    return {
      features: {
        stations: null,
        station: null,
        datastreams: [],
      },
    };
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
  },
};
</script>

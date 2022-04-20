<template id="home">
  <div class="dialog" :style="{ opacity: $root.dialog ? '1' : '0' }">
    <chart-dialog :feature="feature" />
  </div>
  <div class="home" :style="{ opacity: $root.dialog ? '0' : '1' }">
    <v-alert
      border="start"
      variant="contained-text"
      color="#014e9e"
    >
      <h2>{{ $t("messages.welcome") }}</h2>
    </v-alert>

    <v-card>
      <wis-map :feature="feature" :params="{ limit: 25 }" />
    </v-card>
  </div>
</template>

<script>
import ChartDialog from "../components/ChartDialog.vue";
import WisMap from "../components/WisMap.vue";

export default {
  name: "Home",
  template: "#home",
  components: {
    ChartDialog,
    WisMap,
  },
  data: function () {
    return {
      feature: {
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

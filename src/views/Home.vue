<template id="home">
  <div class="home">
    <v-container>
      <h1>{{ $t("messages.welcome") }}</h1>
    </v-container>
    <div :style="{ visibility: loading ? 'visible' : 'hidden' }">
      <v-progress-linear striped indeterminate color="primary" />
    </div>
    <div
      :style="{ visibility: !loading ? 'visible' : 'hidden' }"
      class="text-center"
    >
      <wis-map :feature="feature" :params="{ limit: 25 }" />
      <chart-dialog :feature="feature" />
    </div>
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
        names: [],
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

<template id="home">
  <div class="home">
    <h1>{{ $t("messages.welcome") }}</h1>
    <v-card>
      <wis-map :feature="feature" :params="{ limit: 25 }" />
    </v-card>
    <v-container>
      <chart-dialog :feature="feature" />
    </v-container>
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

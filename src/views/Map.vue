<template id="map">
  <div class="dialog" :style="{ opacity: $root.dialog ? '1' : '0' }">
    <chart-dialog :features="features" />
  </div>
  <div class="map" :style="{ opacity: $root.dialog ? '0' : '1' }">
    <v-card flat>
      <wis-map :features="features" :params="{ collection: topic }" />
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ChartDialog from "@/components/ChartDialog.vue";
import WisMap from "@/components/leaflet/WisMap.vue";

export default defineComponent({
  name: "MapView",
  template: "#map",
  components: {
    ChartDialog,
    WisMap,
  },
  props: ["topic"],
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
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        this.$router.push("/");
      }
    },
  },
});
</script>

<!-- The Map view displays a Map with an associated chart dialog if the user requests the chart data -->

<script setup lang="ts">

</script>

<template>
  <v-card flat>
    <WisMap :features="features" />
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import WisMap from "@/components/leaflet/WisMap.vue";

export default defineComponent({
  components: {
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
});
</script>

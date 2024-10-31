<!-- The Map view displays  -->

<script setup lang="ts">

defineProps({
  topic: String,
})
</script>

<template>
  <ChartDialog />
  <v-card flat>
    <WisMap :features="features" :params="{ collection: topic }" />
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import WisMap from "@/components/leaflet/WisMap.vue";
import ChartDialog from "@/components/ChartDialog.vue";

export default defineComponent({
  methods: {
    goBack() {
      if (window.history.length > 1) {
        this.$router.go(-1);
      } else {
        this.$router.push("/");
      }
    },
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

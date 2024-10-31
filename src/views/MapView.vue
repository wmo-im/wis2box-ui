<script setup lang="ts">

defineProps({
  topic: String,
})
</script>

<template>
  <chart-dialog :features="features" />
  <v-card flat>
    <wis-map :params="{ collection: topic }" />
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ChartDialog from "@/components/ChartDialog.vue";
import WisMap from "@/components/leaflet/WisMap.vue";

export default defineComponent({
  components: {
    ChartDialog,
    WisMap,
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

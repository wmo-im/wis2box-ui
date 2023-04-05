<template id="services">
  <div class="services">
    <v-row justify="center" class="ma-2">
      <v-card class="text-center pa-4" width="75%">
        <v-row v-for="(v, k, i) in services" :key="k">
          <v-col>{{ k }}</v-col>
          <v-col><a :target="k" :title="k" :href="v">{{ v }}</a></v-col>
          <v-divider v-if="i + 1 < Object.keys(services).length" />
        </v-row>
      </v-card>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "Services",
  template: "#services",
  data: function () {
    return {
      services: {
        API: window.VUE_APP_OAPI,
        WAF: window.VUE_APP_WAF,
      },
    };
  },
};
</script>

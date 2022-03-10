<template id="services">
  <v-row justify="center" align="center">
    <v-card class="text-center" width="60%">
      <v-row v-for="(v, k) in services" :key="k">
        <v-col>{{ k }}</v-col>
        <v-col
          ><a :target="k" :title="k" :href="v">{{ v }}</a></v-col
        >
        <v-divider />
      </v-row>
    </v-card>
  </v-row>
</template>

<script>
export default {
  name: "Services",
  template: "#services",
  data: function () {
    return {
      services: {
        API: window.VUE_APP_OAPI,
        MQTT: window.VUE_APP_MQTT,
        WAF: window.VUE_APP_WAF,
      },
    };
  },
};
</script>

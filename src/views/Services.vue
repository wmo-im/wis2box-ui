<template id="services">
  <v-row v-for="(v, k) in services" justify="center" align="center" :key="k">
    <v-col>{{ k }}</v-col>
    <v-col
      ><a :target="k" :title="k" :href="v">{{ v }}</a></v-col
    >
    <v-divider />
  </v-row>
</template>

<script>
export default {
  name: "Services",
  template: "#services",
  data: function () {
    return {
      services: {
        API: process.env.VUE_APP_OAPI,
        MQTT: process.env.VUE_APP_MQTT,
        WAF: process.env.VUE_APP_WAF
      },
    };
  },
};
</script>

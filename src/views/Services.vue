<template id="services">
  <div class="services">
    <v-row justify="center">
      <v-card class="text-center pa-4" width="60%">
        <v-row v-for="(v, k) in services" :key="k">
          <v-col>{{ k }}</v-col>
          <v-col
            ><a :target="k" :title="k" :href="v">{{ v }}</a></v-col
          >
          <v-divider />
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
        MQTT: window.VUE_APP_MQTT,
        WAF: window.VUE_APP_WAF,
      },
    };
  },
};
</script>

<!-- The service view displays the links to the backend wis2box services that are used in the frontend -->

<template>
  <v-row justify="center" class="ma-2">
    <v-card class="text-center pa-4" width="75%">
      <v-row v-for="(v, k, i) in services" :key="k">
        <v-col>{{ k }}</v-col>
        <v-col><a :target="k" :title="k" :href="v">{{ v }}</a></v-col>
        <v-divider v-if="i + 1 < Object.keys(services).length" />
      </v-row>
    </v-card>
  </v-row>
</template>

<script lang="ts">
export default {
  data: function () {
    return {
      // all of the services that the frontend uses and we wish to expose the user
      services: {
        API: window.VUE_APP_OAPI,
        WAF: window.VUE_APP_WAF,
      },
    };
  },
};
</script>

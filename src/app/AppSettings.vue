<template id="select-locale">
  <div class="select-locale">
    <v-menu :close-on-content-click="false">
      <template v-slot:activator="{ props }">
        <v-btn variant="text" color="#FFFFFF" class="font-weight-bold" v-bind="props">
          <v-icon icon="mdi-cog" />&nbsp;{{ $t('util.settings') }}
        </v-btn>
      </template>

      <v-list>
        <v-list-item class="px-0">
          <select-locale :header="false" />
        </v-list-item>
        <v-list-item class="px-0">
          <token-auth :header="false" />
        </v-list-item>
        <v-list-item class="px-0">
          <v-btn block :ripple="false" variant="text" color="#014e9e" class="font-weight-bold">
            <v-icon icon="mdi-map-marker-multiple" />&nbsp;{{ $t('util.cluster') }}
            <template v-slot:append>
              <v-switch hide-details color="#014e9e" v-model="$root.cluster" />
            </template>
          </v-btn>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import SelectLocale from "./SelectLocale.vue";
import TokenAuth from "./TokenAuth.vue";

export default defineComponent({
  name: "AppSettings",
  template: "#app-settings",
  components: {
    SelectLocale,
    TokenAuth,
  },
});
</script>

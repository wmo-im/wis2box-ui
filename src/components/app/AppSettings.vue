<template id="select-locale">
  <v-menu :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-btn variant="text" color="#FFFFFF" class="font-weight-bold" v-bind="props">
        <v-icon icon="mdi-cog" />&nbsp;{{ $t('util.settings') }}
      </v-btn>
    </template>
    <v-list>
      <v-list-item class="px-0">
        <SelectLocale :header="false" />
      </v-list-item>
      <v-list-item class="px-0">
        <TokenAuth :header="false" />
      </v-list-item>
      <v-list-item class="px-0">
        <v-btn block :ripple="false" variant="text" color="#014e9e" class="font-weight-bold">
          <v-icon icon="mdi-map-marker-multiple" />&nbsp;{{ $t('util.cluster') }}
          <v-switch hide-details color="#014e9e" />
        </v-btn>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import SelectLocale from "./SelectLocale.vue";
import TokenAuth from "./TokenAuth.vue";

export default defineComponent({
  components: {
    SelectLocale,
    TokenAuth,
  },
});
</script>

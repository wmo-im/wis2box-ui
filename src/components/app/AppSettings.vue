

<template id="select-locale">
  <div class="select-locale">
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn variant="text" color="#FFFFFF" class="font-weight-bold" v-bind="props">
          <v-icon icon="mdi-cog" />&nbsp;{{ $t('util.settings') }}
        </v-btn>
      </template>

      <v-list>
        <v-list-item class="pa-0">
          <select-locale :header="false" />
        </v-list-item>
        <v-list-item class="pa-0">
          <token-auth :header="false" />
        </v-list-item>
    </v-list>
    </v-menu>
  </div>
</template>
  
<script>
import { defineComponent } from "vue";

import SelectLocale from "./SelectLocale.vue";
import TokenAuth from "./TokenAuth.vue";

export default defineComponent({
  name: "AppSettings",
  template: "#app-settings",
  components: {
    SelectLocale,
    TokenAuth,
  }
});
</script>
  
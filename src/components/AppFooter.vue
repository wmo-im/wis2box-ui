<template id="app-footer">
  <div class="app-footer">
    <v-footer app>
      <v-row justify="center">
        <v-col class="primary text-center" cols="12">
          <img :src="`${require('@/assets/img/wmo-foot.png')}`" />
        </v-col>
        <v-col class="primary text-center" cols="12">
          <p>
            {{ $t("footer.powered_by") }}
            <a :title="name" :href="homepage" v-html="name" />
            {{ version }}
          </p>
        </v-col>
      </v-row>
    </v-footer>
  </div>
</template>

<script>
import { name, version, homepage } from "../../package";

import { defineComponent } from "vue";

export default defineComponent({
  name: "AppFooter",
  template: "#app-footer",
  data: function () {
    return {
      version: version,
      name: name,
      homepage: homepage,
    };
  },
});
</script>

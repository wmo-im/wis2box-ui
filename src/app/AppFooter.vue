<template id="app-footer">
  <div class="app-footer">
    <v-footer flat height="110">
      <v-row justify="center">
        <v-col cols="12">
          <v-img cover :src="foot" :lazy-src="foot" />
        </v-col>
        <v-col class="primary text-center" cols="12">
          <p>
            {{ $t("footer.powered_by") }}
            <a :title="name" :href="home" v-html="name" />
            {{ version }}
          </p>
        </v-col>
      </v-row>
    </v-footer>
  </div>
</template>

<script lang="ts">
import foot from "@/assets/img/wmo-foot.png";
import { name, version, homepage } from "../../package.json";

import { defineComponent } from "vue";

export default defineComponent({
  name: "AppFooter",
  template: "#app-footer",
  data: function () {
    return {
      version: version,
      name: name,
      home: homepage,
      foot: foot,
    };
  },
});
</script>

<!-- The main footer for the frontend -->

<template id="app-footer">
  <v-footer flat height="110">
    <v-row justify="center">
      <v-col cols="12">
        <v-img cover :src="footerImage" :lazy-src="footerImage" />
      </v-col>
      <v-col class="primary text-center" cols="12">
        <p>
          {{ $t("footer.powered_by") }}
          <a :title="name" :href="homepage">
            {{ name }}
          </a>
          {{ version }}
        </p>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script lang="ts">
import footerImage from "@/assets/img/wmo-foot.png";
import { name, version, homepage } from "../../../package.json";

import { defineComponent } from "vue";

export default defineComponent({
  data: () => {
    return {
      version,
      name,
      homepage,
      footerImage,
    };
  },
});
</script>

<template>
  <div id="app-footer">
    <v-footer>
      <v-row justify="center" align="center" no-gutters>
        <v-col cols="12">
          <img :src="`${require('@/assets/img/wmo-foot.png')}`" />
        </v-col>
        <v-col class="primary text-center" cols="12">
          <p>
            {{ $root.t("$vuetify.footer.powered_by") }}
            <a :title="name" :href="homepage">{{ name }}</a>
            {{ version }}
          </p>
        </v-col>
      </v-row>
    </v-footer>
  </div>
</template>

<script>
import { name, version, homepage } from "../../package";

export default {
  name: "AppFooter",
  template: "#app-footer",
  data() {
    return {
      version: version,
      name: name,
      homepage: homepage,
    };
  },
};
</script>

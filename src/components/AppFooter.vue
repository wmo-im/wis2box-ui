<template id="app-footer">
  <div class="app-footer">
    <v-footer app>
      <v-card flat>
        <v-row justify="center">
          <v-col class="primary text-center" cols="12">
            <img :src="`${require('@/assets/img/wmo-foot.png')}`" />
          </v-col>
          <v-col class="primary text-center" cols="12">
            <p>
              {{ $t("footer.powered_by") }}
              <a :title="name" :href="home" v-html="name" />
              {{ version }}
            </p>
          </v-col>
        </v-row>
      </v-card>
    </v-footer>
  </div>
</template>

<script>
import { name, version, home} from "../../package";

import { defineComponent } from "vue";

export default defineComponent({
  name: "AppFooter",
  template: "#app-footer",
  data: function () {
    return {
      version: version,
      name: name,
      home: home,
    };
  },
});
</script>

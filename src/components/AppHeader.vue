<template id="app-header">
  <div class="app-header">
    <v-system-bar app height="110">
      <v-row justify="center">
        <v-card
          flat
          height="109"
          width="1279"
          :style="{
            'background-image': `url(${require('@/assets/img/wmo-banner.png')})`,
          }"
        >
          <v-container>
            <v-row align="start">
              <v-spacer />
              <select-locale />
            </v-row>
            <v-row align="end">
              <a
                href="https://community.wmo.int/activity-areas/wis/wis2-implementation"
                title="wis2box"
              >
                <img :src="`${require('@/assets/img/logo.png')}`" />
              </a>
              <div id="wis2box-ui-nav">
                <router-link to="/">
                  {{ $t("navigation.homepage") }}
                </router-link>
                |
                <router-link to="/services">
                  {{ $t("navigation.services") }}
                </router-link>
                |
                <a target="_window_docs" :href="documentation">
                  {{ $t("navigation.documentation") }}
                </a>
              </div>
            </v-row>
          </v-container>
        </v-card>
      </v-row>
    </v-system-bar>
  </div>
</template>

<script>
import SelectLocale from "./SelectLocale.vue";
import { documentation } from "../../package";
import { defineComponent } from "vue";

export default defineComponent({
  name: "AppHeader",
  template: "#app-header",
  components: {
    SelectLocale,
  },
  data: function () {
    return {
      documentation: documentation,
    };
  },
});
</script>

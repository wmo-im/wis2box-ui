<template id="app-header">
  <v-app-bar flat height="124" class="pa-0 ma-0">
    <template v-slot:image>
      <!-- in order to have no padding on the top image
        you need to set padding and margin to be 0 and then 
        set fluid to true specifically in that order. Appears to
        be a vuetify quirk 
      -->
      <v-container class="pa-0 ma-0" fluid>
        <div 
          v-if="customBannerColor" 
          :style="{ backgroundColor: customBannerColor, height: '110px' }">
        </div>
        <v-img v-else height="110px" cover :src="banner" :lazy-src="banner" />

        <v-img v-if="!disableSeparator"  cover :src="foot" :lazy-src="foot" />
      </v-container>
    </template>

    <template v-slot:default>
      <v-responsive width="90%" max-width="1130" height="100%" class="mx-auto">
        <v-container fluid>
          <v-row align="center" class="fill-height">
            <a :href="home" title="wis2box home" class="logo-container">
              <img :src="logo" alt="Logo" class="logo" style="max-height: 100px; max-width:auto; padding: 10px;" />
            </a>
            <v-spacer />
            <app-settings class="ma-3" />
          </v-row>
        </v-container>
      </v-responsive>
    </template>
  </v-app-bar>
</template>

<style scoped>
.logo-container {
  max-height: 100px; /* Limits the container height to prevent overflow */
  display: flex;
  align-items: center; /* Ensures vertical alignment */
}

.logo {
  max-height: 100%; /* Scales the logo to fit within the container */
  max-width: 200px; /* Optional: Limit the width if needed */
  object-fit: contain; /* Keeps the aspect ratio */
}
</style>

<script lang="ts">
import AppSettings from "./AppSettings.vue";
import logo from "@/assets/img/logo.png";
import banner from "@/assets/img/wmo-banner.png";
import foot from "@/assets/img/wmo-foot.png";

import { defineComponent } from "vue";

export default defineComponent({
  components: {
    AppSettings,
  },
  data: function () {
    return {
      home: window.VUE_APP_URL,
      logo:
        window.VUE_APP_CUSTOM_LOGO_URL !== undefined && window.VUE_APP_CUSTOM_LOGO_URL !== ""
          ? window.VUE_APP_CUSTOM_LOGO_URL
          : logo,
      banner: banner,
      foot: foot,
      customBannerColor:
        window.VUE_APP_CUSTOM_BACKGROUND_COLOR !== undefined && window.VUE_APP_CUSTOM_BACKGROUND_COLOR !== ""
          ? window.VUE_APP_CUSTOM_BACKGROUND_COLOR
          : null,
      disableSeparator: window.VUE_APP_DISABLE_SEPARATOR_IMAGE,
    };
  },
});
</script>


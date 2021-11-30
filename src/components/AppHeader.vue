<template id="app-header">
  <div class="app-header">
    <v-system-bar :height="height">
      <v-row justify="center">
        <v-card
          :height="height - 1"
          width="1279"
          :style="{
            'background-image': `url(${require('@/assets/img/wmo-banner.png')})`,
          }"
        >
          <v-container>
            <v-row align="bottom">
              <a
                href="https://community.wmo.int/activity-areas/wis/wis2-implementation"
                title="wis2node"
              >
                <img :src="`${require('@/assets/img/logo.png')}`" />
              </a>
              <v-spacer />
              <select-locale />
            </v-row>
          </v-container>
        </v-card>
      </v-row>
    </v-system-bar>
  </div>
</template>

<script>
import SelectLocale from "./SelectLocale.vue";
export default {
  name: "AppHeader",
  template: "#app-header",
  components: {
    SelectLocale,
  },
  data: function () {
    return {
      height: 110,
    };
  },
};
</script>

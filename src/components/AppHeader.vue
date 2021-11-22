<template>
  <div id="app-header">
    <v-system-bar :height="height">
      <v-row justify="center">
        <v-card
         :height="height - 1"
         width="1279"
         :style="{'background-image': `url(${require('@/assets/img/wmo-banner.png')})`,}"
        >
          <v-container>
            <v-row align="center">
              <a
                href="https://community.wmo.int/activity-areas/wis/wis2-implementation"
                title="wis2node"
              >
                <img :src="`${require('@/assets/img/logo.png')}`" />
              </a>
              <v-spacer />
            </v-row>
          </v-container>
        </v-card>
      </v-row>
    </v-system-bar>
  </div>
</template>

<script>
export default {
  name: "AppHeader",
  template: "#app-header",
  data() {
    return {
      height: 110,
    };
  },
};
</script>

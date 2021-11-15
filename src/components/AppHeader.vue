<template>
  <v-system-bar
    height="110"
  >
    <v-row
      justify="center"
    >
      <v-card
        height="109"
        width="1279"
        :style="{
            'background-image': `url(${require('@/assets/img/wmo-banner.png')})`,
          }"
      >
        <v-container>
          <v-row
            align="center"
          >
            <a
              href="https://community.wmo.int/activity-areas/wis/wis2-implementation"
              title="wis2node"
            >
              <img
                :src="`${require('@/assets/img/logo.png')}`"
              />
            </a>
            <v-spacer/>
          </v-row>
        </v-container>
      </v-card>
    </v-row>
  </v-system-bar>
</template>

<script>
import { name, version, homepage } from "../../package";

export default {
  name: "AppHeader",
  data() {
    return {
      version: version,
      name: name,
      homepage: homepage,
    };
  },
};
</script>
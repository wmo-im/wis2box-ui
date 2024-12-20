<template id="app-footer">
  <v-footer :flat="true" :height="90" :style="{ backgroundColor: customFooterColor as string }">
    <v-row justify="center">
      <v-col cols="12">
        <v-img v-if="footerImage && !disableSeparator" cover :src="footerImage" :lazy-src="footerImage" />
      </v-col>
      <v-col class="primary text-center pt-0" cols="12">
        <p :style="{ color: contrastColor }">
          {{ $t("footer.powered_by") }}
          <a :title="name" :href="homepage" :style="{ color: contrastColor }">
            {{ name }}
          </a>
          {{ version }}
          <br/>
          <a title="name" :href="documentation" :style="{ color: contrastColor }">
            wis2box {{ $t("navigation.documentation") }}
          </a>
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
  data: () => ({
    version,
    name,
    homepage,
    documentation: "https://docs.wis2box.wis.wmo.int/",
    footerImage,
    customFooterColor:
      window.VUE_APP_CUSTOM_BACKGROUND_COLOR !== undefined && window.VUE_APP_CUSTOM_BACKGROUND_COLOR !== ""
        ? window.VUE_APP_CUSTOM_BACKGROUND_COLOR
        : null,
    disableSeparator: window.VUE_APP_DISABLE_SEPARATOR_IMAGE,
    contrastColor: "",
  }),
  watch: {
    customFooterColor: {
      immediate: true,
      handler(color) {
        this.contrastColor = this.getContrastColor(color || "#ffffff");
      },
    },
  },
  methods: {
    // If the user specifies a custom background color, use that color to calculate the contrast color
    // so the description is still visible even if the background color is dark
    getContrastColor(hex: string): string {
      const rgb = parseInt(hex.replace("#", ""), 16); // Convert hex to integer
      const r = (rgb >> 16) & 0xff; // Extract red
      const g = (rgb >> 8) & 0xff;  // Extract green
      const b = rgb & 0xff;         // Extract blue

      // Calculate luminance
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

      // Return black or white based on luminance
      return luminance > 186 ? "#000000" : "#ffffff"; // Threshold based on luminance
    },
  },
});
</script>

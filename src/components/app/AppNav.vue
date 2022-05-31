<template id="app-nav">
  <div class="app-nav">
    <v-app-bar flat>
      <template v-slot:prepend>
        <v-btn-group divided>
          <template v-for="(item, i) in items" :key="i">
            <v-hover v-slot="{ isHovering, props }">
              <v-btn
                :href="item.href"
                :to="item.target"
                :target="`_window_${item.text}`"
                :color="btnColor(isHovering)"
                class="font-weight-bold"
                variant="text"
                v-bind="props"
              >
                {{ $t(`navigation.${item.text}`) }}
              </v-btn>
            </v-hover>
          </template>
        </v-btn-group>
      </template>
    </v-app-bar>
  </div>
</template>

<script>
import { documentation } from "../../../package";

import { defineComponent } from "vue";

export default defineComponent({
  name: "AppNav",
  template: "#app-nav",
  data: function () {
    return {
      documentation: documentation,
      items: [
        {
          text: "home",
          target: "/",
          href: undefined,
        },
        {
          text: "datasets",
          target: "/datasets",
          href: undefined
        },
        {
          text: "services",
          target: "/data-services",
          href: undefined,
        },
        {
          text: "monitoring",
          target: "/monitoring",
          href: undefined,
        },
        {
        {
          text: "documentation",
          target: undefined,
          href: documentation,
        },
      ],
    };
  },
  methods: {
    btnColor(isHovering) {
      return isHovering ? "#014e9e" : undefined;
    },
  },
});
</script>

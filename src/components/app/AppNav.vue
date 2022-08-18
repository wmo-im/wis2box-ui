<template id="app-nav">
  <div class="app-nav">
    <v-app-bar flat>
      <template v-slot:prepend>
        <v-btn-toggle divided>
          <template v-for="(item, i) in items" :key="i">
            <v-hover v-slot="{ isHovering, props }">
              <v-btn
                :href="item.href"
                :to="item.target"
                :target="`_window_${item.text}`"
                :color="isHovering ? '#014e9e' : undefined"
                class="font-weight-bold"
                variant="text"
                v-bind="props"
              >
                {{ $t(`navigation.${item.text}`) }}
              </v-btn>
            </v-hover>
          </template>
        </v-btn-toggle>
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
      items: [
        {
          text: "home",
          target: "/",
          href: undefined,
        },
        {
          text: "map",
          target: "/map",
          href: undefined,
        },
        {
          text: "services",
          target: "/data-services",
          href: undefined,
        },
        {
          text: "documentation",
          target: undefined,
          href: documentation,
        },
      ],
    };
  },
});
</script>

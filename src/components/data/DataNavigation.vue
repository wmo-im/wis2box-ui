<template id="data-navigation">
  <v-navigation-drawer v-model="alwaysOpen" class="text-center">
    <v-list-item-subtitle class="mt-2">
      {{ $t('chart.observed_property') }}
    </v-list-item-subtitle>
    <v-list nav>
      <div v-for="(item, i) in Object.values(datastreams)" :key="i">
        <v-list-item :value="i" color="#014e9e" class="text-left text-body-2" @click="setDatastream(item)">
          {{ getNameTime(item.name || "", item.phenomenonTime || "") }}
        </v-list-item>
        <v-divider class="pb-1 mx-2" v-if="i < datastreams.length - 1" />
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { getNameTime } from "@/lib/helpers";
import type { Datastreams } from "@/lib/types";
import { useGlobalStateStore } from "@/stores/global";
import type { PropType } from "vue";

export default {
  props: {
    datastreams: {
      type: Object as PropType<Datastreams>,
      required: true,
    }
  },
  data() {
    return {
      alwaysOpen: true,
    };
  },
  methods: {
    getNameTime,
    setDatastream(datastream: Datastreams[0]) {
      const store = useGlobalStateStore();
      store.setSelectedDatastream(datastream);
    }
  },
};
</script>

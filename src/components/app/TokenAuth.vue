<template id="token-auth">
  <div class="token-auth">
    <v-menu location="start" v-model="menuOpen" :close-on-content-click="false">
      <template v-slot:activator="{ props }">
        <v-btn block variant="text" :color="color" class="font-weight-bold" v-bind="props">
          <v-icon icon="mdi-key-variant" />&nbsp;{{ $t('util.token') }}
        </v-btn>
      </template>
      <v-card min-width="256">
        <v-text-field class="mx-3" v-model="token" :label="$t('util.token')" type="password" variant="underlined"
          single-line hide-details />
        <v-card-actions>
          <v-row justify="center">
            <v-btn color="#014e9e" class="font-weight-bold" @click="saveToken">
              {{ $t('util.save') }}
            </v-btn>
            <v-btn color="pink" class="font-weight-bold" @click="clearToken">
              {{ $t('util.cancel') }}
            </v-btn>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useGlobalStateStore } from '@/stores/global'

export default defineComponent({
  name: "TokenAuth",
  template: "#token-auth",
  props: {
    header: Boolean
  },
  setup(props) {
    const token = ref("");
    const menuOpen = ref(false);
    const store = useGlobalStateStore();

    // Computed property for color
    const color = computed(() => {
      return props.header ? "#FFFFFF" : "#014e9e";
    });

    const saveToken = () => {
      store.setToken(token.value);
      menuOpen.value = false;
    };

    const clearToken = () => {
      store.clearToken();
      menuOpen.value = false;
    };

    return {
      token,
      menuOpen,
      color,
      saveToken,
      clearToken
    };
  }
});
</script>

<template id="token-auth">
  <div class="token-auth">
    <v-menu location="start" v-model="menu" :close-on-content-click="false">
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
            <v-btn color="#014e9e" class="font-weight-bold" @click="saveToken" v-html="$t('util.save')" />
            <v-btn color="pink" class="font-weight-bold" @click="onClose" v-html="$t('util.cancel')" />
          </v-row>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "TokenAuth",
  template: "#token-auth",
  props: ["header"],
  data() {
    return { token: "", menu: false };
  },
  mounted() {
    this.saveToken();
  },
  watch: {
    "$root.token": function (token) {
      this.token = token;
    }
  },
  computed: {
    color: function () {
      if (this.header) {
        return "#FFFFFF"
      } else {
        return "#014e9e"
      }
    }
  },
  methods: {
    saveToken() {
      // Save token
      this.$root.token = this.token;
      this.onClose();
    },
    onClose() {
      // Reset token and close menu
      this.token = this.$root.token;
      this.menu = false;
    },
  },
});
</script>

<template id="token-auth">
  <div class="token-auth">
    <v-menu v-model="menu" :close-on-content-click="false">
      <template v-slot:activator="{ props }">
        <v-btn
          color="#FFFFFF"
          class="font-weight-bold"
          v-bind="props"
          v-html="$t('util.token')"
        />
      </template>
      <v-card>
        <v-card-text>
          <v-text-field
            v-model="token"
            type="password"
            single-line
            hide-details
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="onClose" v-html="$t('util.cancel')" />
          <v-btn text @click="saveToken" v-html="$t('util.save')" />
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
let oapi = window.VUE_APP_OAPI;

import { defineComponent } from "vue";

export default defineComponent({
  name: "TokenAuth",
  template: "#token-auth",
  data() {
    return { token: "", token_: "", menu: false, interceptor: null };
  },
  mounted() {
    this.saveToken();
  },
  methods: {
    saveToken() {
      // Save token
      this.token_ = this.token;
      var self = this;

      // Clear headers and apply token
      const interceptors = this.axios.interceptors.request;
      if (this.interceptor !== null) {
        interceptors.eject(this.interceptor);
      }
      this.interceptor = interceptors.use(function (config) {
        config.headers = { Authorization: `Bearer ${self.token_}` };
        config.baseURL = oapi;
        return config;
      });

      // Handle close
      this.onClose();
    },
    onClose() {
      // Reset token and close menu
      this.token = this.token_;
      this.menu = false;
    },
  },
});
</script>

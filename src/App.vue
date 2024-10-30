<template>
  <v-app id="v-app">
    <app-header app />

    <v-main>
      <v-responsive class="pa-2">
        <v-row justify="center">
          <v-card flat width="90%" max-width="1130">
            <v-layout>
              <app-nav />
              <v-main>
                <router-view />
              </v-main>
            </v-layout>
          </v-card>
        </v-row>
      </v-responsive>
    </v-main>

    <app-msg app class="pb-4" :error="error" />
    <app-footer app class="pt-4" />
  </v-app>
</template>

<script lang="ts">
import AppFooter from "@/components/app/AppFooter.vue";
import AppHeader from "@/components/app/AppHeader.vue";
import AppMsg from "@/components/app/AppMsg.vue";
import AppNav from "@/components/app/AppNav.vue";

const oapi = window.VUE_APP_OAPI;

import { useI18n } from "vue-i18n";

export default {
  components: {
    AppFooter,
    AppHeader,
    AppNav,
    AppMsg
  },
  data() {
    return {
      msg: '',
      status: 200,
      url: '',
      dialog: false,
      token: '',
      interceptor: null,
      cluster: window.VUE_APP_CLUSTER == true // don't use strict equals in case env var is 'true'
    };
  },
  computed: {
    error: function () {
      return {
        msg: this.msg,
        status: this.status,
        url: this.url
      }
    }
  },
  watch: {
    token: function (t) {
      // Clear headers and apply token
      this.msg = '';
      this.status = 200;
      this.url = '';
      const interceptors = this.axios.interceptors.request;
      if (this.interceptor !== null) {
        interceptors.eject(this.interceptor);
      }
      this.interceptor = interceptors.use(function (config: { headers: { Authorization: string; }; baseURL: string; }) {
        config.headers = { Authorization: `Bearer ${t}` };
        config.baseURL = oapi;
        return config;
      });
      this.$router
        .push('/authorize')
        .then(() => { this.$router.go(-1) });
    }
  },
  methods: {
    toggleDialog: function () {
      this.dialog = this.dialog === true ? false : true;
    },
    catch: function (error) {
      console.log(error);
      if (error.response) {
        this.status = error.response.status;
        this.url = error.response.config.url;
      }
      if (this.status === 401) {
        this.msg = this.t("messages.not_authorized");
        this.token = '';
      } else if (this.error.status === 404) {
        this.msg = this.t("messages.does_not_exist");
      } else {
        this.msg = error;
      }
    }
  },
  setup() {
    const { t } = useI18n();
    return {
      t,
    };
  },
};
</script>

<template id="app-msg">
  <div class="app-msg">
    <v-overlay v-model="snackbar" class="align-center justify-center">
      <v-card flat width="100%" max-width="1130" class="text-center">
        <v-card-text>
          <template v-if="error.msg">
            <p v-html="error.msg" />
            <br>
          </template>
          <template v-if="error.url">
            <a :href="error.url" v-html="error.url" />
          </template>
        </v-card-text>
        <v-card-actions>
          <v-row justify="center">
            <token-auth v-if="error.status === 401" :header="false" />
            <v-btn color="pink" class="font-weight-bold" @click="close()">
              {{ $t('util.close') }}
            </v-btn>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-overlay>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";


import TokenAuth from "./TokenAuth.vue";


export default defineComponent({
  name: "AppMsg",
  template: "#app-msg",
  props: ["error"],
  components: {
    TokenAuth,
  },
  data: function () {
    return {
      snackbar: false,
    }
  },
  watch: {
    "error": function () {
      this.open();
    }
  },
  methods: {
    close() {
      this.snackbar = false;
      this.$root.msg = '';
      this.$root.status = 200;
      this.$root.url = '';
    },
    open() {
      if (this.error.msg !== '') {
        this.snackbar = true;
      } else {
        this.close();
      }
    }
  }
})
</script>

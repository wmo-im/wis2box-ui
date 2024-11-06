<!-- Component for displaying error messages -->

<template id="app-msg">
  <v-overlay v-model="snackbar" class="align-center justify-center">
    <v-card flat width="100%" max-width="1130" class="text-center">
      <v-card-text>
        <template v-if="error.msg">
          <p>
            {{ error.msg }}
          </p>
          <br>
        </template>
        <template v-if="error.url">
          <a :href="error.url">
            {{ error.url }}
          </a>
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
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";

import TokenAuth from "./TokenAuth.vue";


export default defineComponent({
  props: {
    error: {
      type: Object as PropType<{
        msg: string | null,
        url: string | null,
        status: number | null,
      }>,
      required: true
    }
  },
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

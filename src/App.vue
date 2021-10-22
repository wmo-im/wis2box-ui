<template>
  <app-header></app-header>
  <div id="wis2node-app">
    <router-link to="/">Home</router-link> |
    <a target="_window_catalogue" href="http://localhost:8999/pygeoapi">Catalogue</a> |
    <a target="_window_service_monitor" href="http://localhost:8999/monitor">Service Monitor</a> |
    <a target="_window_docs" :href="documentation">Documentation</a>
    <router-view/>
  </div>
  <app-footer></app-footer>
</template>

<script>
import { documentation } from "../package"

import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'

export default {
  components: {
    AppHeader,
    AppFooter
  },
  data() {
    return {
      documentation: documentation
    }
  }
}
</script>

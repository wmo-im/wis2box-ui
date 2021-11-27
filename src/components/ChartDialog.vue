<template>
  <v-layout justify-center align-center>
    <v-dialog 
      v-model="$root.dialog"
      @keydown.esc="event.preventDefault; $root.toggleDialog; event.stopPropagation;"
      @click:outside="event.preventDefault; $root.toggleDialog; event.stopPropagation;"
    >
      <v-card min-width="750" v-scroll.self>
        <v-row>
          <v-spacer />
          <v-btn @click="$root.toggleDialog"> X </v-btn>
        </v-row>
        <v-container>
          <template v-for="(datastream, i) in datastreams" :key="i">
            <chart-plot :datastream="datastream" />
          </template>
        </v-container>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import ChartPlot from "./ChartPlot.vue";

export default {
  components: { ChartPlot },
  name: "ChartDialog",
  props: ["feature"],
  data: function() {
    return {
      station: this.feature.station,
      datastreams: this.feature.datastreams,
    }
  },
}
</script>
<template>
  <v-layout justify-center align-center>
    <v-dialog 
      v-model="$root.dialog"
      @keydown.esc="event.preventDefault; $root.toggleDialog;"
      @click:outside="event.preventDefault; $root.toggleDialog;"
    >
      <v-card min-width="750">
        <v-row>
          <v-spacer />
          <v-btn @click="$root.toggleDialog"> X </v-btn>
        </v-row>
        <v-container>
          <chart-plot />
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
  props: ["opts"],
  data: function() {
    return {
      opts_: this.opts,
      feature_: this.opts.feature,
    }
  },
  mounted: function() {
    console.log(this.opts_);
    console.log(this.feature_);
  },
  watch: {
    opts: function() {
      console.log(this.opts);
    },
    opts_: function() {
      console.log(this.opts_);
    },
    feature_: function() {
      console.log(this.feature_);
    },
  }
}
</script>
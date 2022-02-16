<template id="plotter-navigation">
  <div class="plotter-navigation">
    <v-navigation-drawer color="primary" app absolute  position="left">
      <v-list nav color="transparent">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-h6" v-html="$t('chart.options')" />

            <v-list-item-subtitle v-html="$t('chart.collection')" />
            <v-menu app offset-x close-on-click>
              <template v-slot:activator="{ props }">
                <v-container>
                  <v-btn color="primary" dark text block v-bind="props">
                    <v-list-item-text v-html="choices.collection.description" />
                  </v-btn>
                </v-container>
              </template>

              <v-list>
                <v-list-item
                  v-for="(item, i) in choices.collections"
                  :key="i"
                  link
                >
                  <v-btn dark @click="updateCollection(item)">
                    <v-list-item-text v-html="item.id" />
                  </v-btn>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-divider />

            <v-list-item-subtitle v-html="$t('chart.datastream')" />
            <v-menu absolute offset-y>
              <template v-slot:activator="{ props }">
                <v-btn color="primary" dark text block v-bind="props">
                  <v-list-item-text v-html="choices.datastream.name" />
                </v-btn>
              </template>

              <v-list>
                <v-list-item
                  v-for="(val, key, i) in choices.datastreams"
                  :key="i"
                  link
                >
                  <v-btn dark @click="updateData(key)">
                    <v-list-item-text v-html="key" />
                  </v-btn>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
let oapi = process.env.VUE_APP_OAPI;

export default {
  name: "PlotterNavigation",
  template: "#plotter-navigation",
  props: ["choices"],
  data() {
    return {
      choices_: this.choices,
    };
  },
  methods: {
    async updateCollection(newC) {
      this.choices_.collection = newC;
      const response = await fetch(
        oapi + "/collections/" + newC.id + "/items?f=json&limit=1"
      );
      const response_json = await response.json();
      this.choices_.datastreams = await response_json.features[0].properties
        .observations;
      console.log(this.choices_);
      console.log(this.choices);
    },
    updateData(newD) {
      console.log(newD);
      this.choices_.datastream = this.choices_.datastreams[newD];
      this.choices_.datastream.id = newD;
      this.choices_.datastream.name = newD.slice(3);
    },
  },
};
</script>

<template id="plotter-navigation">
  <div class="plotter-navigation">
    <v-navigation-drawer color="primary" permanent absolute>
      <v-list nav color="transparent">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-h6" v-html="$t('chart.options')" />

            <v-divider class="my-4" />

            <v-list-item-subtitle v-html="$t('chart.collection')" />
            <v-divider class="mb-2" />
            <v-menu app offset-x close-on-click>
              <template v-slot:activator="{ props }">
                <v-btn color="primary" dark text block v-bind="props">
                  <v-list-item-text v-html="choices.collection.description" />
                </v-btn>
              </template>
              <v-card>
                <v-list>
                  <v-list-item
                    v-for="(item, i) in choices.collections"
                    :key="i"
                    link
                    @click="updateCollection(item)"
                  >
                    <v-list-item-title v-html="clean(item.title)" />
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>

            <v-divider class="my-4" />

            <v-list-item-subtitle v-html="$t('chart.observed_property')" />
            <v-divider class="mb-2" />
            <v-menu app offset-x close-on-click>
              <template v-slot:activator="{ props }">
                <v-btn color="primary" dark text block v-bind="props">
                  <v-list-item-text v-html="choices.datastream.name" />
                </v-btn>
              </template>
              <v-card>
                <v-list>
                  <v-list-item
                    v-for="(val, key, i) in choices.datastreams"
                    :key="i"
                    link
                    @click="updateData(key)"
                  >
                    <v-list-item-text v-html="clean(key)" />
                  </v-list-item>
                </v-list>
              </v-card>
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
    },
    updateData(newD) {
      this.choices_.datastream = this.choices_.datastreams[newD];
      this.choices_.datastream.id = newD;
      this.choices_.datastream.name = this.clean(newD);
    },
    clean(word) {
      if (typeof word === "string") {
        return (
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).replaceAll("_", " ");
      }
    },
  },
};
</script>

<template id="plotter-navigation">
  <div class="plotter-navigation">
    <v-navigation-drawer color="primary" absolute>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            {{ $t("chart.options") }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ $t("chart.collection") }}
          </v-list-item-subtitle>
          <v-spacer />
          <v-menu absolute offset-y close-on-content-click>
            <template v-slot:activator="{ props }">
              <v-btn color="primary" dark v-bind="props">
                {{ collections_choice_ }}
              </v-btn>
            </template>

            <v-list>
              <v-list-item
                v-for="(item, index) in collections"
                :key="index"
                link
              >
                <v-btn dark @click="updateCollection(item)">
                  <v-list-item-text v-html="item.id" />
                </v-btn>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-divider />
          <v-menu absolute offset-y close-on-content-click>
            <template v-slot:activator="{ props }">
              <v-btn color="primary" dark v-bind="props">
                {{ data_choice_ }}
              </v-btn>
            </template>

            <v-list>
              <v-list-item
                v-for="(item, index) in observations"
                :key="index"
                link
              >
                <v-btn dark @click="updateData(item)">
                  <v-list-item-text v-html="item" />
                </v-btn>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>
  </div>
</template>

<script>
let oapi = process.env.VUE_APP_OAPI;

export default {
  name: "PlotterNavigation",
  template: "#plotter-navigation",
  props: ["choices", "collections_choice"],
  data() {
    return {
      choices_: this.choices,
      collections_choice_: this.collections_choice,
      collections: [],
      observations: [
        "#1#nonCoordinatePressure",
        "#1#pressureReducedToMeanSeaLevel",
        "#1#3HourPressureChange",
        "#1#characteristicOfPressureTendency",
        "#1#airTemperature",
        "#1#dewpointTemperature",
        "#1#relativeHumidity",
        "#1#totalSunshine",
        "#2#totalSunshine",
        "#1#totalPrecipitationOrTotalWaterEquivalent",
        "#1#maximumTemperatureAtHeightAndOverPeriodSpecified",
        "#1#minimumTemperatureAtHeightAndOverPeriodSpecified",
        "#1#windDirection",
        "#1#windSpeed",
        "#1#maximumWindGustSpeed",
        "#1#globalSolarRadiationIntegratedOverPeriodSpecified",
        "#2#globalSolarRadiationIntegratedOverPeriodSpecified",
      ],
    };
  },
  methods: {
    updateCollection(newC) {
      console.log(newC);
      this.collections_choice_ = newC.id;
      this.choices_.collection = newC;
    },
    updateData(newD) {
      this.data_choice_ = newD;
      this.choices_.data = newD;
    },
  },
  async created() {
    this.loading = true;
    const response = await fetch(oapi + "/collections?f=json");
    const data = await response.json();
    for (var c of data.collections) {
      if (c.id === "stations") {
        const response = await fetch(
          oapi + "/collections/stations/items?f=json"
        );
        this.choices_.stations = await response.json();
      } else if (c.id === "discovery-metadata") {
        const response = await fetch(
          oapi + "/collections/discovery-metadata/items?f=json"
        );
        this.choices_.discovery_metadata = await response;
      } else {
        this.collections.push(c);
      }
    }
    this.loading = false;
  },
};
</script>

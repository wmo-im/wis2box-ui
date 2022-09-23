<template id="wis-station">
  <div class="wis-station">
    <l-geo-json
      :geojson="stations"
      :options="geojsonOptions"
      @click="mapClick"
    ></l-geo-json>
  </div>
</template>

<script>
import { circleMarker } from "leaflet/dist/leaflet-src.esm";
import { LGeoJson } from "@vue-leaflet/vue-leaflet";

import { defineComponent } from "vue";

export default defineComponent({
  name: "WisStation",
  template: "#wis-station",
  components: {
    LGeoJson,
  },
  props: ["features", "map"],
  data: function () {
    return {
      features_: this.features,
      loading: true,
      geojsonOptions: {
        onEachFeature: this.onEachFeature,
        pointToLayer: this.pointToLayer,
      },
    };
  },
  methods: {
    mapClick(e) {
      this.features_.station = e.layer.feature;
      this.features_.datastreams.length = 0;
      this.$root.toggleDialog();
      e.originalEvent.stopPropagation();
    },
    onEachFeature(feature, layer) {
      this.loading = true;
      var self = this;
      layer.on("mouseover", function (e) {
        self.features_.station = feature;
        layer.bindPopup(feature.properties.name).openPopup(e.latLng);
      });
      this.getStationStyle(feature, layer);
    },
    pointToLayer(feature, latLng) {
      const markerStyle = {
        radius: 4,
        fillColor: "SlateGrey",
        color: "DimGrey",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      };
      return circleMarker(latLng, markerStyle);
    },
    async getStationStyle(feature, layer) {
      var self = this;
      let fillColor;
      let color;
      if (feature.links.length === 0) {
        return;
      }
      await this.$http({
        method: "get",
        url: feature.links[0].href + "/items",
        params: {
          f: "json",
          sortby: "-resultTime",
          wigos_station_identifier: feature.id,
          limit: 1,
        },
      })
        .then(function (response) {
          // handle success
          var index = response.data.features[0].properties.index;
          self.countDailyObservations(feature, index).then((hits) => {
            if (hits === 0) {
              fillColor = "#000000";
              color = "DimGrey";
            } else if (hits <= 7) {
              fillColor = "#FF3300";
              color = "FireBrick";
            } else if (hits <= 19) {
              fillColor = "#FF9900";
              color = "DarkOrange";
            } else if (hits <= 24) {
              fillColor = "#009900";
              color = "SeaGreen";
            }
            layer.remove();
            layer.options.fillColor = fillColor;
            layer.options.color = color;
            layer.addTo(self.map);
          });
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .then(function () {
          self.loading = false;
          setTimeout(self.getStationStyle, 60000, feature, layer);
        });
    },
    async countDailyObservations(station, index) {
      this.loading = true;
      let hits;
      const startTime = new Date();
      startTime.setDate(startTime.getDate() - 1);
      await this.$http({
        method: "get",
        url: station.links[0].href + "/items",
        params: {
          f: "json",
          datetime: `${startTime.toISOString()}/..`,
          index: index,
          wigos_station_identifier: station.id,
          resulttype: "hits",
        },
      }).then(function (response) {
        hits = response.data.numberMatched;
      });
      return hits;
    },
  },
  computed: {
    stations: function () {
      return this.features_.stations;
    },
  },
});
</script>
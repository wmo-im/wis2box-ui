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
        pointToLayer: function (feature, latLng) {
          // style markers according to properties
          let fillColor;
          let lineColor;
          switch (feature.properties.status) {
            case "operational":
              fillColor = "SpringGreen";
              lineColor = "SeaGreen";
              break;
            case "nonReporting":
              fillColor = "Salmon";
              lineColor = "FireBrick";
              break;
            case "closed":
              fillColor = "SlateGrey";
              lineColor = "DimGrey";
              break;
            default:
              // undefined status
              fillColor = "Tan";
              lineColor = "Sienna";
          }
          if (feature.properties.active) {
            fillColor = "SpringGreen";
            lineColor = "SeaGreen";
          }
          const markerStyle = {
            radius: 10,
            fillColor: fillColor,
            color: lineColor,
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
          };
          return circleMarker(latLng, markerStyle);
        },
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
    async onEachFeature(feature, layer) {
      this.loading = true;
      var self = this;
      layer.on("mouseover", function (e) {
        self.features_.station = feature;
        layer.bindPopup(feature.properties.name).openPopup(e.latLng);
      });
    },
  },
  computed: {
    stations: function () {
      console.log(this.features_.stations);
      return this.features_.stations;
    },
  },
});
</script>

<style>
tr:nth-child(even) {
  background-color: #eeeeee;
}
th,
td {
  padding: 10px;
}
</style>

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
import { hasLinks } from "@/scripts/helpers.js";

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
      var self = this;
      layer.on("mouseover", function (e) {
        self.features_.station = feature;
        layer.bindPopup(feature.properties.name).openPopup(e.latLng);
      });
    },
    pointToLayer(feature, latLng) {
      let fillColor;
      let color;
      let hits = feature.properties.num_obs;
      if (hits === 0){
        fillColor = "#708090";
        color = "#2E343B";
      } else if (hits <= 7) {
        fillColor = "#FF3300";
        color = "#801A00";
      } else if (hits <= 19) {
        fillColor = "#FF9900";
        color = "#804D00";
      } else {
        fillColor = "#009900";
        color = "#004D00";
      }
      const markerStyle = {
        radius: 4,
        fillColor: fillColor,
        color: color,
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      };
      return circleMarker(latLng, markerStyle);
    },
  },
  computed: {
    stations: function () {
      return this.features_.stations;
    },
  },
});
</script>

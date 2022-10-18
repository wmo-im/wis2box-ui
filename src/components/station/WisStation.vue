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
  props: ["vals", "features", "map"],
  data: function () {
    return {
      features_: this.features,
      geojsonOptions: {
        onEachFeature: this.onEachFeature,
        pointToLayer: this.pointToLayer,
      },
      status: {},
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
      this.station_loading(feature, true);
      let fillColor;
      let color;
      let hits = feature.properties.num_obs;
      if (hits === 0) {
        fillColor = "#000000";
        color = "Black";
      } else if (hits <= 7) {
        fillColor = "#FF3300";
        color = "Black";
      } else if (hits <= 19) {
        fillColor = "#FF9900";
        color = "Black";
      } else {
        fillColor = "#009900";
        color = "Black";
      }
      layer.remove();
      layer.options.fillColor = fillColor;
      layer.options.color = color;
      layer.addTo(this.map);
      this.station_loading(feature, false);
      setTimeout(this.getStationStyle, 900000, feature, layer);
    },
    async countDailyObservations(station, index) {
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
    station_loading(feature, loading) {
      this.status[feature.id] = loading;
      var self = this;
      self.vals["loading"] = Object.values(this.status).includes(true);
    },
  },
  computed: {
    stations: function () {
      return this.features_.stations;
    },
  },
});
</script>

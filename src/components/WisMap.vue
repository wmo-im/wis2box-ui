<template id="wis-map">
  <div class="wis-map">
    <div :style="{ visibility: loading ? 'visible' : 'hidden' }">
      <v-progress-linear striped indeterminate color="primary" />
    </div>
    <div
      :style="{ visibility: !loading ? 'visible' : 'hidden' }"
      class="text-center"
    >
      <p>
        <l-map
          ref="wisMap"
          :zoom="zoom"
          :center="center"
          :bounds="bounds"
          maxZoom="16"
          style="height: 80vh"
        >
          <l-geo-json
            :geojson="geojson"
            :options="geojsonOptions"
            @click="mapClick"
          ></l-geo-json>
          <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
        </l-map>
      </p>
    </div>
  </div>
</template>

<script>
import * as L from "leaflet/dist/leaflet-src.esm";
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LGeoJson } from "@vue-leaflet/vue-leaflet";

let oapi = process.env.VUE_APP_OAPI;
import { defineComponent } from "vue";

export default defineComponent({
  name: "WisMap",
  template: "#wis-map",
  components: {
    LMap,
    LTileLayer,
    LGeoJson,
  },
  props: ["feature", "params"],
  mounted: function () {
    this.$nextTick(() => {
      this.loadStations();
    });
  },
  data: function () {
    return {
      feature_: this.feature,
      loading: true,
      params_: {
        f: "json",
        limit: 10,
      },
      bounds: [
        [42, -142],
        [84, -52],
      ],
      geojson: null,
      geojsonOptions: {
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
          return new L.circleMarker(latLng, markerStyle);
        },
        onEachFeature: function (feature, layer) {
          layer.on("mouseover", function (e) {
            layer.bindPopup(feature.properties.name).openPopup(e.latLng);
          });
          layer.on("mouseout", function () {
            layer.closePopup().unbindPopup();
          });
        },
      },
      attribution:
        '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      center: [0, 0],
      zoom: 1,
    };
  },
  methods: {
    mapClick(e) {
      this.feature_.station = e.layer.feature;
      this.feature_.datastreams.length = 0;
      this.bounds = L.geoJSON(this.geojson).getBounds();
      this.$root.toggleDialog();
      e.originalEvent.stopPropagation();
    },
    async loadStations() {
      this.loading = true;
      var self = this;
      await this.$http({
        method: "get",
        url: oapi + "/collections/stations/items",
        params: Object.assign({}, self.params_, self.params),
      })
        .then(function (response) {
          // handle success
          self.geojson = response.data;
          self.bounds = L.geoJSON(self.geojson).getBounds();
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .then(function () {
          self.loading = false;
          console.log("done");
        });
    },
  },
});
</script>

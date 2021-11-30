<template id="wis-map">
  <div class="wis-map">
    <p>
      <l-map
        ref="wisMap"
        :zoom="zoom"
        :center="center"
        :bounds="bounds"
        maxZoom="10"
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
</template>

<script>
import { circleMarker, geoJSON } from "leaflet/dist/leaflet-src.esm";
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LGeoJson } from "@vue-leaflet/vue-leaflet";

let oapi = process.env.VUE_APP_OAPI;

export default {
  name: "WisMap",
  template: "#wis-map",
  components: {
    LMap,
    LTileLayer,
    LGeoJson,
  },
  props: ["feature", "params"],
  data: function () {
    return {
      feature_: this.feature,
      bounds: [
        [42, -142],
        [84, -52],
      ],
      geojson: null,
      geojsonLayer: geoJSON(null, null),
      geojsonOptions: {
        onEachFeature: function (feature, layer) {
          layer.bindTooltip(feature.properties.name);
        },
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
      attribution:
        '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      center: [0, 0],
      zoom: 1,
    };
  },
  mounted() {
    this.loading = true;
    var self = this;
    var p = {
      f: "json",
      limit: 10,
    };
    this.$root
      .axios({
        method: "get",
        url: oapi + "/collections/stations/items",
        params: Object.assign({}, p, this.params),
      })
      .then(function (response) {
        // handle success
        self.geojson = response.data;
        self.bounds = geoJSON(self.geojson).getBounds();
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        self.loading = false;
      });
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    mapClick(e) {
      console.log(e);
      e.originalEvent.stopPropagation();
      this.feature_.station = e.layer.feature;
      this.feature_.datastreams.length = 0;
      for (const dstream of e.layer.feature.properties.Datastreams) {
        const dstream_id = dstream.split("/").pop();
        this.feature_.datastreams.push(dstream_id);
      }
      this.$root.toggleDialog();
    },
  },
};
</script>

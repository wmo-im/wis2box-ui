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
import { circleMarker, geoJSON } from "leaflet/dist/leaflet-src.esm";
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LGeoJson } from "@vue-leaflet/vue-leaflet";

let oapi = window.VUE_APP_OAPI;
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
        onEachFeature: function (feature, layer) {
          layer.on("mouseover", async function (e) {
            var request_url = `${feature.links[0].href}/items?f=json&sortby=-phenomenonTime&wigos_station_identifier=${feature.id}&limit=1`;
            const response = await fetch(request_url);
            const data = await response.json();
            var result = data.features[0];
            var tableContent = "";
            for (const [obs, vals] of Object.entries(
              result.properties.observations
            )) {
              tableContent +=
                "<tr>" +
                `<th> ${obs} </th>` +
                `<td> ${vals.value} ${vals.units} </td>` +
                "<tr>";
            }
            console.log(tableContent);
            var content = `
              <div>
                <b> ${feature.properties.name} </b><br>
                at ${result.properties.phenomenonTime}
                <table>
                  ${tableContent}
                </table>
              </div>
            `;
            layer
              .bindPopup(content, { maxWidth: "400px;" })
              .openPopup(e.latLng);
          });
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
      this.bounds = geoJSON(this.geojson).getBounds();
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
          self.bounds = geoJSON(self.geojson).getBounds();
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

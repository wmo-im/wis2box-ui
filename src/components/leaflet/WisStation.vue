<template id="wis-station">
  <div class="wis-station">
    <l-geo-json
      :geojson="geojson"
      :options="geojsonOptions"
      @click="mapClick"
    ></l-geo-json>
  </div>
</template>

<script>
import { circleMarker, geoJSON } from "leaflet/dist/leaflet-src.esm";
import { LGeoJson } from "@vue-leaflet/vue-leaflet";

import { defineComponent } from "vue";

export default defineComponent({
  name: "WisStation",
  template: "#wis-station",
  components: {
    LGeoJson,
  },
  props: ["features", "map", "params"],
  data: function () {
    return {
      features_: this.features,
      bounds_: this.bounds,
      loading: true,
      params_: {
        f: "json",
        limit: 10,
      },
      geojson: null,
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
  watch: {
    map: {
      handler(m) {
        if (m !== undefined) {
          this.loadStations();
        }
      },
    },
  },
  methods: {
    mapClick(e) {
      this.features_.station = e.layer.feature;
      this.features_.datastreams.length = 0;
      this.$root.toggleDialog();
      e.originalEvent.stopPropagation();
    },
    async loadStations() {
      this.loading = true;
      var self = this;
      await this.$http({
        method: "get",
        url: "/collections/stations/items",
        params: Object.assign({}, self.params_, self.params),
      })
        .then(function (response) {
          self.geojson = response.data;
        })
        .catch(function (error) {
          console.log(error);
        })
        .then(function () {
          self.loading = false;
        });
      var bounds_ = geoJSON(this.geojson).getBounds();
      this.map.fitBounds(bounds_);
    },
    async onEachFeature(feature, layer) {
      this.loading = true;
      var self = this;
      var content = "";
      var link = "";
      layer.on("mouseover", async function (e) {
        if (feature.links.length > 0) {
          link = feature.links[0].href;
        }
        await self
          .$http({
            method: "get",
            url: link + "/items",
            params: {
              f: "json",
              sortby: "-resultTime",
              wigos_station_identifier: feature.id,
              properties: "resultTime",
              limit: 1,
            },
          })
          .then(function (response) {
            // handle success
            var resultTime = response.data.features[0].properties.resultTime;
            var limit = response.data.numberMatched;
            var tableContent = "";
            self
              .loadObservations(feature, resultTime, limit)
              .then(function (response) {
                for (const item of response) {
                  var props = item.properties;
                  tableContent += `
                    <tr>
                      <th> ${self.$root.parseForNameAndTime(props)} </th>
                      <td> ${props.value} ${props.units} </td>
                    </tr>
                  `;
                }
                content = `
                  <div>
                    <h2> ${feature.properties.name} </h2>
                    <h5>
                      ${self.$t("messages.from")}
                      ${new Date(resultTime).toLocaleString(self.$t("code"), {
                        timeZone: "UTC",
                        hour12: false,
                      })}
                    </h5>
                    <table>
                      ${tableContent}
                    </table>
                  </div>
                `;
                layer
                  .bindPopup(content, { maxWidth: "400", maxHeight: "400" })
                  .openPopup(e.latLng);
              });
          })
          .catch(function (error) {
            // handle error
            console.log(error);
            let msg;
            if (error.response.status === 401) {
              msg = self.$t("messages.not_authorized");
            } else {
              msg = `
                <h5> ${self.$t("messages.no_linked_collections")} </h5>
                ${self.$t("messages.how_to_link_station")}
                `;
            }
            content = `
              <div>
                <h2> ${feature.properties.name} </h2>
                ${msg}
              </div>
            `;
            layer
              .bindPopup(content, { maxWidth: "400", maxHeight: "400" })
              .openPopup(e.latLng);
          })
          .then(function () {
            self.loading = false;
            console.log("done");
          });
      });
    },
    async loadObservations(feature, resultTime, count) {
      this.loading = true;
      var ret = [];
      await this.$http({
        method: "get",
        url: feature.links[0].href + "/items",
        params: {
          f: "json",
          datetime: `${resultTime}/..`,
          wigos_station_identifier: feature.id,
          limit: count,
        },
      })
        .then(function (response) {
          // handle success
          ret = response.data.features;
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .then(function () {
          console.log("done");
        });
      return ret;
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

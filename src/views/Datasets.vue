<template id="datasets">
  <div class="datasets">
    <v-responsive justify-center>
      <v-table
        ><tbody>
          <tr
            class="pa-2 my-4"
            v-for="(item, i) in datasets"
            :key="i"
            :contained-text="i % 2 === 0 ? True : False"
          >
            <th>
              <v-col>
                <v-btn
                  variant="text"
                  class="font-weight-bold"
                  block
                  title="OARec"
                  :href="item._oarec_url"
                  target="_window_OARec"
                >
                  {{ item.properties.title }}
                </v-btn>
                <v-row justify-center>
                  <v-card width="250px">
                    <l-map
                      :ref="item.id"
                      :zoom="item._zoom"
                      :bounds="item.bbox"
                      :center="item._center"
                      style="height: 200px"
                    >
                      <l-geo-json :geojson="item" />
                      <l-tile-layer :url="url" :attribution="attribution" />
                    </l-map>
                  </v-card>
                </v-row>
              </v-col>
            </th>
            <td>
              <v-col cols="12" class="text-left">
                <p class="font-weight-bold">
                  {{ $t("datasets.topic") + " : " }}
                </p>
                <code>{{ item.id }}</code>
              </v-col>
              <v-col cols="12" class="text-left">
                <v-btn
                  title="OAFeat"
                  :href="item._oafeat_url"
                  target="_window_OAFeat"
                >
                  OGC API
                </v-btn>
              </v-col>
              <v-col cols="12" class="text-left">
                <v-btn title="MQP" :href="item._mqp_url" target="_window_MQP">
                  PubSub
                </v-btn>
              </v-col>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-responsive>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LGeoJson } from "@vue-leaflet/vue-leaflet";

let oapi = window.VUE_APP_OAPI;

export default {
  name: "datasets",
  template: "#datasets",
  components: {
    LMap,
    LTileLayer,
    LGeoJson,
  },
  data: function () {
    return {
      window: 0,
      datasets: [],
      attribution:
        '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      zoom: 8,
    };
  },
  async created() {
    this.loading = true;
    this.window = 0;
    const response = await fetch(
      oapi + "/collections/discovery-metadata/items?f=json"
    );
    const data = await response.json();
    for (var c of data.features) {
      for (var link of c.links) {
        if (link.type === "OARec") {
          c._oarec_url = link.url;
        }
      }
      for (var associations of c.properties.associations) {
        if (associations.type === "OAFeat") {
          c._oafeat_url = associations.href;
        } else if (associations.type === "MQTT") {
          c._mqp_url = associations.href;
        }
      }
      let [x1, y1, x2, y2] = c.bbox;
      c._center = [(y2 + y1) / 2, (x2 + x1) / 2];
      c._zoom = 5;
      this.datasets.push(c);
    }
    this.loading = false;
  },
};
</script>
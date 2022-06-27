<template id="datasets">
  <div class="datasets">
    <v-responsive justify-center>
      <v-table>
        <tbody>
          <tr class="pa-2 my-4" v-for="(item, i) in datasets" :key="i">
            <th>
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
              <v-container>
                <v-row justify="center" fill-height>
                  <v-card width="240px" flat>
                    <l-map
                      :ref="item.id"
                      :zoom="item._zoom"
                      :center="item._center"
                      :options="{ zoomControl: false }"
                      style="height: 160px"
                    >
                      <l-geo-json :geojson="item" />
                      <l-tile-layer :url="url" :attribution="attribution" />
                    </l-map>
                  </v-card>
                </v-row>
              </v-container>
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
      datasets: [],
      attribution:
        '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    };
  },
  async created() {
    this.loading = true;
    const response = await fetch(
      oapi + "/collections/discovery-metadata/items?f=json"
    );
    const data = await response.json();
    for (var c of data.features) {
      for (var link of c.links) {
        if (link.type === "OARec") {
          c._oarec_url = link.href;
        } else if (link.type === "OAFeat") {
          c._oafeat_url = link.href;
        } else if (link.type === "MQTT") {
          c._mqp_url = link.href;
        }
      }
      let [x1, y1, x2, y2] = c.properties.extent.spatial.bbox[0];
      c._center = [(y2 + y1) / 2, (x2 + x1) / 2];
      c._zoom = 4;
      this.datasets.push(c);
    }
    this.loading = false;
  },
};
</script>

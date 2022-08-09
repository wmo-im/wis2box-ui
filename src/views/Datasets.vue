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
                  <dataset-map :dataset="item" />
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
import DatasetMap from "../components/leaflet/DatasetMap.vue";

let oapi = window.VUE_APP_OAPI;

export default {
  name: "datasets",
  template: "#datasets",
  components: {
    DatasetMap,
  },
  data: function () {
    return {
      datasets: [],
    };
  },
  async created() {
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
      this.datasets.push(c);
    }
  },
};
</script>

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
              <v-btn-group variant="outlined" divided class="my-2">
                <template v-for="(item, i) in item.links" :key="i">
                  <v-btn
                    :title="item.type"
                    :href="item.href"
                    :target="`_window_${item.type}`"
                  >
                    {{ $t(`datasets.${item.msg}`) }}
                  </v-btn>
                </template>
              </v-btn-group>
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
      const links = [];
      for (var link of c.links) {
        if (link.type === "OARec") {
          c._oarec_url = link.href;
        } else if (link.type === "OAFeat") {
          links.push({
            href: link.href,
            type: "OAFeat",
            msg: "oafeat",
          });
        } else if (link.type === "MQTT") {
          links.push({
            href: link.href,
            type: "MQP",
            msg: "mqp",
          });
        }
      }
      c.bbox = [
        c.geometry.coordinates[0][0][0],
        c.geometry.coordinates[0][0][1],
        c.geometry.coordinates[0][2][0],
        c.geometry.coordinates[0][2][1],
      ];
      links.push({
        href: oapi + "/collections/messages/items?bbox=" + `${c.bbox}`,
        type: "Messages",
        msg: "messages",
      });
      c.links = links;
      this.datasets.push(c);
    }
  },
};
</script>

<template id="datasets">
  <div class="datasets">
    <v-responsive justify-center>
      <v-alert border="start" variant="contained-text" color="#014e9e">
        <h2>{{ $t("messages.welcome") }}</h2>
      </v-alert>
      <v-card class="pa-2">
        <v-table>
          <tbody>
            <tr class="pa-2 my-4" v-for="(item, i) in datasets" :key="i">
              <th>
                <v-hover v-slot="{ isHovering, props }">
                  <v-container>
                    <v-row justify="center" fill-height>
                      <v-card
                        class="pa-2 ma-0"
                        :elevation="isHovering ? 12 : 0"
                        v-bind="props"
                        @click="loadMap(item.id)"
                      >
                        <v-overlay
                          open-on-hover
                          contained
                          activator="parent"
                          class="align-center justify-center"
                        >
                          <v-btn flat>
                            {{ $t("datasets.map") }}
                          </v-btn>
                        </v-overlay>
                        <dataset-map :dataset="item" />
                      </v-card>
                    </v-row>
                  </v-container>
                </v-hover>
              </th>
              <td>
                <v-col cols="12" class="text-center">
                  <h2>
                    {{ item.properties.title }}
                  </h2>
                  <span>
                    <strong>{{ $t("datasets.topic") + " : " }}</strong>
                    <code>{{ item.id }}</code>
                  </span>
                </v-col>
                <v-col cols="12" class="text-center">
                  <v-btn-group variant="outlined" divided>
                    <v-btn
                      v-for="(item, i) in item.links"
                      :key="i"
                      :title="item.type"
                      :href="item.href"
                      :to="item.target"
                      :target="`_window_${item.type}`"
                    >
                      {{ $t(`datasets.${item.msg}`) }}
                      <v-icon
                        v-if="item.href !== undefined"
                        end
                        icon="mdi-open-in-new"
                      />
                    </v-btn>
                  </v-btn-group>
                </v-col>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
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
          links.push({
            href: link.href,
            target: undefined,
            type: "OARec",
            msg: "oarec",
          });
        } else if (link.type === "OAFeat") {
          links.push({
            href: link.href,
            target: undefined,
            type: "OAFeat",
            msg: "oafeat",
          });
        }
      }
      links.push({
        href: undefined,
        target: `/map/${c.id}`,
        type: "Map",
        msg: "map",
      });
      c.bbox = [
        c.geometry.coordinates[0][0][0],
        c.geometry.coordinates[0][0][1],
        c.geometry.coordinates[0][2][0],
        c.geometry.coordinates[0][2][1],
      ];
      c.links = links;
      this.datasets.push(c);
    }
  },
  methods: {
    loadMap(topic) {
      this.$router.push(`/map/${topic}`);
    },
  },
};
</script>

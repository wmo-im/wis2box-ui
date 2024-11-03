<template id="data-navigation">
  <div class="data-navigation">
    <v-navigation-drawer v-model="drawer_" bottom absolute class="text-center">
      <v-list-item-subtitle class="mt-2">
        {{ $t('chart.observed_property') }}
      </v-list-item-subtitle>
      <v-list nav>
        <template v-for="(item, i) in choices.datastreams" :key="i">
          <v-list-item :value="i" active-color="#014e9e" :active="model === i" class="text-left text-body-2"
            @click="updateData(item, i)">
            {{ getNameTime(item) }}
          </v-list-item>
          <v-divider class="pb-1 mx-2" v-if="i < choices.datastreams.length - 1" />
        </template>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
const oapi = window.VUE_APP_OAPI;
import { catchAndDisplayError } from "@/lib/errors";
import { getNameTime, hasLinks } from "@/lib/helpers";

export default {
  props: ["choices", "alert", "station", "drawer"],
  data() {
    return {
      choices_: this.choices,
      alert_: this.alert,
      model: -1,
    };
  },
  computed: {
    drawer_: function () {
      return this.drawer.model;
    },
  },
  watch: {
    "choices.collections": {
      handler(c) {
        if (hasLinks(this.station)) {
          for (const item of c) {
            if (this.station.properties.topic === item.id) {
              this.updateCollection(item);
            }
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    getNameTime,
    async updateCollection(newC) {
      this.alert_value = false;
      this.choices_.collection = newC;

      try {
        const response = await fetch(`${oapi}/collections/${newC.id}/items?` + new URLSearchParams({
          wigos_station_identifier: this.station.id,
          properties: "resultTime",
          sortby: "-resultTime",
          f: "json",
          limit: "1",
        }));

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const feature = data.features[0];

        if (feature && feature.properties && feature.properties.resultTime) {
          await this.fetchCollectionItems(
            `${newC.id}`,
            feature.properties.resultTime,
            data.numberMatched
          );
        } else {
          catchAndDisplayError(this.$t("chart.station") + this.$t("messages.no_observations_in_collection"));
        }
      } catch (error) {
        catchAndDisplayError(error as string);
      } finally {
        console.log("done");
      }
    },

    async fetchCollectionItems(collection_id: string, resultTime: string, limit: number) {
      try {
        const response = await fetch(`${oapi}/collections/${collection_id}/items?` + new URLSearchParams({
          wigos_station_identifier: this.station.id,
          datetime: `${resultTime}/..`,
          f: "json",
          limit: String(limit),
        }));

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        for (const item of data.features) {
          this.choices_.datastreams.push(item.properties);
        }
      } catch (error) {
        catchAndDisplayError(error as string);
      } finally {
        console.log("done");
      }
    },

    updateData(newD, index) {
      this.choices_.datastream = {
        id: newD.name,
        index: newD.index,
        name: getNameTime(newD),
        units: newD.units,
      };
      this.model = index;
    },
  },
};
</script>

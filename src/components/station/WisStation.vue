<template id="wis-station">
  <div class="wis-station" style="display: none"></div>
</template>

<script lang="ts">
import type { FeatureLayerForMap, ItemsResponse } from "@/lib/types";
import { useGlobalStateStore } from "@/stores/global";
import { circleMarker, geoJSON, type LatLngExpression } from "leaflet";
// @ts-expect-error no types from leaflet.markercluster
import { MarkerClusterGroup } from "leaflet.markercluster/dist/leaflet.markercluster-src.js";

import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import { defineComponent, type PropType } from "vue";

export default defineComponent({
  data: function () {
    return {
      geojsonOptions: {
        onEachFeature: this.onEachFeature,
        pointToLayer: this.pointToLayer,
      },
      layer: null,
      clusterLayer: null,
    };
  },
  props: {
    features: {
      type: Object as PropType<ItemsResponse>,
      required: true
    },
    map: {
      type: Object as PropType<L.Map>,
      required: true
    }
  },
  mounted: function () {
    this.$nextTick(() => {
      this.onReady()
    })
  },
  watch: {
    "$root.cluster": function () {
      this.renderLayer();
    }
  },
  methods: {
    onReady() {
      this.layer = new geoJSON(this.features, this.geojsonOptions);
      this.clusterLayer = new MarkerClusterGroup({
        disableClusteringAtZoom: 9,
        chunkedLoading: true,
        chunkInterval: 500,
      });
      this.clusterLayer.addLayer(this.layer);
      this.renderLayer();
    },
    renderLayer() {
      if (this.$root.cluster) {
        this.layer.removeFrom(this.map);
        this.map.addLayer(this.clusterLayer);
      } else {
        this.clusterLayer.removeFrom(this.map)
        this.map.addLayer(this.layer);
      }
    },
    mapClick(e) {
      const store = useGlobalStateStore();
      this.features_.station = e.target.feature;
      this.features_.datastreams.length = 0;
      store.toggleDialog();
      e.originalEvent.stopPropagation();
    },
    onEachFeature(feature: FeatureLayerForMap, layer: L.Layer) {
      layer.on("mouseover", (e: L.LeafletMouseEvent) => {
        this.features_.station = feature;
        layer.bindPopup(feature.properties.name).openPopup(e.latlng);
      });
      layer.on({
        click: this.mapClick
      });
    },
    pointToLayer(feature: FeatureLayerForMap, latLng: LatLngExpression) {
      let fillColor;
      let color;
      const hits = feature.properties.num_obs;
      if (hits === 0) {
        fillColor = "#708090";
        color = "#2E343B";
      } else if (hits <= 7) {
        fillColor = "#FF3300";
        color = "#801A00";
      } else if (hits <= 19) {
        fillColor = "#FF9900";
        color = "#804D00";
      } else {
        fillColor = "#009900";
        color = "#004D00";
      }
      const markerStyle = {
        radius: 4,
        fillColor: fillColor,
        color: color,
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      };
      return circleMarker(latLng, markerStyle);
    },
  },
});
</script>

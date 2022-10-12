import { createRouter, createWebHistory } from "vue-router";
import Datasets from "../views/Datasets.vue";
import Map from "../views/Map.vue";
import Services from "../views/Services.vue";

const routes = [
  {
    path: "/:topic/map",
    props: true,
    name: "Map",
    component: Map,
  },
  {
    path: "/",
    name: "Datasets",
    component: Datasets,
  },
  {
    path: "/services",
    name: "Services",
    component: Services,
  },
];

const router = createRouter({
  history: createWebHistory(
    new URL(window.VUE_APP_URL).pathname
  ),
  routes,
});

export default router;

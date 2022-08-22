import { createRouter, createWebHistory } from "vue-router";
import Datasets from "../views/Datasets.vue";
import Map from "../views/Map.vue";
import Services from "../views/Services.vue";

const routes = [
  {
    path: "/map/:topic",
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
    path: "/data-services",
    name: "Services",
    component: Services,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

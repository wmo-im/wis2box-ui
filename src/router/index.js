import { createRouter, createWebHistory } from "vue-router";
import Datasets from "../views/Datasets.vue";
import Home from "../views/Home.vue";
import Services from "../views/Services.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/datasets",
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

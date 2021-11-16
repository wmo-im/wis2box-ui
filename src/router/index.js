import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Plot from "../views/Plot.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/plot",
    name: "Plot",
    component: Plot,
    params: {
      properties: {}
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

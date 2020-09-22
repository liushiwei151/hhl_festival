import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import page from "../views/page.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  { path: "/", name: "page", component: page },
  {
    path: "/home",
    name: "Home",
    component: Home
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

export default router;

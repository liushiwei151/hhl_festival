import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import page from "../views/page.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  { path: "/", name: "page", component: page }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

export default router;

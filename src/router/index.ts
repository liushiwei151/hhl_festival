import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import page from "../views/page.vue";
import demo from "../views/demo.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  { path: "/", name: "page", component: page },
  {
    path: "/home",
    name: "Home",
    component: Home
  },
  {
    path: "/demo",
    name: "demo",
    component: demo
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;

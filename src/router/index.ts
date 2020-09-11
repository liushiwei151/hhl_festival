import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import demo from "../views/demo.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  // { path: "/", name: "loading", component: loading },
  {
    path: "/",
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

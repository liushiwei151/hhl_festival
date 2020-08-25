import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import moonCake from "../views/moonCakeMaterial.vue";
import myMoonCake from "../views/myMoonCake.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/moonCake",
    name: "moonCake",
    component: moonCake
  },
  {
    path: "/myMoonCake",
    name: "myMoonCake",
    component: myMoonCake
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;

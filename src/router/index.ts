import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import demo from "../views/demo.vue";
import demo1 from "../views/demo1.vue";
import demo2 from "../views/demo2.vue";
import rotation from "../views/rotation.vue";
import light from "../views/light.vue";
import group from "../views/group.vue";
import curve from "../views/curve.vue";
import texture from "../views/texture.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/demo",
    name: "demo",
    component: demo
  },
  {
    path: "/demo1",
    name: "demo1",
    component: demo1
  },
  {
    path: "/demo2",
    name: "demo2",
    component: demo2
  },
  {
    path: "/rotation",
    name: "rotation",
    component: rotation
  },
  {
    path: "/light",
    name: "light",
    component: light
  },
  {
    path: "/group",
    name: "group",
    component: group
  },
  {
    path: "/curve",
    name: "curve",
    component: curve
  },
  {
    path: "/texture",
    name: "texture",
    component: texture
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
const wx = require("weixin-js-sdk");
import toast from "./components/toast/toast";

Vue.config.productionTip = false;
Vue.prototype.wx = wx;
Vue.prototype.$Toast = toast;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");

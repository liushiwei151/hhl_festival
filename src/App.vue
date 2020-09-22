<template>
  <div id="app">
    <router-view v-if="isShow" />
    <transition name="fade">
      <layer :value="msg" v-show="isShowTip"></layer>
    </transition>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide } from "vue-property-decorator";
import layer from "./components/layer.vue";
@Component({
  components: {
    layer
  }
})
export default class App extends Vue {
  @Provide()
  public restart = this.restartFunction;
  @Provide()
  public tip = this.layerTip;
  // 是否显示路由
  isShow = true;
  msg: string | null = null;
  //是否显示tip
  isShowTip = false;
  mounted(): void {}
  //tip
  layerTip(msg: string | boolean) {
    if (msg === false || msg === true) {
      this.isShowTip = false;
    } else {
      this.isShowTip = true;
      this.msg = msg;
    }
  }
  //重新开始
  restartFunction() {
    this.isShow = false;
    setTimeout(() => {
      this.isShow = true;
    }, 0);
  }
}
</script>
<style lang="less" scoped>
.fade-enter-active {
  transition: opacity 3s;
}
.fade-leave-active {
  transition: opacity 1.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
<style lang="less">
body {
  margin: 0;
  padding: 0 !important;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  overflow: hidden;
}
</style>

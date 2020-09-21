<template>
  <div id="app">
    <router-view v-if="isShow" />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Provide } from "vue-property-decorator";
@Component({})
export default class App extends Vue {
  @Provide()
  public restart = this.restartFunction;
  // 是否显示路由
  isShow = true;
  mounted(): void {}
  //重新开始
  restartFunction() {
    this.isShow = false;
    setTimeout(() => {
      this.isShow = true;
    }, 0);
  }
}
</script>
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

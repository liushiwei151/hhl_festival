<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({})
export default class App extends Vue {
  mounted(): void {
    if (this.$route.name !== "demo1") {
      // this.$router.push("demo1");
    }
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
}
</style>

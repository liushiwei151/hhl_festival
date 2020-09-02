<template>
  <div class="home">
    <button @click="gotoWeb('moonCake')"></button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({})
export default class Home extends Vue {
  //是否允许跳转页面
  isClick = false;
  mounted(): void {
    const self = this;
    this.$nextTick(() => {
      self.isClick = true;
    });
  }
  gotoWeb(e: string) {
    if (this.isClick) {
      this.$router.push(e);
    }
  }
}
</script>
<style lang="less" scoped>
.home {
  background: url(../assets/home_bg.png) no-repeat;
  background-size: 100% 100%;
  width: 100vw;
  height: 100vh;
  position: relative;
  button {
    border: none;
    outline: none;
    background: url(../assets/home_btn.png) no-repeat;
    background-size: 100% 100%;
    width: 70vw;
    height: 30vw;
    position: absolute;
    bottom: 2vh;
    left: 15vw;
  }
}
</style>

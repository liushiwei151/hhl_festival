<template>
  <div class="home">
    <button @click="gotoWeb('moonCake')" :class="{ gray: !isClick }"></button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({})
export default class Home extends Vue {
  //是否允许跳转页面
  isClick = false;
  mounted(): void {
    this.loopClick();
  }
  // 确认是否已经更新local
  loopClick() {
    const self = this;
    setTimeout(() => {
      const value = localStorage.getItem("hhl_festival_userInfo");
      if (value === null) {
        self.loopClick();
      } else {
        self.isClick = true;
      }
    }, 500);
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
  .gray {
    filter: grayscale(100%);
  }
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

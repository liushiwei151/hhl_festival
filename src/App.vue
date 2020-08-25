<template>
  <div id="app">
    <rightButton
      :showButtonName="showButtonName"
      :isShowShadow="isShowShadow"
      @result="result"
    ></rightButton>
    <transition name="fade">
      <showPopup @popupClick="popupClick" v-show="isShowPopup"></showPopup>
    </transition>
    <router-view />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import rightButton from "./components/rightButton.vue";
import showPopup from "./components/showPopup.vue";
@Component({
  components: {
    rightButton,
    showPopup
  }
})
export default class App extends Vue {
  //显示哪些按钮
  showButtonName: string[] = ["rule"];
  //是否显示弹窗
  isShowPopup = false;
  // 是否显示我的月饼按钮的光圈效果
  isShowShadow = false;
  @Watch("$route")
  //监听路由
  // eslint-disable-next-line
  watchRoute(e: any) {
    if (e.name === "Home") {
      this.showButtonName = ["rule"];
    } else {
      this.showButtonName = ["rule", "myMoonCake", "rank"];
    }
    if (e.name === "myMoonCake") {
      this.isShowShadow = true;
    } else {
      this.isShowShadow = false;
    }
  }
  mounted(): void {
    if (this.$route.name !== "Home") {
      this.showButtonName = ["rule", "myMoonCake", "rank"];
    }
  }
  // 点击右上按钮的不同结果
  result(e: string) {
    switch (e) {
      case "rule":
        this.isShowPopup = true;
        break;
      case "myMoonCake":
        this.$router.push("/myMoonCake");
        break;
      case "rank":
        console.log("弹出排行榜");
        break;
    }
  }
  //关闭弹出框
  popupClick(e: string) {
    this.isShowPopup = false;
  }
}
</script>
<style lang="less">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
html,
body,
ul {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

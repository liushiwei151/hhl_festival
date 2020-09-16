<template>
  <div class="page">
    <!-- 首页 -->
    <transition name="fade">
      <home-page @startGame="startGame" v-show="isShowPage"></home-page>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import homePage from "../components/homePage.vue";

@Component({
  components: {
    homePage
  }
})
export default class page extends Vue {
  //是否显示首页
  isShowPage = true;
  //开始游戏
  startGame() {
    const self = this;
    this.isShowPage = false;
  }
}
</script>
<style lang="less" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
#home {
  overflow: hidden;
}
</style>

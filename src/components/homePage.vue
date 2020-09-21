<template>
  <!-- 首页 -->
  <div class="homePageBox">
    <div class="blackMask" v-if="isLoading"></div>
    <transition name="fade">
      <loading :imgNum="imgNum" v-if="isLoading"></loading>
    </transition>
    <div class="homePage" :style="{ opacity: imgNum[0] / imgNum[1] }">
      <ul>
        <transition-group name="fade">
          <li
            v-for="(a, b) in fontShow"
            :key="b"
            v-show="a"
            :class="'font' + b"
          ></li>
        </transition-group>
      </ul>
      <transition name="fade">
        <button
          class="pageButton"
          v-show="isShowButton"
          @click="startGame('开始')"
        ></button>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit } from "vue-property-decorator";
import loading from "./loading.vue";

@Component({
  components: {
    loading
  }
})
export default class homePage extends Vue {
  @Emit("startGame") startGame(e: string) {
    console.log(e);
  }
  // 6个字体的显隐
  fontShow = [false, false, false, false, false, false, false];
  //底部跳转按钮的显隐
  isShowButton = false;
  //照片加载数量和总数量
  //本体图片地址
  imgUrl = [
    require("../static/homePage/homePageBg.png"),
    require("../static/homePage/homePageButton.png"),
    require("../static/homePage/1.png"),
    require("../static/homePage/2.png"),
    require("../static/homePage/3.png"),
    require("../static/homePage/4.png"),
    require("../static/homePage/5.png"),
    require("../static/homePage/6.png"),
    require("../static/homePage/7.png"),
    require("../static/pageBox/bg2.png"),
    require("../static/pageBox/bg3.png"),
    require("../static/pageBox/choseButton.png"),
    require("../static/pageBox/close.png"),
    require("../static/pageBox/hu.png"),
    require("../static/pageBox/lastArrow.png"),
    require("../static/pageBox/lastBg.png"),
    require("../static/pageBox/lastButton.png"),
    require("../static/pageBox/lastMoon.png"),
    require("../static/pageBox/left.png"),
    require("../static/pageBox/map.png"),
    require("../static/pageBox/map2.png"),
    require("../static/pageBox/mapText.png"),
    require("../static/pageBox/moon.png"),
    require("../static/pageBox/p1.png"),
    require("../static/pageBox/p2.png"),
    require("../static/pageBox/p3.png"),
    require("../static/pageBox/p4.png"),
    require("../static/pageBox/pageBox_01.png"),
    require("../static/pageBox/pageBox_02.png"),
    require("../static/pageBox/pageBox_03.png"),
    require("../static/pageBox/pageBox_04.png"),
    require("../static/pageBox/pageBox_05.png"),
    require("../static/pageBox/pageBox_06.png"),
    require("../static/pageBox/pageBox_07.png"),
    require("../static/pageBox/pageBox_08.png"),
    require("../static/pageBox/pageBox_09.png"),
    require("../static/pageBox/pageBox_10.png"),
    require("../static/pageBox/pageBox_11.png"),
    require("../static/pageBox/pageBox_12.png"),
    require("../static/pageBox/pageBox_13.png"),
    require("../static/pageBox/pageBox_14.png"),
    require("../static/pageBox/pageBox_15.png"),
    require("../static/pageBox/pageBox_16.png"),
    require("../static/pageBox/pageBox_17.png"),
    require("../static/pageBox/pageBox_18.png"),
    require("../static/pageBox/pageBox_19.png"),
    require("../static/pageBox/pageBox_20.png"),
    require("../static/pageBox/point.png"),
    require("../static/pageBox/position.png"),
    require("../static/pageBox/teachImg.png")
  ];
  //当前图片加载数量
  count = 0;
  //是否显示加载图片进度
  isLoading = true;

  get imgNum(): number[] {
    return [this.count, Number(this.imgUrl.length)];
  }

  mounted(): void {
    const self = this;
    this.preload();
    // window.onload = function() {
    //   self.fontAnimation();
    // };
  }
  //开始游戏
  startGames(e: string) {
    this.startGame(e);
  }
  //图片预加载
  preload() {
    for (const img of this.imgUrl) {
      let image = new Image();
      image.src = img;
      image.onload = () => {
        this.count++;
        if (this.count >= this.imgUrl.length) {
          this.isLoading = false;
          this.fontAnimation();
        }
        // // 计算图片加载的百分数，绑定到percent变量
        // let percentNum = Math.floor(this.count / 14 * 100)
        // this.percent = `${percentNum}%`
      };
    }
  }
  //字体显示动画
  fontAnimation() {
    const self = this;
    Vue.set(self.fontShow, 4, true);
    Vue.set(self.fontShow, 0, true);
    setTimeout(() => {
      Vue.set(self.fontShow, 1, true);
      Vue.set(self.fontShow, 2, true);
      self.isShowButton = true;
    }, 500);
    setTimeout(() => {
      Vue.set(self.fontShow, 3, true);
      Vue.set(self.fontShow, 6, true);
    }, 1000);
    setTimeout(() => {
      Vue.set(self.fontShow, 5, true);
    }, 700);
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
.homePageBox {
  .blackMask {
    background-color: black;
    width: 100vw;
    height: 100vh;
  }
  .homePage {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 90;
    background: url(../static/homePage/homePageBg.png) no-repeat;
    background-size: cover;
    .isClick {
      filter: opacity(0.5);
    }
    .pageButton {
      background: url(../static/homePage/homePageButton.png) no-repeat;
      background-size: 100% 100%;
      width: 65.2vw;
      height: 7.9vw;
      outline: none;
      border: none;
      position: absolute;
      bottom: 5vh;
      left: 17.4vw;
    }
    ul {
      margin: 0;
      padding: 0;
      position: relative;
      li {
        list-style: none;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        height: 177vw;
        width: 100vw;
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: none;
      }
      .font0 {
        background-image: url(../static/homePage/1.png);
        height: 68vw;
      }
      .font1 {
        background-image: url(../static/homePage/2.png);
      }
      .font2 {
        background-image: url(../static/homePage/3.png);
      }
      .font3 {
        background-image: url(../static/homePage/4.png);
        height: 61.2vw;
      }
      .font4 {
        background-image: url(../static/homePage/5.png);
      }
      .font5 {
        background-image: url(../static/homePage/6.png);
      }
      .font6 {
        background-image: url(../static/homePage/7.png);
      }
    }
  }
}
</style>

<template>
  <div id="app">
    <rightButton
      :showButtonName="showButtonName"
      :isShowShadow="isShowShadow"
      @result="result"
    ></rightButton>
    <transition name="fade">
      <showPopup
        @popupClick="popupClick"
        :isShowContent="isShowContent"
        v-show="isShowPopup"
      ></showPopup>
    </transition>
    <router-view />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import rightButton from "./components/rightButton.vue";
import showPopup from "./components/showPopup.vue";
interface showContent {
  [key: string]: string | number;
}
interface content {
  contentName: string;
  content: Content;
}
type Content = showContent[] | popupContent | null;
interface popupContent {
  name: string;
  buttonText: string;
  imgUrl: string;
  prize?: string;
}
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
  //点击右上按钮应该显示的内容
  isShowContent: content = { contentName: "rule", content: null };
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
      this.$router.push("/");
      this.showButtonName = ["rule", "myMoonCake", "rank"];
    }
  }
  // 点击右上按钮的不同结果
  result(e: string) {
    switch (e) {
      case "rule":
        this.alertPopup("popupBox", {
          imgUrl: "",
          name: "楼中月",
          prize: "馅料",
          buttonText: "好的"
        });
        // this.alertPopup("rule");
        break;
      case "myMoonCake":
        if (this.$route.name === "myMoonCake") {
          return;
        }
        this.$router.push("/myMoonCake");
        break;
      case "rank":
        this.alertPopup("rank", [
          {
            rank: "NO.1",
            memberNo: "0000002",
            headImgUrl:
              "http://thirdwx.qlogo.cn/mmopen/zdnK20sibswjylfCrCU6mUoERwTJBeAjV0RkiaSvwQXg1QOMNichJ4brWszO5iasicSIkVBsGHR9yRjuwQia2aDDK4fTTyHqpyhDIk/132",
            cakeAmount: 25
          },
          {
            rank: "NO.2",
            memberNo: "0000002",
            headImgUrl:
              "http://thirdwx.qlogo.cn/mmopen/zdnK20sibswjylfCrCU6mUoERwTJBeAjV0RkiaSvwQXg1QOMNichJ4brWszO5iasicSIkVBsGHR9yRjuwQia2aDDK4fTTyHqpyhDIk/132",
            cakeAmount: 5
          },
          {
            rank: "NO.3",
            memberNo: "0000002",
            headImgUrl:
              "http://thirdwx.qlogo.cn/mmopen/zdnK20sibswjylfCrCU6mUoERwTJBeAjV0RkiaSvwQXg1QOMNichJ4brWszO5iasicSIkVBsGHR9yRjuwQia2aDDK4fTTyHqpyhDIk/132",
            cakeAmount: 5
          },
          {
            rank: "NO.4",
            memberNo: "0000002",
            headImgUrl:
              "http://thirdwx.qlogo.cn/mmopen/zdnK20sibswjylfCrCU6mUoERwTJBeAjV0RkiaSvwQXg1QOMNichJ4brWszO5iasicSIkVBsGHR9yRjuwQia2aDDK4fTTyHqpyhDIk/132",
            cakeAmount: 5
          },
          {
            rank: "NO.5",
            memberNo: "0000002",
            headImgUrl:
              "http://thirdwx.qlogo.cn/mmopen/zdnK20sibswjylfCrCU6mUoERwTJBeAjV0RkiaSvwQXg1QOMNichJ4brWszO5iasicSIkVBsGHR9yRjuwQia2aDDK4fTTyHqpyhDIk/132",
            cakeAmount: 5
          },
          {
            rank: "NO.6",
            memberNo: "0000002",
            headImgUrl:
              "http://thirdwx.qlogo.cn/mmopen/zdnK20sibswjylfCrCU6mUoERwTJBeAjV0RkiaSvwQXg1QOMNichJ4brWszO5iasicSIkVBsGHR9yRjuwQia2aDDK4fTTyHqpyhDIk/132",
            cakeAmount: 5
          },
          {
            rank: "NO.7",
            memberNo: "0000002",
            headImgUrl:
              "http://thirdwx.qlogo.cn/mmopen/zdnK20sibswjylfCrCU6mUoERwTJBeAjV0RkiaSvwQXg1QOMNichJ4brWszO5iasicSIkVBsGHR9yRjuwQia2aDDK4fTTyHqpyhDIk/132",
            cakeAmount: 5
          },
          {
            rank: "NO.7",
            memberNo: "0000002",
            headImgUrl:
              "http://thirdwx.qlogo.cn/mmopen/zdnK20sibswjylfCrCU6mUoERwTJBeAjV0RkiaSvwQXg1QOMNichJ4brWszO5iasicSIkVBsGHR9yRjuwQia2aDDK4fTTyHqpyhDIk/132",
            cakeAmount: 5
          },
          {
            rank: "NO.7",
            memberNo: "0000002",
            headImgUrl:
              "http://thirdwx.qlogo.cn/mmopen/zdnK20sibswjylfCrCU6mUoERwTJBeAjV0RkiaSvwQXg1QOMNichJ4brWszO5iasicSIkVBsGHR9yRjuwQia2aDDK4fTTyHqpyhDIk/132",
            cakeAmount: 5
          },
          {
            rank: "NO.7",
            memberNo: "0000002",
            headImgUrl:
              "http://thirdwx.qlogo.cn/mmopen/zdnK20sibswjylfCrCU6mUoERwTJBeAjV0RkiaSvwQXg1QOMNichJ4brWszO5iasicSIkVBsGHR9yRjuwQia2aDDK4fTTyHqpyhDIk/132",
            cakeAmount: 5
          }
        ]);
        break;
    }
  }
  //弹出弹出框
  alertPopup(e: string | boolean, f?: Content) {
    //留一个关闭的方法，不一定用到
    if (typeof e === "boolean") {
      this.popupClick();
      return;
    }
    this.isShowContent = {
      contentName: e,
      content: f || null
    };
    this.isShowPopup = true;
    console.log(this.isShowContent);
  }
  //关闭弹出框
  popupClick(e?: string) {
    console.log(e);
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

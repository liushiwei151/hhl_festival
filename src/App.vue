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
const api = require("./api/index.js");
interface ShowContent {
  [key: string]: string | number | null;
}
interface Contents {
  contentName: string;
  content: Content;
}
type Content = ShowContent[] | PopupContent | null;
interface PopupContent {
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
  isShowContent: Contents = { contentName: "rule", content: null };
  //排行榜返回的值
  rankData!: ShowContent[];

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
  created(): void {
    this.getJsSign();
  }
  mounted(): void {
    if (this.$route.name !== "Home") {
      this.$router.push("/");
      this.showButtonName = ["rule", "myMoonCake", "rank"];
    }
  }

  //返回并在local中存入openId
  setOpenId(e: string): string {
    localStorage.setItem("hhl_openId", e.split("=")[1]);
    return e.split("=")[1];
  }
  //获取微信权限
  getJsSign() {
    const self = this;
    let url = location.href.split("#")[0];
    localStorage.clear();
    url =
      "http://qrhhl.yunyutian.cn/cake/index.html?openid=oXslc067VusqD_qfe_Vh9j1oEBVc";
    const openId = this.setOpenId(url);
    // eslint-disable-next-line
    api.getjsSdk(url).then((res: any) => {
      const value = res.data.data;
      // eslint-disable-next-line
      (self as any).wx.config({
        debug: false,
        appId: value.appid,
        timestamp: value.timestamp, // 必填，生成签名的时间戳
        nonceStr: value.nonceStr, // 必填，生成签名的随机串
        signature: value.signature, // 必填，签名
        jsApiList: ["getLocation", "hideAllNonBaseMenuItem"] // 必填，需要使用的JS接口列表
      });
      // eslint-disable-next-line
      (self as any).wx.ready(function() {
        // eslint-disable-next-line
        (self as any).wx.hideAllNonBaseMenuItem();
        (self as any).wx.getLocation({
          type: "wgs84",
          // eslint-disable-next-line
          success: function(res: any) {
            let data = {
              openid: openId,
              latitude: res.latitude || 0,
              longitude: res.longitude || 0
            };
            self.getUserInfo(data);
          },
          fail: function() {
            let data = {
              openid: openId,
              latitude: 0,
              longitude: 0
            };
            self.getUserInfo(data);
          }
        });
      });
    });
  }
  //接口：获取月饼排行榜
  getRank() {
    const self = this;
    api.getRank().then((res: any) => {
      self.rankData = res.data.data;
    });
  }
  // 接口：获取用户信息
  getUserInfo(e: ShowContent) {
    const self = this;
    api.getUserInfo(e).then((res: any) => {
      localStorage.setItem(
        "hhl_festival_userInfo",
        JSON.stringify(res.data.data)
      );
      self.getRank();
    });
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
        this.alertPopup(
          "rank",

          this.rankData
        );
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

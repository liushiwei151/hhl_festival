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
    <div class="wait" v-show="isWait"><div></div></div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Provide } from "vue-property-decorator";
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
  @Provide()
  public popup = this.alertPopup;
  @Provide()
  public wait = this.showWait;
  //是否显示等待
  isWait = false;
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
    if (this.$route.name !== "Home") {
      this.$router.push("/");
      this.showButtonName = ["rule", "myMoonCake", "rank"];
    }
    this.getJsSign();
  }
  //显隐wait
  showWait(e: boolean) {
    this.isWait = e;
  }
  //返回并在local中存入openId
  setOpenId(e: string): string {
    localStorage.setItem("hhl_openId", e.split("=")[1]);
    return e.split("=")[1];
  }
  //接口：分享游戏
  shareGame() {
    const self = this;
    const openids = window.localStorage.getItem("hhl_openId");
    // eslint-disable-next-line
    api.shareGame({ openid: openids }).then((res: any) => {
      self.$Toast({
        msg: "分享成功",
        duration: 1500
      });
    });
  }
  //获取微信权限
  getJsSign() {
    const self = this;
    let url = location.href.split("#")[0];
    localStorage.clear();
    //todo 本地
    // url =
    // "http://qrhhl.yunyutian.cn/cake/index.html?openid=oXslc067VusqD_qfe_Vh9j1oEBVc";
    const openId = this.setOpenId(url);
    const share = {
      title: "月满团圆，感恩有你",
      desc: "跟着楼楼做月饼，惊喜大奖等你赢！",
      // link: "https://wx.hhl1916.com/huanghelou1916-center/wx/gCode?name=toCake",
      link:
        "http://qrhhl.yunyutian.cn/huanghelou1916-center/wx/gCode?name=toCake",
      imgUrl: "https://pic.cwyyt.cn/upload/20200902/143606366_moon.jpg"
    };
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
        jsApiList: [
          "getLocation",
          "hideMenuItems",
          "onMenuShareAppMessage",
          "onMenuShareTimeline"
        ] // 必填，需要使用的JS接口列表
      });
      // eslint-disable-next-line
      (self as any).wx.ready(function() {
        self.$Toast({
          msg: "wait",
          duration: "9999990"
        });
        // eslint-disable-next-line
        (self as any).wx.getLocation({
          type: "wgs84",
          // eslint-disable-next-line
          success: function(res: any) {
            const data = {
              openid: openId,
              latitude: res.latitude || 0,
              longitude: res.longitude || 0
            };
            self.getUserInfo(data);
          },
          fail: function() {
            const data = {
              openid: openId,
              latitude: 0,
              longitude: 0
            };
            self.getUserInfo(data);
          }
        });
        // eslint-disable-next-line
        (self as any).wx.hideMenuItems({
          menuList: [
            "menuItem:editTag",
            "menuItem:copyUrl",
            "menuItem:originPage",
            "menuItem:openWithQQBrowser",
            "menuItem:openWithSafari",
            "menuItem:share:email",
            "menuItem:share:brand"
          ]
        });
        // eslint-disable-next-line
        (self as any).wx.onMenuShareTimeline({
          title: share.title, // 分享标题
          link: share.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: share.imgUrl, // 分享图标
          success: function() {
            // 设置成功
            self.shareGame();
          }
        });
        // eslint-disable-next-line
        (self as any).wx.onMenuShareAppMessage({
          title: share.title, // 分享标题
          desc: share.desc, //分享描述
          link: share.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: share.imgUrl, // 分享图标
          type: "", // 分享类型,music、video或link，不填默认为link
          dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
          success: function() {
            // 设置成功
            self.shareGame();
          }
        });
      });
    });
  }
  //接口：获取月饼排行榜
  getRank(e?: string) {
    const self = this;
    // eslint-disable-next-line
    api.getRank().then((res: any) => {
      self.rankData = res.data.data;
      if (e === "click") {
        self.alertPopup(
          "rank",

          self.rankData
        );
      }
    });
  }
  // 接口：获取用户信息
  getUserInfo(e: ShowContent) {
    const self = this;
    self.$Toast({
      msg: "wait",
      duration: "0"
    });
    // eslint-disable-next-line
    api.getUserInfo(e).then((res: any) => {
      localStorage.setItem(
        "hhl_festival_userInfo",
        JSON.stringify(res.data.data)
      );
      // self.getRank();
    });
  }
  // 点击右上按钮的不同结果
  result(e: string) {
    switch (e) {
      case "rule":
        this.alertPopup("rule");
        break;
      case "myMoonCake":
        if (this.$route.name === "myMoonCake") {
          return;
        }
        this.$router.push("/myMoonCake");
        break;
      case "rank":
        this.getRank("click");
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
ul,
p {
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
// .wait {
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   z-index: 100;
//   background-color: rgba(0, 0, 0, 0.5);
//   div {
//     background: url(./assets/loading-1.gif) no-repeat;
//     background-size: 100% 100%;
//     width: 10vw;
//     height: 10vw;
//   }
// }
</style>

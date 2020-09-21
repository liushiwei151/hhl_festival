<template>
  <div class="page">
    <transition name="fade">
      <div id="pageBox" v-show="isShowBox"></div>
    </transition>
    <transition name="fade">
      <div class="teachImgBox" v-show="isShowTeach">
        <div class="img">
          <div>
            <p>举起手机</p>
            <p>找到夜空中的满月并对准</p>
          </div>
        </div>
      </div>
    </transition>
    <!-- 首页 -->
    <transition name="fade">
      <home-page @startGame.once="startGame" v-show="isShowPage"></home-page>
    </transition>
    <!-- 显示地址的动画 -->
    <transition name="fade">
      <div class="bg2" v-show="isShowBg">
        <transition name="fade">
          <div class="position" v-show="isShowBg1">
            <div class="positionPoint"></div>
            <p>您现在的位置: {{ userInfo.city }}</p>
            <p>东经: {{ userInfo.longitude }}</p>
            <p>北纬: {{ userInfo.latitude }}</p>
            <div class="arc" :class="{ arcAnimation: arcAnimation }"></div>
          </div>
        </transition>
        <transition name="fade">
          <div class="arcWeb" v-show="isShowBg2">
            <div
              class="arc"
              style="top:0"
              :class="{ arcAnimation2: arcAnimation2 }"
            ></div>
            <div class="arcText">
              <p>为您空降</p>
              <p>湖北·武汉·黄鹤楼</p>
              <p>最佳赏月地点</p>
            </div>
          </div>
        </transition>

        <transition name="fade">
          <div class="mapBox" v-show="isShowBg3">
            <div class="mapImg" :class="{ light: isLight }"></div>
            <div class="mapText"></div>
          </div>
        </transition>
      </div>
    </transition>
    <!-- 拍照选词页面 -->
    <transition name="fade">
      <div
        ref="shotImage"
        class="photographWeb"
        v-show="photographWeb"
        @click.stop="screenShot()"
        :class="{ blur: isBlur }"
      >
        <div class="randomMoon" :style="{ left: moonPosition }"></div>
      </div>
    </transition>
    <!-- 提示语句为避免被截图移除shotImage -->
    <transition name="fade">
      <div class="tipText" v-show="photographWeb && !isBlur">
        <p>点击屏幕任意一处</p>
        <p>拍下您的满月时刻</p>
      </div>
    </transition>

    <!-- 选择句子 -->
    <transition name="fade">
      <div
        class="choseBox"
        v-show="isChoseBox"
        @touchstart="touchStart"
        @touchend="touchEnd"
      >
        <div>
          <p>上下滑动</p>
          <p>选择诗词</p>
        </div>
        <div class="contentBox">
          <div class="left"></div>
          <transition-group tag="ul" class="center" name="slide" mode="out-in">
            <li v-for="item in poetryText" :key="item.id">
              <p>{{ item.p1 }}</p>
              <p>{{ item.p2 }}</p>
            </li>
          </transition-group>
          <div class="right">
            <span>{{ poetryText[0].id }}</span>
            <span class="xian"></span>
            <span>{{ poetryText.length }}</span>
          </div>
        </div>
        <div class="choseConfirm" @click="choseConfirm"></div>
      </div>
    </transition>
    <!-- 返回的图片 -->
    <transition name="fade">
      <div class="imgBox" ref="imgBox" v-show="isShowImgBox">
        <div class="imgBoxClose" @click="imgBoxClose"></div>
      </div>
    </transition>
    <!-- 最后的页面 -->
    <transition name="fade">
      <div v-show="lastWeb" class="lastWeb">
        <div class="lastMoon"></div>
        <transition-group name="fade" style="padding-left:14vw">
          <p class="p1" key="p1" v-show="lastAnimation.p1"></p>
          <p class="p2" key="p2" v-show="lastAnimation.p2"></p>
          <p class="p3" key="p3" v-show="lastAnimation.p3"></p>
          <p class="p4" key="p4" v-show="lastAnimation.p4"></p>
          <button
            key="button"
            v-show="lastAnimation.button"
            @click="restart"
          ></button>
        </transition-group>

        <div
          class="arrow"
          :class="{ arrowAnimation: lastAnimation.arrow }"
        ></div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Inject } from "vue-property-decorator";
import homePage from "../components/homePage.vue";
import html2canvas from "html2canvas";
const C3D = require("../common/css3d.js");
const Orienter = require("../common/orienter.js");
const JT = require("../common/jstween.js");
const api = require("../api/index.js");

interface User {
  [key: string]: string | number;
}
@Component({
  components: {
    homePage
  }
})
export default class Page extends Vue {
  @Inject()
  private restart!: Function;
  //是否显示首页
  isShowPage = true;
  requestAnimationFrame =
    window.requestAnimationFrame || window.webkitRequestAnimationFrame;
  //客户信息
  userInfo: User | null = {
    city: "",
    latitude: 0,
    longitude: 0
  };
  //c3d属性无声明，全用any替代
  //c3d舞台
  stage: any;
  //c3d平面
  p: any;
  //c3d容器
  root: any;
  drag = { lat: 0, lon: 0 }; //c
  aim = { lat: 0, lon: 0 }; //d
  fix = { lon: 0, lat: 0 }; //f
  lock = true;
  panoBgBox: any;
  //背景图片信息
  bgInfo: any = null;
  //交互按钮组
  panoDots: any = null;
  panoItems: any = null;
  teachImg: any = null;
  //计算时间
  timeValue = 0;
  elapsed: number | null = null;
  //是否显示教程图
  isShowTeach = false;
  //是否显示场景
  isShowBox = true;
  // 是否显示地址背景图
  isShowBg = false;
  //是否显示弧线动画
  arcAnimation = false;
  //第二个弧线动画
  arcAnimation2 = false;
  //是否显示经纬度页面1
  isShowBg1 = true;
  //是否显示弧线提示页面2
  isShowBg2 = false;
  //是否显示地图页面3
  isShowBg3 = false;
  //是否显示地图光晕
  isLight = false;
  //是否显示拍照页面
  photographWeb = false;
  // 是否显示背景模糊
  isBlur = false;
  //是否显示选择诗词页面
  isChoseBox = false;
  //是否显示返回的截图
  isShowImgBox = false;
  //截图的图片base64值
  imgText: string | null = null;
  //诗词文本
  poetryText = [
    { p1: "海山生明月", p2: "天涯共此时", id: 1 },
    { p1: "花好月圆人长久", p2: "", id: 2 },
    { p1: "但愿人长久", p2: "千里共婵娟", id: 3 },
    { p1: "皓月挂高楼", p2: "相思传万里", id: 4 },
    { p1: "愿把团圆盏", p2: "黄鹤寄真情", id: 5 },
    { p1: "秋正平分月正圆", p2: "楼上佳人倚栏前", id: 6 },
    { p1: "黄鹤绕月飞", p2: "吉祥天地间", id: 7 },
    { p1: "佳节必有黄鹤楼", p2: "", id: 8 },
    { p1: "月上层楼话团圆", p2: "鹤舞九天庆中秋", id: 9 }
  ];
  //诗词页面触摸手机屏幕开始y坐标
  t1 = 0;
  //诗词页面触摸结束结束y坐标
  t2 = 0;
  //是否显示最后的结束页面
  lastWeb = false;
  //结束页面的动画数据
  lastAnimation = {
    p1: false,
    p2: false,
    p3: false,
    p4: false,
    arrow: false,
    button: false
  };
  //测试开关
  ceshi = false;

  get moonPosition(): string {
    const num = Math.random() * 60 + 10;
    return num + "vw";
  }
  @Watch("t1")
  watchT1() {
    setTimeout(() => {
      const t = this.t1 - this.t2;
      //上滑动
      if (t > 0 && t > 20) {
        this.topTouch();
      } else if (t < 0 && t < -20) {
        this.bottomTouch();
      }
    }, 300);
  }
  mounted() {
    const self = this;
    this.getJsSign();
    this.init();
    if (this.ceshi) {
      this.isShowPage = false;
      this.lastWeb = true;
      this.lastAni();
      // this.isChoseBox = true;
      // this.actiondh();
    }
    // this.actiondh();
    // window.onresize = function() {
    // self.resize();
    // };
    // self.resize();
  }
  //结束页面动画效果
  lastAni() {
    Vue.set(this.lastAnimation, "p1", true);
    setTimeout(() => {
      Vue.set(this.lastAnimation, "p2", true);
      setTimeout(() => {
        Vue.set(this.lastAnimation, "p3", true);
        setTimeout(() => {
          Vue.set(this.lastAnimation, "p4", true);
          setTimeout(() => {
            Vue.set(this.lastAnimation, "arrow", true);
            setTimeout(() => {
              Vue.set(this.lastAnimation, "button", true);
            }, 2000);
          }, 700);
        }, 700);
      }, 700);
    }, 700);
  }
  //关闭海报页面打开最后的页面
  imgBoxClose() {
    const self = this;
    this.isShowImgBox = false;
    this.lastWeb = true;
    setTimeout(() => {
      self.lastAni();
    }, 300);
  }
  //返回并在local中存入openId
  setOpenId(e: string): string {
    // localStorage.setItem("hhl_openId", e.split("=")[1]);
    return e.split("=")[1];
  }
  //获取微信权限
  getJsSign() {
    const self = this;
    const url = location.href.split("#")[0];
    localStorage.clear();
    //todo 本地
    // url =
    // "http://qrhhl.yunyutian.cn/national/index.html?openid=oXslc08kYzfJOxRnOpnCQR4EYULU";
    const openId = this.setOpenId(url);
    const share = {
      title: "月满团圆，感恩有你",
      desc: "月上层楼话团圆·鹤舞九天庆中秋",
      link:
        "https://wx.hhl1916.com/huanghelou1916-center/wx/gCode?name=toNational",
      imgUrl: "https://pic.cwyyt.cn/upload/20200921/115802582_shareImg.jpg"
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
            // self.shareGame();
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
            // self.shareGame();
          }
        });
      });
    });
  }
  //获取用户信息
  getUserInfo(e: any) {
    const self = this;
    // eslint-disable-next-line
    api.getUserInfo(e).then((res: any) => {
      localStorage.setItem(
        "hhl_fullMoon_userInfo",
        JSON.stringify(res.data.data)
      );
      self.userInfo = res.data.data;
    });
  }
  //分享成功
  // shareGame() {}
  //开始触摸
  touchStart(t: any) {
    this.t1 = t.changedTouches[0].clientY;
  }
  //结束触摸
  touchEnd(t: any) {
    this.t2 = t.changedTouches[0].clientY;
  }
  //向上滑动
  topTouch() {
    this.poetryText.unshift(this.poetryText[this.poetryText.length - 1]);
    this.poetryText.splice(this.poetryText.length - 1, 1);
  }
  //向下滑动
  bottomTouch() {
    this.poetryText[this.poetryText.length] = this.poetryText[0];
    this.poetryText.splice(0, 1);
  }
  //选择诗词的确定
  choseConfirm() {
    const self = this;
    //接口获取图片
    if (this.imgText === null) {
      alert("截取图片失败");
      return;
    }
    if (this.userInfo === null) {
      alert("获取用户信息失败！");
      return;
    }
    const text = this.imgText;
    let t = this.poetryText[0].p1;
    if (this.poetryText[0].p2 !== "") {
      t = t + "," + this.poetryText[0].p2;
    }
    const data = {
      base64Str: text,
      greeting: t,
      latitude: this.userInfo.latitude,
      longitude: this.userInfo.longitude,
      userId: this.userInfo.id
    };
    api.getImg(data).then((res: any) => {
      const image = new Image();
      image.src = res.data.data;
      image.width = window.innerWidth;
      image.height = window.innerHeight;
      (self.$refs.imgBox as Element).appendChild(image);
      image.onload = () => {
        setTimeout(() => {
          self.isShowImgBox = true;
        }, 300);
      };
    });
  }
  //截图
  screenShot() {
    const self = this;
    const elm = self.$refs.shotImage as HTMLElement;
    html2canvas(elm, {
      width: window.innerWidth,
      height: window.innerHeight
    }).then(canvas => {
      const image = new Image();
      const img = canvas.toDataURL("image/jpeg");
      image.src = img;
      self.isBlur = true;
      self.isChoseBox = true;
      self.imgText = img;
      // document.body.appendChild(image);
      // console.log(image);
    });
  }

  //动态显示地图阴影
  showlight() {
    const self = this;
    if (this.isShowBg3) {
      // this.isLight = !this.isLight;
      setTimeout(() => {
        self.isLight = !self.isLight;
        self.showlight();
      }, 1000);
    }
  }
  //初始化
  init() {
    //创建舞台并添加进div中
    this.stage = new C3D.Stage();
    this.stage
      .size(640, window.innerHeight)
      .material({ color: "#cccccc" })
      .update();
    const stageDiv = document.getElementById("pageBox") as HTMLElement;
    stageDiv.appendChild(this.stage.el);

    //创建容器
    this.root = new C3D.Sprite();
    this.root.position(0, 0, -100).update();
    this.stage.addChild(this.root);
    //创建一个记录用的容器
    this.panoItems = new C3D.Sprite();
    this.panoItems
      .name("panoItems")
      .position(0, 0, 0)
      .update();
    //创建背景容器
    this.panoBg();
    //重力感应
    this.orienter();
    //添加月亮
    this.addMoon();
    //添加教学
    // this.addTeach();
    //测试用，绑定鼠标移动
    this.onTouch(stageDiv);
    //播放教学动画
    //刷新动画
    // requestAnimationFrame(function(callback) {
    //   console.log(callback);
    //   setTimeout(() => {
    //     callback;
    //   }, 1000 / 60);
    // });
  }
  addMoon() {
    const self = this;
    const value = {
      name: "moon",
      x: 3000,
      y: 1200,
      actor: {
        w: 200 * 0.7,
        h: 200 * 0.7,
        x: 0,
        y: 0,
        url: require("../static/pageBox/moon.png")
      },
      info: {
        w: 186 * 0.7,
        h: 180 * 0.7,
        x: 100,
        y: 117,
        url: require("../static/pageBox/point.png")
      }
    };
    this.panoDots = new C3D.Sprite();
    this.panoDots
      .name("panoDots")
      .position(0, 0, 0)
      .update();
    const Q = (-360 * (value.x - 80)) / this.bgInfo.o.w,
      G = (90 * (value.y - this.bgInfo.o.h / 2)) / this.bgInfo.o.h,
      M = (Q / 180) * Math.PI,
      Y = this.bgInfo.h - 80,
      // C3D.create 通过配置来创建指定的元素
      i = C3D.create({
        type: "sprite",
        name: value.name,
        scale: [1],
        children: [
          {
            type: "plane",
            name: "dot",
            size: [value.actor.w, value.actor.h],
            position: [value.actor.x, value.actor.y, 0],
            // rotation: [G, 0, 0],
            visibility: [{ alpha: 1 }],
            material: [
              {
                image: value.actor.url,
                size: "cover",
                bothsides: false
              }
            ]
          },
          {
            type: "plane",
            name: "point",
            position: [value.info.x, value.info.y, 0],
            scale: [1, 1, 1],
            size: [value.info.w, value.info.h],
            visibility: [{ alpha: 0 }],
            material: [
              { image: value.info.url, size: "cover", bothsides: false }
            ]
          }
        ]
      });
    i
      .position(
        Math.sin(M) * Y,
        0.9 * (value.y - this.bgInfo.o.h / 2),
        Math.cos(M) * Y
      )
      .rotation(3, -93, 0)
      .updateT(),
      // 为此元素绑定触摸事件，此处可以用于点击时，执行一些操作。
      i.on("touchend", function(e: any) {
        self.showAnimation();
      }),
      (i.r0 = Q),
      (i.w0 = value.actor.w),
      (i.data = value);

    i.dot.update();
    this.panoDots.addChild(i);

    this.root.addChild(this.panoDots);
  }
  //背景
  panoBg() {
    // 定义背景图片的个数
    const bgImage = [
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
      require("../static/pageBox/pageBox_01.png")
    ];
    const bgNum = bgImage.length;
    // 背景的宽高信息，也就是那张背景大图的宽高 bgInfo
    this.bgInfo = {
      //图片宽高
      o: { w: 4000, h: 3000 },
      //被均分的图片宽度
      M: 4000 / bgNum,
      //图片间隔系数，根据大图宽度调整
      h: 625
    };

    //创建背景容器
    this.panoBgBox = new C3D.Sprite();
    this.panoBgBox
      .name("panoBg")
      .position(0, 0, 0)
      .rotation(0, -50, 0)
      .update();
    this.root.addChild(this.panoBgBox);
    for (let R = 0; R < bgNum; R++) {
      const F = new C3D.Plane(),
        H = (-360 / bgNum) * R,
        J = (H / 180) * Math.PI,
        U = this.bgInfo.h;

      // 设置场景的基本显示信息，这里默认是不可见的，alpha为0
      // size：设置大小 position：设置位置 rotation：设置选择角度 visibility：设置可见性
      // material 设置材质，这里的话，直接用来简单的设置背景图片
      F.size(this.bgInfo.M, this.bgInfo.o.h)
        .position(Math.sin(J) * U, 150, Math.cos(J) * U)
        .rotation(0, H + 180, 0)
        .visibility({
          alpha: 1
        })
        .material({
          image: bgImage[R],
          bothsides: !1
        })
        .update();
      this.panoBgBox.addChild(F);
    }
  }
  //重力感应
  orienter() {
    const self = this;
    const o2 = new Orienter();
    o2.onOrient = function(t: any) {
      //-90至90是手机角度，限制上下角度
      if (t.lat < 70 && t.lat > -80) {
        self.aim.lat = t.lat;
      }
      // if (t.lon < 135 || t.lon > 200) {
      self.aim.lon = -t.lon;
      // }

      // if (self.lock) {
      //   self.fix.lat = -self.aim.lat;
      //   self.fix.lon = -self.aim.lon;
      // }
    };
    o2.on();
  }
  //添加触摸模式
  onTouch(e: HTMLElement) {
    const self = this;
    const originTouchPos = {
      x: 0,
      y: 0
    };
    const oldTouchPos = {
      x: 0,
      y: 0
    };
    const newTouchPos = {
      x: 0,
      y: 0
    };
    let firstDir = "",
      originTime = 0,
      oldTime = 0,
      newTime = 0,
      dx = 0,
      dy = 0,
      ax = 0,
      ay = 0,
      time = 0;
    const onTouchMove = function(t: any) {
      self.stage.off("touchend", onTouchEnd);
      return (
        (t = t.changedTouches[0]),
        (newTouchPos.x = t.clientX),
        (newTouchPos.y = t.clientY),
        (newTime = Date.now()),
        checkGesture(),
        (oldTouchPos.x = newTouchPos.x),
        (oldTouchPos.y = newTouchPos.y),
        (oldTime = newTime),
        !1
      );
    };
    const onTouchEnd = function(e: any) {
      newTime = Date.now();
      const t = (newTime - oldTime) / 1e3;

      // 这里可以通过e.target获取到触发了此touchend事件的dom对象，
      // 这样就可以根据此对象来判断是点击了哪个场景的元素。当然，可以直接为元素绑定点击事件，在此处绑定
      // TODO

      self.stage.off("touchmove", onTouchMove),
        self.stage.off("touchend", onTouchEnd);
    };
    // touchstart事件处理函数
    const onTouchStart = function(t: any) {
      (firstDir = ""), (t = t.changedTouches[0]);
      originTouchPos.x = oldTouchPos.x = newTouchPos.x = t.clientX;
      originTouchPos.y = oldTouchPos.y = newTouchPos.y = t.clientY;
      originTime = oldTime = newTime = Date.now();
      (dx = dy = ax = ay = 0),
        self.stage.on("touchmove", onTouchMove),
        self.stage.on("touchend", onTouchEnd);
    };
    self.stage.on("touchstart", onTouchStart);

    const checkGesture = function() {
      (dx = self.fixed2(newTouchPos.x - originTouchPos.x)),
        (dy = self.fixed2(newTouchPos.y - originTouchPos.y)),
        (ax = self.fixed2(newTouchPos.x - oldTouchPos.x)),
        (ay = self.fixed2(newTouchPos.y - oldTouchPos.y)),
        (time = (newTime - oldTime) / 1e3);
      "" == firstDir &&
        (Math.abs(ax) > Math.abs(ay)
          ? (firstDir = "x")
          : Math.abs(ax) < Math.abs(ay) && (firstDir = "y"));
      self.tirgerMove({ dx, dy, ax, ay, firstDir });
      // 此处可以调整45和-45的数值，他们用于场景的上下视角控制
      (self.drag.lon = (self.drag.lon - 0.2 * ax) % 360),
        (self.drag.lat = Math.max(-45, Math.min(45, self.drag.lat + 0.2 * ay)));
    };
  }
  //计算移动值
  tirgerMove(obj: any) {
    // if (this.lock) return;
    this.drag.lon = (this.drag.lon - obj.ax * 0.2) % 360;
    this.drag.lat = Math.max(-90, Math.min(90, this.drag.lat + obj.ay * 0.2));
  }
  actiondh() {
    const t = (this.aim.lon + this.fix.lon + this.drag.lon) % 360;
    const i = 0.35 * (this.aim.lat + this.fix.lat + this.drag.lat);
    /* console.log(
      this.aim.lon,
      this.fix.lon,
      this.drag.lon,
		);*/
    t - this.panoBgBox.rotationY > 180 && (this.panoBgBox.rotationY += 360),
      t - this.panoBgBox.rotationY < -180 && (this.panoBgBox.rotationY -= 360);
    const n = t - this.panoBgBox.rotationY,
      a = i - this.panoBgBox.rotationX;
    Math.abs(n) < 0.1
      ? (this.panoBgBox.rotationY = t)
      : (this.panoBgBox.rotationY += 0.3 * n);
    Math.abs(a) < 0.1
      ? (this.panoBgBox.rotationX = i)
      : (this.panoBgBox.rotationX += 0.15 * a);

    this.panoBgBox.updateT();

    // 每次更新场景位置时，都需要重新更新你添加的交互元素的位置，你添加了哪些容器
    // 每次就需要更新那些容器的位置。
    (this.panoDots.rotationY = this.panoBgBox.rotationY),
      (this.panoDots.rotationX = this.panoBgBox.rotationX),
      this.panoDots.updateT(),
      t - this.panoItems.rotationY > 180 && (this.panoItems.rotationY += 360),
      t - this.panoItems.rotationY < -180 && (this.panoItems.rotationY -= 360);
    // console.log(this.panoItems.rotationY)
    const o = t - this.panoItems.rotationY,
      r = i - this.panoItems.rotationX;
    Math.abs(o) < 0.1
      ? (this.panoItems.rotationY = t)
      : (this.panoItems.rotationY += 0.25 * o),
      Math.abs(r) < 0.1
        ? (this.panoItems.rotationX = i)
        : (this.panoItems.rotationX += 0.15 * r),
      this.panoItems.updateT();

    // var s12 = -150 - 20 * Math.abs(n);
    // (this.root.z += 0.1 * (s12 - this.root.z)),
    // this.root.updateT(),
    this.showMoon(this.panoItems.rotationY);
    requestAnimationFrame(this.actiondh);
  }
  //显示月亮和文字
  showMoon(ry: number) {
    const actor = this.root.panoDots.children[0].children[1];

    //月亮出现的区间
    if ((ry > 68 && ry < 140) || (ry < -216 && ry > -293)) {
      // actor.children[0].visibility({ alpha: 1 }).updateV();
      // actor.children[1].visibility({ alpha: 1 }).updateV();
      if (actor.alpha !== 1) {
        JT.kill(actor);
        JT.to(actor, 0.3, {
          x: actor.x,
          y: actor.y,
          scaleX: 1,
          scaleY: 1,
          alpha: 1,
          ease: JT.Quad.Out,
          onUpdate: function() {
            actor.visibility({ alpha: 1 }).updateV();
          }
        });
      }

      // JT.to(i.alpha, 0.3, "1");
    } else {
      if (actor.alpha === 1) {
        JT.kill(actor);
        JT.to(actor, 0.3, {
          x: actor.x,
          y: actor.y,
          scaleX: 1,
          scaleY: 1,
          alpha: 0,
          ease: JT.Quad.Out,
          onUpdate: function() {
            console.log(actor);
            actor.visibility({ alpha: 0 }).updateV();
          }
        });
      }
    }
  }
  // 功能函数
  fixed2(t: number): number {
    return Math.floor(100 * t) / 100;
  }
  modelRandom(n1: number, n2: number): number {
    return n1 + Math.floor(Math.random() * (n2 - n1) * 100) / 100;
  }

  //地址页面动画显示
  showAnimation() {
    const self = this;
    // 关闭全景环境
    self.isShowBox = false;
    // 显示二阶段页面
    self.isShowBg = true;
    //开始弧线动画
    setTimeout(() => {
      self.arcAnimation = true;
      // 开始二阶段第二页面，并关闭第一页面经纬度
      setTimeout(() => {
        self.isShowBg1 = false;
        self.isShowBg2 = true;
        self.arcAnimation2 = true;
        setTimeout(() => {
          //关闭第二页面，开启第三地图页面并开始地图光影效果
          self.isShowBg2 = false;
          self.isShowBg3 = true;
          setTimeout(() => {
            self.isLight = true;
          }, 1500); //第二阶段关闭进入拍照页面
          setTimeout(() => {
            self.isShowBg = false;
            self.isShowBg3 = false;
            self.isLight = false;
            self.photographWeb = true;
          }, 4000);
        }, 4000);
      }, 4000);
    }, 1000);
  }
  // 教学动画显示
  go() {
    const self = this;
    self.getTime("start");
    const teachAnimation = function() {
      const time = self.getTime("get");
      if (time < 3000) {
        self.root.rotationY += 0.3;
        self.root.updateT();
      } else if (time > 3000 && time < 6000) {
        self.root.rotationY -= 0.4;
        self.root.updateT();
      } else if (time > 6000) {
        //关闭教程图，开始陀螺仪计算
        self.isShowTeach = false;
        setTimeout(() => {
          self.actiondh();
          self.getTime("end");
        }, 1500);
        return;
      }
      requestAnimationFrame(teachAnimation);
    };
    requestAnimationFrame(teachAnimation);
  }
  //计算时间的函数
  getTime(e: string): number {
    // start开始计时end结束计时get获取从start开始到当前的时间elapsed获取两次调用的间隔
    if (e === "elapsed") {
      const newTime = new Date().getTime();
      if (this.elapsed === null) {
        this.elapsed = newTime;
      } else {
        const elapsed = newTime - this.elapsed;
        this.elapsed = newTime;
        return elapsed;
      }
    } else if (e === "start") {
      this.timeValue = new Date().getTime();
      return this.timeValue;
    } else if (e === "end") {
      this.timeValue = 0;
      return this.timeValue;
    } else if (e === "get") {
      const newTime = new Date().getTime();
      return newTime - this.timeValue;
    }
    return 0;
  }
  //添加教学
  addTeach() {
    const self = this;
    const teach = {
      name: "teachImg",
      x: 0,
      y: 0,
      dot: require("../static/pageBox/teachImg.png"),
      w: 667 * 0.7,
      h: 1051 * 0.7
    };
    this.teachImg = new C3D.Sprite();
    this.teachImg
      .name("teachImg")
      .position(0, 0, 0)
      .update();
    const Q = (-360 * (teach.x - 80)) / this.bgInfo.o.w,
      G = (90 * (teach.y - this.bgInfo.o.h / 2)) / this.bgInfo.o.h,
      M = (Q / 180) * Math.PI,
      Y = this.bgInfo.h - 80,
      // C3D.create 通过配置来创建指定的元素
      i = C3D.create({
        type: "sprite",
        name: teach.name,
        scale: [1],
        children: [
          {
            type: "plane",
            name: "dot",
            size: [teach.w, teach.h],
            position: [0, 2, 2],
            rotation: [G, 0, 0],
            material: [
              {
                image: teach.dot,
                size: "cover"
              }
            ],
            bothsides: !1
          }
        ]
      });

    i
      .position(
        Math.sin(M) * Y,
        0.9 * (teach.y - this.bgInfo.o.h / 2),
        Math.cos(M) * Y
      )
      .rotation(0, 0, 0)
      .updateT(),
      // 为此元素绑定触摸事件，此处可以用于点击时，执行一些操作。
      i.on("touchend", function(e: any) {
        // TODO
        console.log(e);
      }),
      (i.r0 = Q),
      (i.w0 = teach.w),
      (i.dot.alpha = 0.5),
      i.dot.updateV(),
      this.teachImg.addChild(i);
    console.log(this.teachImg);
    this.root.addChild(this.teachImg);
  }
  //响应屏幕调整尺寸
  resize() {
    this.stage.size(window.innerWidth, window.innerHeight).update();
    // this.p.position(0, 100, -this.stage.fov).updateT();
    // this.c.position(0, -100, -this.stage.fov).updateT();
  }
  //开始游戏
  startGame() {
    const self = this;
    this.isShowPage = false;
    setTimeout(() => {
      self.isShowTeach = true;
      self.go();
    }, 2000);
    // this.go();
  }
}
</script>
<style lang="less" scoped>
@bg: {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
};
@keyframes arcline {
  0% {
    height: 0;
  }
  100% {
    height: 80vh;
  }
}

@keyframes play {
  from {
    background-position: 0 100vw;
  }
  to {
    background-position: 0 0;
  }
}
@keyframes arrowMove {
  from {
    height: 0;
  }
  to {
    height: 10vh;
  }
}

.slide-move {
  transition: transform 1s;
}
.fade-enter-active {
  transition: opacity 3s;
}
.fade-leave-active {
  transition: opacity 1.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.arcAnimation {
  animation: arcline 4s linear;
  animation-fill-mode: forwards;
}
.arcAnimation2 {
  animation: arcline 4s linear;
  animation-fill-mode: forwards;
}
.lastWeb {
  @bg();
  background: url(../static/pageBox/lastBg.png) no-repeat;
  background-size: 100% 100%;
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  padding-top: 36vh;
  box-sizing: border-box;
  .arrowAnimation {
    animation: arrowMove 2s linear;
    animation-fill-mode: forwards;
  }
  .arrow {
    background: url(../static/pageBox/lastArrow.png) no-repeat;
    background-size: cover;
    width: 3vw;
    position: absolute;
    bottom: 0;
    margin: 0 48.5vw;
  }
  button {
    background: url(../static/pageBox/lastButton.png) no-repeat;
    background-size: 100% 100%;
    outline: none;
    border: none;
    width: 56vw;
    position: absolute;
    height: 9vw;
    bottom: 12vh;
    left: 25vw;
  }
  .p1 {
    background-image: url(../static/pageBox/p1.png);
  }
  .p2 {
    background-image: url(../static/pageBox/p2.png);
    margin-left: 33vw;
    box-sizing: border-box;
  }
  .p3 {
    background-image: url(../static/pageBox/p3.png);
    margin-left: 24vw;
  }
  .p4 {
    background-image: url(../static/pageBox/p4.png);
  }
  .lastMoon {
    background: url(../static/pageBox/lastMoon.png) no-repeat;
    background-size: 100% 100%;
    width: 25vw;
    height: 25vw;
    position: absolute;
    left: 10vw;
    top: 20vh;
  }
  p {
    width: 46vw;
    height: 7vw;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    margin: 1vh 27vw;
  }
}
.imgBox {
  position: fixed;
  top: 0;
  left: 0;
  .imgBoxClose {
    position: absolute;
    width: 5vw;
    height: 5vw;
    top: 5vw;
    right: 5vw;
    background: url(../static/pageBox/close.png) no-repeat;
    background-size: 100% 100%;
  }
}
.arc {
  background: url(../static/pageBox/hu.png) no-repeat;
  background-size: 100% auto;
  width: 37vw;
  position: absolute;
  top: 20vh;
  height: 0;
  left: 25vw;
}
.choseBox {
  @bg();
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 5vh 0;
  box-sizing: border-box;
  .contentBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5vw;
    box-sizing: border-box;
    width: 100%;
    .left {
      background: url(../static/pageBox/left.png) no-repeat;
      background-size: 33% 100%;
      width: 10vw;
      height: 30vw;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
    .right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      height: 15vw;
      justify-content: space-around;
      .xian {
        border-top: solid 1px #fff;
        display: block;
        height: 1px;
        width: 10vw;
      }
    }
    .center {
      padding: 0;
      height: 30vw;
      overflow: hidden;
      li {
        height: 30vw;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        p {
          font-size: 7vw;
          margin: 0;
        }
      }
    }
  }
  .choseConfirm {
    background: url(../static/pageBox/choseButton.png) no-repeat;
    background-size: 100% 100%;
    width: 36vw;
    height: 8vw;
  }
  p {
    margin: 0;
    margin-bottom: 1vh;
    letter-spacing: 1vw;
    font-size: 4vw;
  }
  li {
    list-style: none;
    margin: 0;
  }
}
.blur {
  filter: blur(2px);
}
.tipText {
  color: #fff;
  font-size: 4.5vw;
  position: absolute;
  width: 50vw;
  left: 25vw;
  top: 25vh;
  p {
    margin: 1vh 0;
  }
}
.photographWeb {
  @bg();
  background: url(../static/pageBox/bg3.png) no-repeat;
  background-size: cover;
  transition: all 1s;

  .randomMoon {
    width: 20vw;
    height: 20vw;
    background: url(../static/pageBox/moon.png) no-repeat;
    background-size: 100% 100%;
    position: absolute;
    top: 10vh;
  }
}
.bg2 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: url(../static/pageBox/bg2.png) no-repeat;
  background-size: cover;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  .mapBox {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
    .mapImg {
      width: 90vw;
      height: 100vw;
      background: url(../static/pageBox/map.png) no-repeat;
      background-size: 100% 100%;
      transition: all 2s;
    }
    .light {
      filter: drop-shadow(0 0 2px #000) drop-shadow(0 0 15px rgb(238, 230, 238))
        drop-shadow(0 0 5px rgb(238, 238, 238));
    }
    .mapText {
      width: 90vw;
      height: 20vw;
      background: url(../static/pageBox/mapText.png) no-repeat;
      background-size: 100% 100%;
    }
  }
  .arcWeb {
    .arcText {
      position: absolute;
      width: 50vw;
      left: 25vw;
      bottom: 10vw;
      font-size: 4.5vw;
    }
    p {
      margin: 1vw 0;
    }
  }
  .position {
    margin-top: 10vh;
    transition: opacity 3s;
    .positionPoint {
      background: url(../static/pageBox/position.png) no-repeat;
      background-size: 100% 100%;
      width: 10vh;
      height: 10vh;
      margin: 0 auto;
    }
  }
}

.teachImgBox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  pointer-events: none;

  .img {
    background: url(../static/pageBox/teachImg.png) no-repeat;
    background-size: cover;
    width: 90vw;
    height: 140vw;
    margin-bottom: 10vw;
    position: relative;
    div {
      color: #fff;
      position: absolute;
      width: 60vw;
      left: 3vw;
      font-size: 3.5vw;
      top: 28vw;
      p {
        margin: 0;
        margin-top: 1vw;
      }
    }
  }
}
#pageBox {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100%;
  overflow: hidden;
}
</style>

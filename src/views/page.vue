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
        <div class="position">
          <div></div>
          <p>您现在的位置: {{ userInfo.adress }}</p>
          <p>东经: {{ userInfo.lon }}</p>
          <p>北纬: {{ userInfo.lat }}</p>
          <icon name="huxian"></icon>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import homePage from "../components/homePage.vue";

const C3D = require("../common/css3d.js");
const Orienter = require("../common/orienter.js");
const JT = require("../common/jstween.js");

@Component({
  components: {
    homePage
  }
})
export default class page extends Vue {
  //是否显示首页
  isShowPage = true;
  requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame;
  //客户信息
  userInfo = {
    adress: "北京市",
    lon: "116.397128",
    lat: "39.916527"
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
  //测试开关
  ceshi = true;
  mounted() {
    const self = this;
    this.init();
    if (this.ceshi) {
      this.isShowPage = false;
      this.isShowBox = false;
      this.isShowBg = true;
      // this.actiondh();
    }
    // this.actiondh();
    // window.onresize = function() {
    // self.resize();
    // };
    // self.resize();
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
      i.on("touchend", function(e) {
        // TODO
        self.isShowBox = false;
        self.isShowBg = true;
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
      require("../static/pageBox/pageBox_02.jpg"),
      require("../static/pageBox/pageBox_03.jpg"),
      require("../static/pageBox/pageBox_04.jpg"),
      require("../static/pageBox/pageBox_05.jpg"),
      require("../static/pageBox/pageBox_06.jpg"),
      require("../static/pageBox/pageBox_07.jpg"),
      require("../static/pageBox/pageBox_08.jpg"),
      require("../static/pageBox/pageBox_09.jpg"),
      require("../static/pageBox/pageBox_10.jpg"),
      require("../static/pageBox/pageBox_11.jpg"),
      require("../static/pageBox/pageBox_12.jpg"),
      require("../static/pageBox/pageBox_13.jpg"),
      require("../static/pageBox/pageBox_14.jpg"),
      require("../static/pageBox/pageBox_15.jpg"),
      require("../static/pageBox/pageBox_16.jpg"),
      require("../static/pageBox/pageBox_17.jpg"),
      require("../static/pageBox/pageBox_18.jpg"),
      require("../static/pageBox/pageBox_19.jpg"),
      require("../static/pageBox/pageBox_20.jpg"),
      require("../static/pageBox/pageBox_01.jpg")
    ];
    const bg_num = bgImage.length;
    // 背景的宽高信息，也就是那张背景大图的宽高 bgInfo
    this.bgInfo = {
      //图片宽高
      o: { w: 4000, h: 3000 },
      //被均分的图片宽度
      M: 4000 / bg_num,
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
    for (var R = 0; R < bg_num; R++) {
      var F = new C3D.Plane(),
        H = (-360 / bg_num) * R,
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
      if (t.lon < 135 || t.lon > 200) {
        self.aim.lon = -t.lon;
      }

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
    var originTouchPos = {
        x: 0,
        y: 0
      },
      oldTouchPos = {
        x: 0,
        y: 0
      },
      newTouchPos = {
        x: 0,
        y: 0
      },
      firstDir = "",
      originTime = 0,
      oldTime = 0,
      newTime = 0,
      dx = 0,
      dy = 0,
      ax = 0,
      ay = 0,
      time = 0;

    // touchstart事件处理函数
    var onTouchStart = function(t: any) {
      (firstDir = ""), (t = t.changedTouches[0]);
      originTouchPos.x = oldTouchPos.x = newTouchPos.x = t.clientX;
      originTouchPos.y = oldTouchPos.y = newTouchPos.y = t.clientY;
      originTime = oldTime = newTime = Date.now();
      (dx = dy = ax = ay = 0),
        self.stage.on("touchmove", onTouchMove),
        self.stage.on("touchend", onTouchEnd);
    };
    self.stage.on("touchstart", onTouchStart);
    var onTouchMove = function(t: any) {
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
    var onTouchEnd = function(e: any) {
      newTime = Date.now();
      var t = (newTime - oldTime) / 1e3;

      // 这里可以通过e.target获取到触发了此touchend事件的dom对象，
      // 这样就可以根据此对象来判断是点击了哪个场景的元素。当然，可以直接为元素绑定点击事件，在此处绑定
      // TODO

      self.stage.off("touchmove", onTouchMove),
        self.stage.off("touchend", onTouchEnd);
    };

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
    var n = t - this.panoBgBox.rotationY,
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
    var o = t - this.panoItems.rotationY,
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
            console.log(actor);
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
  pano(e: any) {
    const self = this;
    var starSky = new C3D.Sprite();
    starSky
      .name("starSky")
      .position(0, 0, 0)
      .rotation(0, 0, 0)
      .update();
    var _starMax = 100;
    for (var i = 0; i < _starMax; i++) {
      var _lon = this.modelRandom(0, 360);
      var _lat = this.modelRandom(-80, 80);
      var _l = this.modelRandom(1000, 3000);
      var _alon = (_lon / 180) * Math.PI;
      var _alat = (_lat / 180) * Math.PI;
      var _x = Math.cos(_alat) * _l * Math.sin(_alon);
      var _y = Math.sin(_alat) * _l;
      var _z = -Math.cos(_alat) * _l * Math.cos(_alon);

      var _p = new C3D.Plane();
      _p.size(34, 34)
        .sort("Y", "X", "Z")
        .position(_x, _y, _z)
        .rotation(_lat, -_lon, 0)
        .material({
          image: require("../static/demo/star.png"),
          bothsides: false
        })
        .update();

      // var _p = C3D.create({
      //     type: 'sprite', position: [_x, _y, _z], rotation: [0, -_lon, 0], children: [
      //         {
      //             type: 'plane', rotation: [_lat, 0, 0], size: [34, 34], material: [{
      //             image: './images/star.png',
      //             bothsides: false,
      //         }]
      //         }
      //     ]
      // });
      starSky.addChild(_p);
    }
    e.addChild(starSky);

    setInterval(function() {
      var _star = starSky.children[Math.floor(Math.random() * _starMax)];
      JT.kill(_star);
      JT.fromTo(
        _star,
        0.5,
        { alpha: 1 },
        {
          alpha: 0,
          yoyo: true,
          repeat: 1,
          onUpdate: function() {
            this.target.updateV();
          }
        }
      );
    }, 1000 / 20);

    var actorData = [
      {
        name: "p1",
        lon: 180,
        lat: -35,
        actor: {
          w: 161,
          h: 166,
          x: 0,
          y: 0,
          url: require("../static/demo/p1.png")
        },
        info: {
          w: 161,
          h: 121,
          x: -120,
          y: 60,
          url: require("../static/demo/p1t.png")
        }
      },
      {
        name: "p2",
        lon: 220,
        lat: 30,
        actor: {
          w: 179,
          h: 171,
          x: 0,
          y: 0,
          url: require("../static/demo/p2.png")
        },
        info: {
          w: 161,
          h: 122,
          x: -120,
          y: 60,
          url: require("../static/demo/p2t.png")
        }
      },
      {
        name: "p3",
        lon: 40,
        lat: 20,
        actor: {
          w: 166,
          h: 158,
          x: 0,
          y: 0,
          url: require("../static/demo/p3.png")
        },
        info: {
          w: 244,
          h: 186,
          x: 100,
          y: 50,
          url: require("../static/demo/p3t.png")
        }
      },
      {
        name: "p4",
        lon: 140,
        lat: 10,
        actor: {
          w: 154,
          h: 163,
          x: 0,
          y: 0,
          url: require("../static/demo/p4.png")
        },
        info: {
          w: 201,
          h: 147,
          x: -70,
          y: 80,
          url: require("../static/demo/p4t.png")
        }
      },
      {
        name: "p5",
        lon: 80,
        lat: -25,
        actor: {
          w: 152,
          h: 154,
          x: 0,
          y: 0,
          url: require("../static/demo/p5.png")
        },
        info: {
          w: 196,
          h: 164,
          x: 130,
          y: 50,
          url: require("../static/demo/p5t.png")
        }
      },
      {
        name: "p6",
        lon: 260,
        lat: -30,
        actor: {
          w: 156,
          h: 171,
          x: 0,
          y: 0,
          url: require("../static/demo/p6.png")
        },
        info: {
          w: 166,
          h: 142,
          x: -70,
          y: 80,
          url: require("../static/demo/p6t.png")
        }
      },
      {
        name: "p7",
        lon: 300,
        lat: 20,
        actor: {
          w: 244,
          h: 161,
          x: 0,
          y: 0,
          url: require("../static/demo/p7.png")
        },
        info: {
          w: 202,
          h: 126,
          x: 120,
          y: 80,
          url: require("../static/demo/p7t.png")
        }
      }
    ];
    var actors = new C3D.Sprite();
    actors
      .name("actors")
      .position(0, 0, 0)
      .update();
    var _len = actorData.length;
    actorData.forEach(function(obj, i) {
      var _data = obj;
      var _lon = _data.lon;
      var _lat = _data.lat;
      var _l = 800;
      var _alon = (_lon / 180) * Math.PI;
      var _alat = (_lat / 180) * Math.PI;
      var _x = Math.cos(_alat) * _l * Math.sin(_alon);
      var _y = Math.sin(_alat) * _l;
      var _z = -Math.cos(_alat) * _l * Math.cos(_alon);
      var _item = C3D.create({
        type: "sprite",
        name: _data.name,
        position: [_x, _y, _z],
        rotation: [0, -_lon, 0],
        scale: [2],
        children: [
          {
            type: "plane",
            name: "actor",
            position: [_data.actor.x, _data.actor.y, 0],
            size: [_data.actor.w, _data.actor.h],
            material: [{ image: _data.actor.url, bothsides: false }]
          },
          {
            type: "plane",
            name: "info",
            // position: [_data.info.x, _data.info.y, 10],
            scale: [0, 0, 1],
            size: [_data.info.w, _data.info.h],
            visibility: [{ alpha: 0 }],
            material: [{ image: _data.info.url, bothsides: false }]
          }
        ]
      });

      JT.to(_item, 3, {
        y: "+=50",
        ease: JT.Quad.InOut,
        repeat: -1,
        yoyo: true,
        delay: Math.random() * 3,
        onUpdate: function() {
          this.target.updateT();
        }
      });

      _item.r0 = _lon;
      _item.data = _data;

      actors.addChild(_item);
    });
    this.stage.addChild(actors);

    var otherData = [
      { w: 136, h: 136, url: "other1.png" },
      { w: 95, h: 104, url: "other2.png" },
      { w: 111, h: 108, url: "other3.png" },
      { w: 103, h: 79, url: "other4.png" },
      { w: 80, h: 75, url: "other5.png" }
    ];
    var others = new C3D.Sprite();
    others
      .name("others")
      .position(0, 0, 0)
      .update();
    var _len = otherData.length;
    for (var i = 0, _max = 5; i < _max; i++) {
      var _id = i % _len;
      var _data = otherData[_id];
      var _lon = this.modelRandom(0, 360);
      var _lat = this.modelRandom(30, -30);
      var _l = 1600;
      var _alon = (_lon / 180) * Math.PI;
      var _alat = (_lat / 180) * Math.PI;
      var _x = Math.cos(_alat) * _l * Math.sin(_alon);
      var _y = Math.sin(_alat) * _l;
      var _z = -Math.cos(_alat) * _l * Math.cos(_alon);
      var _item = C3D.create({
        type: "plane",
        size: [_data.w, _data.h],
        position: [_x, _y, _z],
        rotation: [0, -_lon, 0],
        scale: [2],
        material: [{ image: "./images/" + _data.url, bothsides: false }]
      });

      others.addChild(_item);
    }
    this.stage.addChild(others);

    var home = C3D.create({
      type: "plane",
      size: [360, 1060],
      position: [0, 0, -800],
      scale: [2],
      material: [{ image: "./images/home.png", bothsides: false }]
    });
    this.stage.addChild(home);

    var curve = C3D.create({
      type: "plane",
      size: [2551, 304],
      position: [0, -600, -800],
      scale: [2],
      material: [{ image: "./images/curve.png", bothsides: false }]
    });
    this.stage.addChild(curve);
  }

  // 动画显示
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
      i.on("touchend", function(e) {
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
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

  .position {
    margin-top: 10vh;
    div {
      background: url(../static/pageBox/position.png) no-repeat;
      background-size: 100% 100%;
      width: 20vw;
      height: 20vw;
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

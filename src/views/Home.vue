<template>
  <div id="home">
    <!-- 首页 -->
    <transition name="fade">
      <home-page
        @startGame="startGame"
        v-show="isShowPage"
        :spriteLoadImg="spriteLoad"
      ></home-page>
    </transition>
    <div class="centerClick"><div></div></div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */

import { Component, Vue } from "vue-property-decorator";
import * as THREE from "three";
const orienter = require("../common/orienter.js");
import homePage from "../components/homePage.vue";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DeviceOrientationControls } from "three/examples/jsm/controls/DeviceOrientationControls";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise.js";

@Component({
  components: {
    homePage
  }
})
export default class Home extends Vue {
  //场景
  scene: THREE.Scene | null = null;
  //相机
  camera: THREE.PerspectiveCamera | null = null;
  //矩形模型
  mesh: THREE.Mesh | null = null;
  //渲染对象
  renderer: THREE.WebGLRenderer | null = null;
  controls: OrbitControls | null = null;
  //是否开始陀螺仪
  isStart = false;
  //计算出的陀螺仪移动距离
  lons = 0;
  lat = 0;
  //three的时间对象
  clock: THREE.Clock | null = null;
  //相机当前朝向坐标
  lookat!: THREE.Vector3;
  //点对象用作相机中心
  points: any = null;
  //是否显示首页
  isShowPage = false;
  //点对象动画
  mixer: THREE.AnimationMixer | null = null;
  //开启教学动画
  isTeachAnimation = false;
  //教学的精灵图
  spriteGroup: THREE.Group | null = null;
  //教学的文本精灵图
  spriteTextGroup: THREE.Group | null = null;
  circle: any = null;
  //当前时间
  nowDate = Number(new Date());
  //拾取器间隔时间
  getElasedTime = 0;
  //精灵图加载进度
  spriteLoadImg = [false, false, false, false, false];
  //光线投射
  raycaster: THREE.Raycaster | null = null;
  //模拟的鼠标点，默认为中心0.5，0.5
  mouse: THREE.Vector2 | null = null;
  deviceControl: any;
  //精灵图加载
  get spriteLoad(): boolean {
    const index = this.spriteLoadImg.indexOf(false);
    if (index > -1) {
      return false;
    } else {
      return true;
    }
  }
  mounted(): void {
    const self = this;
    this.imgDpr();
    this.init();
    // this.onOrient();
    this.pickupObjects();
  }
  //截取图片
  fn() {
    if (this.renderer !== null && this.scene !== null && this.camera !== null) {
      var image = new Image();
      this.renderer.render(this.scene, this.camera);

      let imgData = this.renderer.domElement.toDataURL("image/jpeg"); //这里可以选择png格式jpeg格式
      image.src = imgData;
      // document.body.appendChild(image);
      console.log(imgData);
    }
  }
  //设定清晰度
  imgDpr() {
    const navigatorUserAgent = navigator.userAgent;
    const iPhone = navigatorUserAgent.indexOf("iPhone");
    let dpr, one_dpr;
    if (iPhone > -1) {
      dpr = Number(window.devicePixelRatio);
      one_dpr = 1 / dpr;
    } else {
      dpr = 1;
      one_dpr = 1;
    }
    const writeText =
      '<meta name="viewport" content="width=device-width,initial-scale=' +
      one_dpr +
      ",maximum-scale=" +
      one_dpr +
      ",minimum-scale=" +
      one_dpr +
      ',user-scalable=no">\n        <meta name="\'flexible" content="initial-dpr=' +
      dpr +
      '">';
    document.write(writeText);
    var html = document.getElementsByTagName("html");
    var F0 = 75;
    html[0].setAttribute("data-dpr", "" + dpr);
  }
  //开始游戏
  startGame() {
    console.log(this.spriteLoad);
    if (!this.spriteLoad) return;
    const self = this;
    this.isShowPage = false;
    this.isTeachAnimation = true;
  }
  //重力感应计算
  onOrient() {
    const self = this;
    let newLongitude = 0,
      lastLongitude = 0,
      moveLongitude = 0, //改变的经度的计算
      newLatitude = 0,
      lastLatitude = 0,
      moveLatitude = 0; //改变的纬度的计算
    const o = new orienter();
    // eslint-disable-next-line
    o.onOrient = function(obj: any) {
      //重力感应计算角度
      if (self.isStart) {
        //最新经度
        newLongitude = obj.lon;
        moveLongitude = newLongitude - lastLongitude;

        //最新纬度
        newLatitude = obj.lat;
        moveLatitude = newLatitude - lastLatitude;

        //判断经纬度
        if (moveLongitude >= 300) {
          moveLongitude = moveLongitude - 361;
        } else if (moveLongitude <= -300) {
          moveLongitude = moveLongitude + 359;
        }

        if (moveLatitude >= 300) {
          moveLatitude = moveLatitude - 361;
        } else if (moveLatitude <= -300) {
          moveLatitude = moveLatitude + 359;
        }
        moveLongitude = moveLongitude * 0.6;
        moveLatitude = moveLatitude * 0.6;
        //计算得出重力感应的经纬度
        self.lons = self.lons - moveLongitude;
        lastLongitude = obj.lon;
        self.lat = self.lat - moveLatitude;
        lastLatitude = obj.lat;
      }
    };
    o.on();
  }
  //初始化
  init() {
    const home = document.getElementById("home");
    //初始化一些后面需要的构造器
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(0, 0);
    const group = new THREE.Group();
    // 创建场景对象scene
    this.scene = new THREE.Scene();
    this.scene.updateMatrixWorld(true);
    this.scene.background = new THREE.Color(0xbfd1e5);
    //模型
    this.sphereGeometry(this.scene);
    // this.point(this.scene);
    const moon = this.moon(this.scene);
    this.tu(this.scene);
    //教学图片和文字
    this.teachImg();
    this.teachText();
    //创建一个点,相机对准点的方向
    const points = this.point(this.scene);
    /**透视投影相机*/
    const width = window.innerWidth; //窗口宽度
    const height = window.innerHeight; //窗口高度
    this.camera = new THREE.PerspectiveCamera(72, width / height, 0.001, 1000);
    this.camera.position.set(0, 0.5, 0); //设置相机位置
    // this.camera.position.set(2, 2, 2); //设置相机位置
    this.lookat = new THREE.Vector3(0.2, 0.7, -0.2);

    this.camera.lookAt(this.lookat);
    this.deviceControl = new DeviceOrientationControls(this.camera);
    //照相机辅助线
    // const cameraPerspectiveHelper = new THREE.CameraHelper(this.camera);
    // this.scene.add(cameraPerspectiveHelper);
    // 旋转预设 摄影机看到的角度 Start//
    // this.scene.rotation.set(0, 0, 0); //首頁
    //坐标系
    const axesHelper = new THREE.AxesHelper(2500);
    this.scene.add(axesHelper);
    let point = new THREE.PointLight(0xffffff);
    point.position.set(0, 100, 0); //点光源位置
    this.scene.add(point); //点光源添加到场景中
    //环境光    环境光颜色与网格模型的颜色进行RGB进行乘法运算
    const ambient = new THREE.AmbientLight(0xffffff);
    this.scene.add(ambient);
    //初始化渲染器，追加到容器
    this.renderer = new THREE.WebGLRenderer({
      precision: "highp",
      antialias: false
    }); //加上precision 和 mipmap参数，调整画面清晰度
    this.renderer.setPixelRatio(window.devicePixelRatio); //设置像素比
    this.renderer.setSize(width, height); //设置渲染窗口的大小
    if (home === null) return;
    home.appendChild(this.renderer.domElement); //追加到容器中去
    //执行渲染操作   指定场景、相机作为参数
    this.renders();
    if (!this.isStart) {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    }
  }
  //相机中心点
  point(e: THREE.Scene) {
    const geometry = new THREE.SphereGeometry(0.05, 30, 30); //创建一个Buffer类型几何体对象
    // 点渲染模式
    // const material = new THREE.PointsMaterial({
    //   color: 0xfe1633,
    //   size: 100.0 //点对象像素尺寸
    // }); //材质对象
    const material = new THREE.MeshBasicMaterial({
      color: 0x0000ff
    });
    this.points = new THREE.Mesh(geometry, material); //点模型对象
    // this.points.position.set(-2, 2, 3);
    this.points.name = "point";
    e.add(this.points);
    this.points.position.set(-0.5, 2, 2);
    return this.points;
  }
  //点元素动画
  pointAnimation() {
    console.log(123);
    /**
     * 编辑group子对象网格模型mesh1和mesh2的帧动画数据
     */
    // 创建名为Box对象的关键帧数据
    var times = [0, 5, 10, 15, 20]; //关键帧时间数组，离散的时间点序列
    var values = [-0.5, 2, 2, -0.5, 1, 2, -0.5, 1, 2, 0.5, 1, 2, -1, 1, 2]; //与时间点对应的值组成的数组
    // 创建位置关键帧对象：0时刻对应位置0, 0, 0   10时刻对应位置150, 0, 0
    var posTrack = new THREE.KeyframeTrack("point.position", times, values);
    // 创建颜色关键帧对象：10时刻对应颜色1, 0, 0   20时刻对应颜色0, 0, 1
    // var colorKF = new THREE.KeyframeTrack('Box.material.color', [10, 20], [1, 0, 0, 0, 0, 1]);
    // 创建名为Sphere对象的关键帧数据  从0~20时间段，尺寸scale缩放3倍
    // var scaleTrack = new THREE.KeyframeTrack('Sphere.scale', [0, 20], [1, 1, 1, 3, 3, 3]);

    // duration决定了默认的播放时间，一般取所有帧动画的最大时间
    // duration偏小，帧动画数据无法播放完，偏大，播放完帧动画会继续空播放
    var duration = 20;
    // 多个帧动画作为元素创建一个剪辑clip对象，命名"default"，持续时间20
    var clip = new THREE.AnimationClip("default", duration, [posTrack]);
    /**
     * 播放编辑好的关键帧数据
     */
    // group作为混合器的参数，可以播放group中所有子对象的帧动画
    this.mixer = new THREE.AnimationMixer(this.points);
    // 剪辑clip作为参数，通过混合器clipAction方法返回一个操作对象AnimationAction
    var AnimationAction = this.mixer.clipAction(clip);
    //通过操作Action设置播放方式
    AnimationAction.timeScale = 100; //默认1，可以调节播放速度
    AnimationAction.loop = THREE.LoopOnce; //不循环播放
    AnimationAction.play(); //开始播放
  }

  //月亮
  moon(e: THREE.Scene) {
    const textureLoader = new THREE.TextureLoader();
    // 加载月亮纹理贴图
    const texture = textureLoader.load(require("../static/moon_2k.jpg"));
    const textureNormal = textureLoader.load(
      require("../static/moon_2k_normal.jpg")
    );
    var geometry = new THREE.SphereGeometry(0.05, 40, 40);
    var material = new THREE.MeshPhongMaterial({
      map: texture,
      normalMap: textureNormal, //法线贴图
      //设置深浅程度，默认值(1,1)。
      normalScale: new THREE.Vector2(2, 2)
      // side: THREE.DoubleSide
    });
    // 加载法线贴图

    this.circle = new THREE.Mesh(geometry, material);
    this.circle.name = "Moon";
    e.add(this.circle);
    this.circle.position.set(0.5, 0.5, 0.5);
    return this.circle;

    // circle.rotateY(Math.PI / 1.5);
    // circle.rotateY(-Math.PI / 3);
  }

  //土地
  tu(e: THREE.Scene) {
    const self = this;
    const worldWidth = 256,
      worldDepth = 256;
    var geometry = new THREE.PlaneBufferGeometry(
      2,
      2,
      worldWidth - 1,
      worldDepth - 1
    );

    geometry.rotateX(-Math.PI / 2);
    var vertices = geometry.attributes.position.array;
    var data = this.generateHeight(worldWidth, worldDepth);

    // for (var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
    //   vertices[j + 1] = data[i] * 0.00000001;
    // }
    const texture = new THREE.CanvasTexture(
      self.generateTexture(data, worldWidth, worldDepth) as HTMLCanvasElement
    );
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({ map: texture })
    );
    mesh.name = "大地";
    e.add(mesh);
  }
  generateTexture(data?: any, width?: any, height?: any) {
    var canvas, canvasScaled, context, image, imageData, vector3, sun, shade;

    vector3 = new THREE.Vector3(0, 0, 0);

    sun = new THREE.Vector3(1, 1, 1);
    sun.normalize();

    var canvas: any = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const contexts = canvas.getContext("2d");
    if (contexts === null) return;

    contexts.fillStyle = "#000";
    contexts.fillRect(0, 0, width, height);

    image = contexts.getImageData(0, 0, canvas.width, canvas.height);
    imageData = image.data;

    for (var i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {
      vector3.x = data[j - 2] - data[j + 2];
      vector3.y = 2;
      vector3.z = data[j - width * 2] - data[j + width * 2];
      vector3.normalize();

      shade = vector3.dot(sun);

      imageData[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007);
      imageData[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007);
      imageData[i + 2] = shade * 96 * (0.5 + data[j] * 0.007);
    }

    contexts.putImageData(image, 0, 0);

    // Scaled 4x

    canvasScaled = document.createElement("canvas");
    canvasScaled.width = width * 4;
    canvasScaled.height = height * 4;

    context = canvasScaled.getContext("2d");
    if (context === null) return;
    context.scale(4, 4);
    context.drawImage(canvas, 0, 0);

    image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
    imageData = image.data;

    for (var i = 0, l = imageData.length; i < l; i += 4) {
      var v = ~~(Math.random() * 5);

      imageData[i] += v;
      imageData[i + 1] += v;
      imageData[i + 2] += v;
    }

    context.putImageData(image, 0, 0);
    console.log(canvasScaled);
    return canvasScaled;
  }
  generateHeight(width: number, height: number) {
    var size = width * height,
      data = new Uint8Array(size),
      perlin = new ImprovedNoise(),
      quality = 1,
      z = 1;

    for (var j = 0; j < 4; j++) {
      for (var i = 0; i < size; i++) {
        var x = i % width,
          y = ~~(i / width);
        data[i] += Math.abs(
          perlin.noise(x / quality, y / quality, z) * quality * 1.75
        );
      }

      quality *= 5;
    }

    return data;
  }
  //大地
  land(e: THREE.Scene) {
    /**
     * 创建一个地面
     */
    const worldWidth = 25,
      worldDepth = 25;
    const geometry = new THREE.PlaneBufferGeometry(2, 2); //矩形平面
    var vertices = geometry.attributes.position.array;
    var data = this.generateHeight(worldWidth, worldDepth);

    // for (var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
    //   vertices[j + 1] = data[i] * 10;
    // }
    // 加载纹理贴图
    const textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load(require("../static/dusk.jpg"));
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    const textureNormal = textureLoader.load(
      require("../static/dusk_normal.jpg")
    );
    // 加载高光贴图
    const textureSpecular = textureLoader.load(
      require("../static/dusk_light.jpg")
    );
    // 设置阵列
    // uv两个方向纹理重复数量
    const material = new THREE.MeshPhongMaterial({
      shininess: 30, //高光部分的亮度，默认30
      specularMap: textureSpecular, //高光贴图
      map: texture
      // normalMap: textureNormal, //法线贴图
      //设置深浅程度，默认值(1,1)。
      // normalScale: new THREE.Vector2(1, 100)
    });
    const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
    e.add(mesh); //网格模型添加到场景中
    mesh.rotateX(-Math.PI / 2);
  }
  //天空模型
  sphereGeometry(e: THREE.Scene) {
    const geometry = new THREE.SphereGeometry(1, 32, 16); //球体
    geometry.scale(1, 1, -1);
    //设置球体的背景贴图
    const textureBg = new THREE.TextureLoader().load(
      require("../static/pageBox.jpg")
    );
    textureBg.generateMipmaps = true;
    textureBg.magFilter = THREE.LinearFilter; //设置贴纸素材的质量
    textureBg.minFilter = THREE.LinearFilter;
    const material = new THREE.MeshBasicMaterial({
      map: textureBg, //圆柱体贴图，全景图
      side: THREE.DoubleSide //两面可见
      //color:0xFF0000,
      //transparent: true
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.name = "天空";
    e.add(sphere);
  }
  //对象拾取
  pickupObjects() {
    setTimeout(() => {
      if (
        this.camera === null ||
        this.scene === null ||
        this.raycaster === null ||
        this.mouse === null
      )
        return;
      //将鼠标点击位置的屏幕坐标转成threejs中的标准坐标
      this.raycaster.setFromCamera(this.mouse, this.camera);
      let intersects = this.raycaster.intersectObject(this.circle);
      if (intersects.length > 0) {
        this.isStart = false;
        this.camera.lookAt(this.circle.position);
        // intersects[0].object.scale.set(5, 5, 5);
        return;
      }
      this.pickupObjects();
    }, 1000);
  }
  //渲染页面
  renders() {
    if (this.renderer === null || this.scene === null || this.camera === null) {
      return;
    }
    // let time = Number(new Date());
    // this.nowDate = time;
    requestAnimationFrame(this.renders);
    //是否有首页
    if (this.isShowPage) {
      return;
    }
    // 是否已经创建过时钟对象
    if (this.clock === null) {
      // 创建一个时钟对象clock
      this.clock = new THREE.Clock();
      this.clock.start();
    }
    const t = this.clock.getDelta();

    // console.log(this.camera);
    //更新鼠标移动//测试专用
    if (this.controls) {
      this.controls.update();
    }
    //陀螺仪开关
    if (this.isStart) {
      this.deviceControl.update();
    }
    //教程动画开关
    if (this.isTeachAnimation && this.spriteGroup !== null) {
      this.teachAnimation(t);
      // this.camera.lookAt(this.spriteGroup.position);
    }

    this.renderer.render(this.scene, this.camera);
    this.renderer.shadowMap.enabled = true;
    // this.camera.lookAt(this.lookat);
    this.camera.updateProjectionMatrix();
  }
  //教学动画精灵图
  teachImg() {
    const self = this;
    const textureLoader = new THREE.TextureLoader();
    const phone = textureLoader.load(
      require("../static/teachImg/phone.png"),
      () => {
        Vue.set(self.spriteLoadImg, 2, true);
        console.log(self.spriteLoadImg);
      }
    );
    const hand = textureLoader.load(
      require("../static/teachImg/hand.png"),
      () => {
        Vue.set(self.spriteLoadImg, 3, true);
      }
    );
    const center = textureLoader.load(
      require("../static/teachImg/center.png"),
      () => {
        Vue.set(self.spriteLoadImg, 4, true);
      }
    );
    const phoneMaterial = new THREE.SpriteMaterial({
      map: phone,
      transparent: true
    });
    const handMaterial = new THREE.SpriteMaterial({
      map: hand,
      transparent: true
    });
    const centerMaterial = new THREE.SpriteMaterial({
      map: center,
      transparent: true
    });
    setTimeout(() => {
      if (
        phoneMaterial.map === null ||
        handMaterial.map === null ||
        centerMaterial.map === null ||
        self.scene === null
      )
        return;
      self.spriteGroup = new THREE.Group();
      const width = phoneMaterial.map.image.width;
      const height = phoneMaterial.map.image.height;
      const width1 = handMaterial.map.image.width;
      const height1 = handMaterial.map.image.height;
      const width2 = centerMaterial.map.image.width;
      const height2 = centerMaterial.map.image.height;
      const spritePhone = new THREE.Sprite(phoneMaterial);
      const spriteHand = new THREE.Sprite(handMaterial);
      const spriteCenter = new THREE.Sprite(centerMaterial);
      spritePhone.center.set(0.5, 0.47);
      spritePhone.scale.set(width / 5000, height / 5000, 1);
      spriteHand.center.set(0.54, 1);
      spriteHand.scale.set(width1 / 5000, height1 / 5000, 1);
      spriteCenter.center.set(0.5, 0.5);
      spriteCenter.scale.set(width2 / 5000, height2 / 5000, 1);
      self.spriteGroup.add(spriteCenter);
      self.spriteGroup.add(spritePhone);
      self.spriteGroup.add(spriteHand);
      self.spriteGroup.position.set(0, 0.5, 0.1);
      self.scene.add(self.spriteGroup);
      // for (let i of self.spriteGroup.children) {
      //   i.visible = false;
      // }
      // self.spriteGroup.children[0].visible = false;
    }, 3000);
  }
  //教学动画提示文字精灵图
  teachText() {
    const self = this;
    const textureLoader = new THREE.TextureLoader();
    const text1 = textureLoader.load(
      require("../static/teachImg/text1.png"),
      () => {
        Vue.set(self.spriteLoadImg, 0, true);
      }
    );
    const text2 = textureLoader.load(
      require("../static/teachImg/text2.png"),
      () => {
        Vue.set(self.spriteLoadImg, 1, true);
      }
    );
    const textMaterial1 = new THREE.SpriteMaterial({
      map: text1,
      transparent: true
    });
    const textMaterial2 = new THREE.SpriteMaterial({
      map: text2,
      transparent: true
    });
    setTimeout(() => {
      if (
        textMaterial1.map === null ||
        textMaterial2.map === null ||
        self.scene === null
      )
        return;
      self.spriteTextGroup = new THREE.Group();
      const width = textMaterial1.map.image.width;
      const height = textMaterial1.map.image.height;
      const width1 = textMaterial2.map.image.width;
      const height1 = textMaterial2.map.image.height;
      const spriteText1 = new THREE.Sprite(textMaterial1);
      const spriteText2 = new THREE.Sprite(textMaterial2);
      spriteText1.center.set(0.5, 0.5);
      spriteText1.scale.set(width / 4000, height / 4000, 1);
      spriteText1.material.opacity = 0;
      spriteText1.name = "text1";
      spriteText2.center.set(0.5, 0.1);
      spriteText2.scale.set(width1 / 4000, height1 / 4000, 1);
      spriteText2.material.opacity = 0;
      spriteText2.name = "text2";
      self.spriteTextGroup.add(spriteText1);
      self.spriteTextGroup.add(spriteText2);
      self.spriteTextGroup.position.set(0, 0.52, -0.2);
      self.scene.add(self.spriteTextGroup);
    }, 3000);
  }
  //教学动画
  teachAnimation(t: number) {
    if (
      this.camera === null ||
      this.clock === null ||
      this.spriteGroup === null ||
      this.spriteTextGroup === null
    )
      return;
    const time = this.clock.getElapsedTime();
    const position = this.lookat;
    //左右摇摆间隔时间
    if (time > 2 && time < 4.5) {
      //斜向移动到地面
      position.x -= (t * 0.13) / 2.5;
      position.y -= (t * 0.13) / 2.5;
      position.z += (t * 0.066) / 2.5;
      this.camera.lookAt(position);
    } else if (time > 4.5 && time < 7.5) {
      //继续缓慢斜向移动到地面
      position.x -= (t * 0.07) / 3;
      position.y -= (t * 0.07) / 3;
      position.z += (t * 0.034) / 3;
      this.camera.lookAt(position);
    } else if (time > 7.5 && time < 10) {
      //教程图出现
      this.spriteGroup.position.z -= (t * 0.3) / 2.5; //0,0.5,-0.2
      (this.spriteTextGroup.children[0] as any).material.opacity +=
        (t * 1) / 2.5;
      // this.spriteTextGroup.traverse(obj => {
      //   if (obj.name === "text1") {
      //     (obj as any).material.opacity += (t * 1) / 2.5;
      //   }
      // });
      this.camera.lookAt(position);
    } else if (time > 10 && time < 11.5) {
      // 教程图向上并跟随教程图
      this.spriteGroup.position.y += (t * 0.2) / 1.5;
      this.spriteGroup.position.z -= (t * 0.05) / 1.5;
      (this.spriteTextGroup.children[0] as any).material.opacity -=
        (t * 1) / 1.5;
      this.camera.lookAt(this.spriteGroup.position);
      // position.y += (t * 0.2) / 1.5;
      // position.z -= (t * 0.05) / 1.5;
    } else if (time > 11.5 && time < 13) {
      // 教程图向右并倾斜
      //移动到0.2，0.7，-0.25
      this.spriteGroup.position.x += (t * 0.2) / 1.5;
      // for (let i of this.spriteGroup.children) {
      //   i.rotation.x += (t * Math.PI) / 1.5;
      //   i.rotation.y += (t * Math.PI) / 1.5;
      //   i.rotation.z += (t * Math.PI) / 1.5;
      // }
      // this.spriteGroup.rotation.z += (t * Math.PI) / 5 / 1.5;
      this.camera.lookAt(this.spriteGroup.position);
      // position.x += (t * 0.2) / 1.5;
    } else if (time > 13 && time < 14.5) {
      // 教程图向左并倾斜
      //移动到-0.2，0.7，-0.25
      this.spriteGroup.position.x -= (t * 0.4) / 1.5;
      // for (let i of this.spriteGroup.children) {
      //   i.rotation.y -= (t * Math.PI) / 2.5 / 1.5;
      // }
      // this.mesh.rotation -= (t * Math.PI) / 2.5 / 1.5;
      this.camera.lookAt(this.spriteGroup.position);
      // position.x -= (t * 0.4) / 1.5;
    } else if (time > 14.5 && time < 16) {
      //收回教程图到0.0.5，-0.2
      this.spriteGroup.position.x += (t * 0.2) / 1.5;
      this.spriteGroup.position.y -= (t * 0.2) / 1.5;
      this.spriteGroup.position.z += (t * 0.1) / 1.5;
      this.camera.lookAt(this.spriteGroup.position);
    } else if (time > 16 && time < 17) {
      for (let i in this.spriteGroup.children) {
        (this.spriteGroup.children[i] as any).material.opacity -= (t * 1) / 1;
      }
    } else if (time > 17) {
      this.isStart = true;
      this.isTeachAnimation = false;
      this.clock.stop();
    }
    // this.get2D(JSON.parse(JSON.stringify(position)));
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
  .centerClick {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    div {
      background: url(../static/teachImg/center.png) no-repeat;
      width: 15vw;
      height: 15vw;
      background-size: 100% 100%;
    }
  }
  .teachImg {
    box-sizing: border-box;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    div {
      width: 90vw;
      height: 90vh;
      background: url(../static/pageBox/teachImg.png) no-repeat;
      background-size: cover;
    }
  }
}
</style>

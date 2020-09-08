<template>
  <div id="home">
    <div class="homePage"></div>
    <!-- <button @click="fn">123</button> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as THREE from "three";
const orienter = require("../common/orienter.js");

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

@Component({})
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
  lons = 0;
  lat = 0;
  //当前时间
  // nowDate = Number(new Date());
  mounted(): void {
    this.init();
    this.onOrient();
  }
  fn() {
    this.isStart = !this.isStart;
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
      console.log(obj);
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
        console.log("lon" + self.lons);
        console.log("lat" + self.lat);
      }
    };
    o.on();
  }
  //初始化
  init() {
    const home = document.getElementById("home");
    // 创建场景对象scene
    this.scene = new THREE.Scene();
    this.scene.updateMatrixWorld(true);
    //模型
    this.sphereGeometry(this.scene);
    this.land(this.scene);
    /**透视投影相机*/
    const width = window.innerWidth; //窗口宽度
    const height = window.innerHeight; //窗口高度
    this.camera = new THREE.PerspectiveCamera(72, width / height, 0.01, 1100);
    this.camera.position.set(0, 0.1, 0); //设置相机位置
    // const lookat = new THREE.Vector3(100, 100, -100);
    this.camera.lookAt(new THREE.Vector3(100, 100, 100)); //设置相机方向(指向的场景对象)
    //照相机帮助线
    // 旋转预设 摄影机看到的角度 Start//
    // this.scene.rotation.set(0, 0, 0); //首頁
    //坐标系
    const axesHelper = new THREE.AxesHelper(2500);
    this.scene.add(axesHelper);
    let point = new THREE.PointLight(0xffffff);
    point.position.set(0.9, 0.9, 0.9); //点光源位置
    // 通过add方法插入场景中，不插入的话，渲染的时候不会获取光源的信息进行光照计算
    this.scene.add(point); //点光源添加到场景中
    //环境光    环境光颜色与网格模型的颜色进行RGB进行乘法运算
    const ambient = new THREE.AmbientLight(0x444444);
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
      const controls = new OrbitControls(this.camera, this.renderer.domElement);
    }
  }
  //大地
  land(e: THREE.Scene) {
    /**
     * 创建一个地面
     */
    const geometry = new THREE.PlaneGeometry(2, 2); //矩形平面
    // 加载树纹理贴图
    var texture = new THREE.TextureLoader().load(require("../static/dusk.jpg"));
    // 设置阵列
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    // uv两个方向纹理重复数量
    // texture.repeat.set(10, 10);
    var material = new THREE.MeshLambertMaterial({
      map: texture
    });
    var mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
    e.add(mesh); //网格模型添加到场景中
    mesh.rotateX(-Math.PI / 2);
  }
  //天空模型
  sphereGeometry(e: THREE.Scene) {
    const geometry = new THREE.SphereGeometry(1, 32, 16); //球体
    geometry.scale(1, 1, -1);
    //设置球体的背景贴图
    const textureBg = new THREE.TextureLoader().load(
      require("../static/bg3.jpg")
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
    e.add(sphere);
  }
  //动画旋转渲染e场景f相机
  renders() {
    if (this.renderer === null || this.scene === null || this.camera === null) {
      return;
    }
    // let time = Number(new Date());
    // this.nowDate = time;
    requestAnimationFrame(this.renders);
    // 相机随陀螺仪运动
    const phi = THREE.MathUtils.degToRad(90 - this.lat);
    const theta = THREE.MathUtils.degToRad(this.lons - 0);
    if (this.controls) {
      this.controls.update();
    }
    if (this.isStart) {
      const position = new THREE.Vector3(
        500 * Math.sin(phi) * Math.cos(theta),
        -500 * Math.cos(phi),
        500 * Math.sin(phi) * Math.sin(theta)
      );
      this.camera.lookAt(position);
    }
    this.renderer.render(this.scene, this.camera);
    this.renderer.shadowMap.enabled = true;
  }
}
</script>
<style lang="less">
#home {
  overflow: hidden;
}
.homePage {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 90;
  background: url(../static/homePageBg.png) no-repeat;
  background-size: cover;
}
</style>

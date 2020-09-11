<template>
  <div id="home">
    <!-- 首页 -->
    <transition name="fade">
      <home-page @startGame="startGame" v-show="isShowPage"></home-page>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as THREE from "three";
const orienter = require("../common/orienter.js");
import homePage from "../components/homePage.vue";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
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
  //是否显示首页
  isShowPage = false;
  //开启教学动画
  isTeachAnimation = false;
  //当前时间
  nowDate = Number(new Date());
  mounted(): void {
    const self = this;
    this.imgDpr();
    this.init();
    this.onOrient();
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
    this.isShowPage = false;
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
    this.scene.background = new THREE.Color(0xbfd1e5);
    //模型
    // this.sphereGeometry(this.scene);
    this.land(this.scene);
    // this.moon(this.scene);
    this.tu(this.scene);
    //创建一个点相机以点的方向摇摆
    this.point(this.scene);
    /**透视投影相机*/
    const width = window.innerWidth; //窗口宽度
    const height = window.innerHeight; //窗口高度
    this.camera = new THREE.PerspectiveCamera(72, width / height, 1, 20000);
    // this.camera.position.set(-0.2, 0.1, 0); //设置相机位置
    this.camera.position.set(1, 1, 1); //设置相机位置
    // this.camera.position.set(1000, 1000, 1000);
    this.lookat = new THREE.Vector3(6, 2, -2);
    this.camera.lookAt(this.lookat); //设置相机方向(指向的场景对象)
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
      const controls = new OrbitControls(this.camera, this.renderer.domElement);
    }
  }
  //相机中心点
  point(e: THREE.Scene) {
    const geometry = new THREE.BufferGeometry(); //创建一个Buffer类型几何体对象
    // 点渲染模式
    const material = new THREE.PointsMaterial({
      color: 0xff0000,
      size: 10.0 //点对象像素尺寸
    }); //材质对象
    const points = new THREE.Points(geometry, material); //点模型对象
    e.add(points); //点对象添加到场景中
  }
  //对象拾取
  pickupObjects() {
    if (this.camera === null || this.scene === null) return;
    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector3(1, 1, 1);
    //将鼠标点击位置的屏幕坐标转成threejs中的标准坐标
    raycaster.setFromCamera(mouse, this.camera); //计算射线相机到的对象，可能有多个对象，因此返回的是一个数组，按离相机远近排列
    let intersects = raycaster.intersectObjects(this.scene.children);
    for (var i = 0; i < intersects.length; i++) {
      intersects[i].object.scale.set(20, 20, 20);
    }
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

    var circle = new THREE.Mesh(geometry, material);
    console.log(circle);
    e.add(circle);
    circle.position.set(0.5, 0.5, 0.5);
    // circle.rotateY(Math.PI / 1.5);
    // circle.rotateY(-Math.PI / 3);
  }
  // 草地
  grass(e: THREE.Scene) {
    const geometryTerrain = new THREE.PlaneBufferGeometry(6000, 6000, 256, 256);
    // BufferGeometryUtils.computeTangents(geometryTerrain);
    console.log(TerrainShader);
    const terrainShader = TerrainShader.TerrainShader;
    const uniformsTerrain = THREE.UniformsUtils.clone(terrainShader.uniforms);
    const rx = 256,
      ry = 256;
    const pars = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBFormat
    };
    const normalMap = new THREE.WebGLRenderTarget(rx, ry, pars);
    normalMap.texture.generateMipmaps = false;
    const heightMap = new THREE.WebGLRenderTarget(rx, ry, pars);
    heightMap.texture.generateMipmaps = false;
    const textureLoader = new THREE.TextureLoader();
    var specularMap = new THREE.WebGLRenderTarget(2048, 2048, pars);
    specularMap.texture.generateMipmaps = false;
    var diffuseTexture1 = textureLoader.load(
      require("../static/terrain/grasslight-big.jpg")
    );
    var diffuseTexture2 = textureLoader.load(
      require("../static/terrain/backgrounddetailed6.jpg")
    );
    var detailTexture = textureLoader.load(
      require("../static/terrain/grasslight-big-nm.jpg")
    );
    uniformsTerrain["tNormal"].value = normalMap.texture;
    uniformsTerrain["uNormalScale"].value = 3.5;

    uniformsTerrain["tDisplacement"].value = heightMap.texture;

    uniformsTerrain["tDiffuse1"].value = diffuseTexture1;
    uniformsTerrain["tDiffuse2"].value = diffuseTexture2;
    uniformsTerrain["tSpecular"].value = specularMap.texture;
    uniformsTerrain["tDetail"].value = detailTexture;

    uniformsTerrain["enableDiffuse1"].value = true;
    uniformsTerrain["enableDiffuse2"].value = true;
    uniformsTerrain["enableSpecular"].value = true;

    uniformsTerrain["diffuse"].value.setHex(0xffffff);
    uniformsTerrain["specular"].value.setHex(0xffffff);

    uniformsTerrain["shininess"].value = 30;

    uniformsTerrain["uDisplacementScale"].value = 375;

    uniformsTerrain["uRepeatOverlay"].value.set(6, 6);
    const material = new THREE.ShaderMaterial({
      uniforms: uniformsTerrain,
      vertexShader: terrainShader.vertexShader,
      fragmentShader: terrainShader.fragmentShader,
      lights: true,
      fog: true
    });
    console.log(material);
    const terrain = new THREE.Mesh(geometryTerrain, material);
    e.position.set(0, -125, 0);
    e.rotation.x = -Math.PI / 2;
    e.add(terrain);
    console.log(terrain);
  }
  //土地
  tu(e: THREE.Scene) {
    const self = this;
    const worldWidth = 256,
      worldDepth = 256;
    var geometry = new THREE.PlaneBufferGeometry(
      7500,
      7500,
      worldWidth - 1,
      worldDepth - 1
    );

    geometry.rotateX(-Math.PI / 2);
    var vertices = geometry.attributes.position.array;
    var data = this.generateHeight(worldWidth, worldDepth);

    for (var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
      vertices[j + 1] = data[i] * 10;
    }
    const texture = new THREE.CanvasTexture(
      self.generateTexture(data, worldWidth, worldDepth) as HTMLCanvasElement
    );
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({ map: texture })
    );
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
      z = Math.random() * 100;

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

    for (var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
      vertices[j + 1] = data[i] * 10;
    }
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
  //渲染页面
  renders() {
    if (this.renderer === null || this.scene === null || this.camera === null) {
      return;
    }
    // let time = Number(new Date());
    // this.nowDate = time;
    requestAnimationFrame(this.renders);
    if (this.isShowPage) {
      return;
    }
    if (this.clock === null) {
      // 创建一个时钟对象clock
      this.clock = new THREE.Clock();
      this.clock.start();
    }
    const t = this.clock.getDelta();
    // 相机随陀螺仪运动
    const phi = THREE.MathUtils.degToRad(90 - this.lat);
    const theta = THREE.MathUtils.degToRad(this.lons - 0);
    // console.log(this.camera);
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
    if (this.isTeachAnimation) {
      this.teachAnimation(t);
    }
    // this.pickupObjects();
    this.renderer.render(this.scene, this.camera);
    this.renderer.shadowMap.enabled = true;
  }
  teachAnimation(t: number) {
    if (this.camera === null || this.clock === null) return;
    const time = this.clock.getElapsedTime();
    const position = this.lookat;
    if (time > 2 && time < 6) {
      position.x += t * 1.5;
      position.z += t * 2;
      // position.y += t * 0.5;
    } else if (time > 6 && time < 11) {
      position.x -= t * 1.5;
      position.z -= t * 1.5;
      // position.y += t * 0.1;
    } else if (time >= 12) {
      this.isTeachAnimation = false;
    }
    this.camera.lookAt(position);
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

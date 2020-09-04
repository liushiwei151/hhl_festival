<template>
  <div id="cameraBox"></div>
</template>
<script lang="ts">
import * as THREE from "three";
import "../common/three/OrbitControls";
import { Component, Vue } from "vue-property-decorator";
import mokeData from "../json/data.js";
@Component({})
export default class cameraBox extends Vue {
  //场景
  scene: THREE.Scene | null = null;
  camera: THREE.OrthographicCamera | THREE.PerspectiveCamera | null = null;
  //渲染对象
  renderer: THREE.WebGLRenderer | null = null;
  //当前时间
  nowDate: number = Number(new Date());
  //矩形模型
  mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial> | null = null;
  //雨滴数组
  group: any;

  mounted() {
    this.init();
    this.resize();
  }

  //绘制一个方块
  blockShaow(e: THREE.Scene) {
    const geometry = new THREE.BoxGeometry(200, 500, 200);
    const material = new THREE.MeshPhongMaterial({
      color: 0x0000ff,
      specular: 0x444444, //高光部分的颜色
      shininess: 20 //高光部分的亮度，默认30
    });
    const demo = new THREE.Mesh(geometry, material);
    demo.castShadow = true;
    e.add(demo);
  }
  //精灵模型
  sprite(e: THREE.Scene) {
    var texture = new THREE.TextureLoader().load(
      require("../static/sprite2.png")
    );
    // 创建精灵材质对象SpriteMaterial
    var spriteMaterial = new THREE.SpriteMaterial({
      color: 0xff00ff, //设置精灵矩形区域颜色
      rotation: Math.PI / 4, //旋转精灵对象45度，弧度值
      map: texture //设置精灵纹理贴图
    });
    // 创建精灵模型对象，不需要几何体geometry参数
    var sprite = new THREE.Sprite(spriteMaterial);
    e.add(sprite);
    // 控制精灵大小，比如可视化中精灵大小表征数据大小
    sprite.scale.set(10, 10, 1); //// 只需要设置x、y两个分量就可以
  }
  //简略版pm2.5
  pm(e: THREE.Scene) {
    var texture = new THREE.TextureLoader().load(
      require("../static/sprite2.png")
    );
    // 创建组对象，包含所有精灵对象
    let group = new THREE.Group();
    //遍历数据
    mokeData.data.forEach((elem: any) => {
      console.log(elem);
      // 精灵材质
      var spriteMaterial = new THREE.SpriteMaterial({
        map: texture, //设置精灵纹理贴图
        transparent: true,
        opacity: 0.5
      });
      // 创建精灵模型对象
      var sprite = new THREE.Sprite(spriteMaterial);
      group.add(sprite);
      // 控制精灵大小   使用PM2.5大小设置精灵模型的大小
      // 注意适当缩放pm2.5大小,以便得到更好的显示效果
      var k = elem.value / 10;
      sprite.scale.set(k, k, 1);
      //获得城市坐标设置精灵模型对象的位置
      sprite.position.set(elem.coordinate[0], elem.coordinate[1], 0);
    });
    console.log(group);
    // 中国城市坐标整体的几何中心不在坐标原点，需要适当的平移
    e.add(group); //把精灵群组插入场景中
  }
  //树林效果
  tree(e: THREE.Scene) {
    /**
     * 精灵创建树林效果
     */
    // 加载树纹理贴图
    var textureTree = new THREE.TextureLoader().load(
      require("../static/tree.png")
    );
    // 批量创建表示一个树的精灵模型
    for (let i = 0; i < 100; i++) {
      var spriteMaterial = new THREE.SpriteMaterial({
        map: textureTree //设置精灵纹理贴图
      });
      // 创建精灵模型对象
      var sprite = new THREE.Sprite(spriteMaterial);
      e.add(sprite);
      // 控制精灵大小,
      sprite.scale.set(100, 100, 1); //// 只需要设置x、y两个分量就可以
      var k1 = Math.random() - 0.5;
      var k2 = Math.random() - 0.5;
      // 设置精灵模型位置，在xoz平面上随机分布
      sprite.position.set(1000 * k1, 50, 1000 * k2);
    }
  }
  //草地
  grass(e: THREE.Scene) {
    /**
     * 创建一个草地地面
     */
    var geometry = new THREE.PlaneGeometry(1000, 1000); //矩形平面
    // 加载草地纹理贴图
    var texture = new THREE.TextureLoader().load(
      require("../static/grass.jpg")
    );
    // 设置纹理的重复模式
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    // uv两个方向纹理重复数量
    texture.repeat.set(10, 10);
    var material = new THREE.MeshLambertMaterial({
      // color: 0x777700
      map: texture
    });
    var mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
    e.add(mesh); //网格模型添加到场景中
    mesh.rotateX(-Math.PI / 2);
  }
  // 雨滴
  rain(e: THREE.Scene) {
    /**
     * 精灵创建下雨效果
     */
    // 创建一个组表示所有的雨滴
    var group = new THREE.Group();
    // 加载雨滴理贴图
    var textureTree = new THREE.TextureLoader().load(
      require("../static/rain.png")
    );
    // 批量创建表示雨滴的精灵模型
    for (let i = 0; i < 400; i++) {
      var spriteMaterial = new THREE.SpriteMaterial({
        map: textureTree //设置精灵纹理贴图
      });
      // 创建精灵模型对象
      var sprite = new THREE.Sprite(spriteMaterial);
      group.add(sprite);
      // 控制精灵大小,
      sprite.scale.set(8, 10, 1); //// 只需要设置x、y两个分量就可以
      var k1 = Math.random() - 0.5;
      var k2 = Math.random() - 0.5;
      var k3 = Math.random() - 0.5;
      // 设置精灵模型位置，在整个空间上上随机分布
      sprite.position.set(1000 * k1, 300 * k3, 1000 * k2);
    }
    e.add(group);
    this.group = group;
  }
  //渲染雨滴动画
  renderRain() {
    // 每次渲染遍历雨滴群组，刷新频率30~60FPS，两帧时间间隔16.67ms~33.33ms
    // 每次渲染都会更新雨滴的位置，进而产生动画效果
    this.group.children.forEach(sprite => {
      // 雨滴的y坐标每次减1
      sprite.position.y -= 2;
      if (sprite.position.y < 0) {
        // 如果雨滴落到地面，重置y，从新下落
        sprite.position.y = 200;
      }
    });
  }
  init() {
    const home = document.getElementById("cameraBox");
    // 创建场景对象scene
    this.scene = new THREE.Scene();
    /**添加的各种模型 */
    // this.blockShaow(this.scene);
    // this.sprite(this.scene);
    // this.pm(this.scene);
    // this.tree(this.scene);
    this.grass(this.scene);
    this.rain(this.scene);
    //点光源
    let point = new THREE.PointLight(0xffffff);
    point.position.set(150, 150, 150); //点光源位置
    let point1 = new THREE.PointLight(0xffffff);
    point1.position.set(-150, 150, 150); //点光源位置
    let point2 = new THREE.PointLight(0xffffff);
    point2.position.set(150, -150, 150); //点光源位置
    let point3 = new THREE.PointLight(0xffffff);
    point3.position.set(150, 150, -150); //点光源位置
    // 通过add方法插入场景中，不插入的话，渲染的时候不会获取光源的信息进行光照计算
    this.scene.add(point); //点光源添加到场景中
    this.scene.add(point1); //点光源添加到场景中
    this.scene.add(point2); //点光源添加到场景中
    this.scene.add(point3); //点光源添加到场景中
    //坐标系
    const axesHelper = new THREE.AxesHelper(2500);
    this.scene.add(axesHelper);
    //环境光    环境光颜色与网格模型的颜色进行RGB进行乘法运算
    const ambient = new THREE.AmbientLight(0x444444);
    this.scene.add(ambient);

    /**
     * 正投影相机设置
     */
    // const width = window.innerWidth; //窗口宽度
    // const height = window.innerHeight; //窗口高度
    // const k = width / height; //窗口宽高比
    // const s = 200; //三维场景显示范围控制系数，系数越大，显示的范围越大
    // this.camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
    // this.camera.position.set(200, 300, 200); //设置相机位置
    // this.camera.lookAt(this.scene.position); //设置相机方向(指向的场景对象)
    /**
     * 透视投影相机设置
     */
    const width = window.innerWidth; //窗口宽度
    const height = window.innerHeight; //窗口高度
    /**透视投影相机对象*/
    this.camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    this.camera.position.set(292, 109, 268); //设置相机位置
    this.camera.lookAt(this.scene.position); //设置相机方向(指向的场景对象)
    /**
     * 创建渲染对象
     */
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height); //设置渲染区域尺寸
    this.renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
    (home as HTMLElement).appendChild(this.renderer.domElement); //body元素中插入canvas对象
    //执行渲染操作   指定场景、相机作为参数
    this.renders();
    this.renderRain(this.renderer);
    const controls = new THREE.OrbitControls(
      this.camera,
      this.renderer.domElement
    );
  }
  //窗口自适应渲染
  resize() {
    const self = this;
    // onresize 事件会在窗口被调整大小时发生
    window.onresize = function() {
      // 重置渲染器输出画布canvas尺寸
      if (self.renderer !== null && self.camera !== null) {
        self.renderer.setSize(window.innerWidth, window.innerHeight);
        //透视投影相机自适应渲染
        //  self.camera.aspect = window.innerWidth/window.innerHeight;
        // 重置相机投影的相关参数
        const k = window.innerWidth / window.innerHeight; //窗口宽高比
        const s = 200;
        self.camera.left = -s * k;
        self.camera.right = s * k;
        self.camera.top = s;
        self.camera.bottom = -s;
        // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
        // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
        // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
        self.camera.updateProjectionMatrix();
      }
    };
  }
  //动画旋转渲染e场景f相机
  renders() {
    if (this.renderer === null || this.scene === null || this.camera === null) {
      return;
    }
    let time: number = Number(new Date());
    let t = this.nowDate - time;
    this.nowDate = time;
    if (this.group) {
      this.renderRain();
    }
    requestAnimationFrame(this.renders);
    this.renderer.render(this.scene, this.camera);
    this.renderer.shadowMap.enabled = true;
  }
}
</script>

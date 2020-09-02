<template>
  <div id="cameraBox"></div>
</template>
<script lang="ts">
import * as THREE from "three";
import "../common/three/OrbitControls";
import { Component, Vue } from "vue-property-decorator";
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
  mounted() {
    this.init();
  }
  //绘制一个方块
  blockShaow(e: THREE.Scene) {
    const geometry = new THREE.BoxGeometry(400, 1000, 400);
    const material = new THREE.MeshPhongMaterial({
      color: 0x0000ff,
      specular: 0x444444, //高光部分的颜色
      shininess: 20 //高光部分的亮度，默认30
    });
    const demo = new THREE.Mesh(geometry, material);
    demo.castShadow = true;
    e.add(demo);
  }
  init() {
    const home = document.getElementById("cameraBox");
    // 创建场景对象scene
    this.scene = new THREE.Scene();
    /**添加的各种模型 */
    this.blockShaow(this.scene);
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
    this.camera.position.set(200, 300, 200); //设置相机位置
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
    const controls = new THREE.OrbitControls(
      this.camera,
      this.renderer.domElement
    );
  }
  //动画旋转渲染e场景f相机
  renders() {
    if (this.renderer === null || this.scene === null || this.camera === null) {
      return;
    }
    let time: number = Number(new Date());
    let t = this.nowDate - time;
    this.nowDate = time;
    requestAnimationFrame(this.renders);
    this.renderer.render(this.scene, this.camera);
    this.renderer.shadowMap.enabled = true;
  }
}
</script>

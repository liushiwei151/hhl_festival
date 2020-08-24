<template>
  <div id="home"></div>
</template>

<script lang="ts">
import * as Three from "three";
import "../common/three/OrbitControls";
import { Component, Vue } from "vue-property-decorator";
@Component({})
export default class demo extends Vue {
  //渲染对象
  renderer: Three.WebGLRenderer | null = null;
  //网络模型对象
  mesh: Three.Mesh<Three.BoxGeometry, Three.MeshLambertMaterial> | null = null;
  mesh1: Three.Mesh<
    Three.SphereGeometry,
    Three.MeshLambertMaterial
  > | null = null;
  mesh2: Three.Mesh<
    Three.CylinderGeometry,
    Three.MeshLambertMaterial
  > | null = null;
  //场景
  scene: Three.Scene | null = null;
  //相机
  camera: Three.OrthographicCamera | null = null;
  //当前时间
  nowDate: number = Number(new Date());
  mounted(): void {
    this.init();
  }
  init() {
    const self = this;
    let home = document.getElementById("home");
    // 创建场景对象scene
    this.scene = new Three.Scene();
    //创建网络模型
    const Sphere = new Three.SphereGeometry(60, 40, 40); //球形几何体
    const geometry = new Three.BoxGeometry(100, 100, 100); //创建一个立方体
    const Cylinder = new Three.CylinderGeometry(50, 50, 100, 25); //创建一个立方体
    const material = new Three.MeshLambertMaterial({
      color: 0xfff,
      opacity: 0.7,
      transparent: true
    }); //材质对象
    const material1 = new Three.MeshLambertMaterial({
      color: 0x5667124
    }); //材质对象
    const sphereMaterial = new Three.MeshPhongMaterial({
      color: 0xeeeeee
      // shininess: 100
    }); //材质对象
    this.mesh = new Three.Mesh(geometry, material); //网络模型对象
    this.mesh1 = new Three.Mesh(Sphere, material1); //网络模型对象
    this.mesh2 = new Three.Mesh(Cylinder, sphereMaterial); //网络模型对象
    this.mesh1.translateY(120); //球体网格模型沿Y轴正方向平移120
    this.mesh2.position.set(120, 0, 0); //设置mesh3模型对象的xyz坐标为120,0,0
    this.scene.add(this.mesh); //网格模型添加到场景中
    this.scene.add(this.mesh1); //网格模型添加到场景中
    this.scene.add(this.mesh2); //网格模型添加到场景中
    //点光源
    let point = new Three.PointLight(0xffffff);
    point.position.set(400, 200, 300); //点光源位置
    // 通过add方法插入场景中，不插入的话，渲染的时候不会获取光源的信息进行光照计算
    this.scene.add(point); //点光源添加到场景中
    let point2 = new Three.PointLight(0xffffff);
    point2.position.set(-400, -200, -300); //点光源位置
    this.scene.add(point2); //点光源添加到场景中
    //环境光
    const ambient = new Three.AmbientLight(0x444444);
    this.scene.add(ambient);
    //坐标系
    const axesHelper = new Three.AxesHelper(2500);
    this.scene.add(axesHelper);
    /**
     * 相机设置
     */
    const width = window.innerWidth; //窗口宽度
    const height = window.innerHeight; //窗口高度
    const k = width / height; //窗口宽高比
    const s = 200; //三维场景显示范围控制系数，系数越大，显示的范围越大
    this.camera = new Three.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
    this.camera.position.set(200, 300, 200); //设置相机位置
    this.camera.lookAt(this.scene.position); //设置相机方向(指向的场景对象)
    /**
     * 创建渲染对象
     */
    this.renderer = new Three.WebGLRenderer();
    this.renderer.setSize(width, height); //设置渲染区域尺寸
    this.renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
    (home as HTMLElement).appendChild(this.renderer.domElement); //body元素中插入canvas对象
    //执行渲染操作   指定场景、相机作为参数
    this.renders();
    const controls = new Three.OrbitControls(
      this.camera,
      this.renderer.domElement
    );

    // controls.addEventListener("change", this.renders);
  }
  //动画旋转渲染e场景f相机
  renders() {
    console.log("渲染");
    if (
      this.renderer === null ||
      this.mesh === null ||
      this.scene === null ||
      this.camera === null
    ) {
      return;
    }
    let time: number = Number(new Date());
    let t = this.nowDate - time;
    this.nowDate = time;
    requestAnimationFrame(this.renders);
    this.renderer.render(this.scene, this.camera);
    // this.mesh.rotateY(0.001 * t);
  }
}
</script>
<style lang="less">
#home {
  overflow: hidden;
  width: 100vw;
  height: 100vh;
}
</style>

<template>
  <div id="light"></div>
</template>
<script lang="ts">
import * as THREE from "three";
import "../common/three/OrbitControls";
import { Component, Vue } from "vue-property-decorator";
@Component({})
export default class light extends Vue {
  //场景
  scene: THREE.Scene | null = null;
  camera: THREE.OrthographicCamera | null = null;
  //渲染对象
  renderer: THREE.WebGLRenderer | null = null;
  //当前时间
  nowDate: number = Number(new Date());
  //矩形模型
  mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial> | null = null;
  mounted(): void {
    this.init();
  }
  light(e: THREE.Scene) {
    //点光源
    let point = new THREE.PointLight(0xffffff);
    point.position.set(200, 200, 300); //点光源位置
    // 通过add方法插入场景中，不插入的话，渲染的时候不会获取光源的信息进行光照计算
    e.add(point); //点光源添加到场景中
  }
  //方块和阴影
  blockShaow(e: THREE.Scene) {
    const geometry = new THREE.BoxGeometry(40, 100, 40);
    // const material = new THREE.MeshPhongMaterial({
    //   color: 0x0000ff,
    //   specular: 0x444444, //高光部分的颜色
    //   shininess: 20 //高光部分的亮度，默认30
    // });
    const material = new THREE.MeshLambertMaterial({
      color: 0x0000ff
    });
    const demo = new THREE.Mesh(geometry, material);
    demo.castShadow = true;
    e.add(demo);
    //创建一个平面几何体作为投影面
    const planeGeometry = new THREE.PlaneGeometry(300, 200);
    const planeMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff
    });
    // 平面网格模型作为投影面
    let planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMesh.rotateX(-Math.PI / 2); //旋转网格模型
    planeMesh.position.y = -50; //设置网格模型y坐标
    // 设置接收阴影的投影面
    planeMesh.receiveShadow = true;
    e.add(planeMesh); //网格模型添加到场景中
    //点光源
    let point = new THREE.PointLight(0xffffff);
    point.position.set(50, 50, 50); //点光源位置
    point.castShadow = true;
    // 通过add方法插入场景中，不插入的话，渲染的时候不会获取光源的信息进行光照计算
    e.add(point); //点光源添加到场景中
    let lightObj3 = new THREE.PointLightHelper(point);
    e.add(lightObj3);
    // 聚光光源
    const spotLight = new THREE.SpotLight(0xffffff, 2);
    // 设置聚光光源位置
    spotLight.position.set(90, 200, 200);
    // 设置聚光光源发散角度
    spotLight.angle = Math.PI / 9;
    // 设置用于计算阴影的光源对象
    spotLight.castShadow = true;
    spotLight.receiveShadow = true;

    // 设置计算阴影的区域，注意包裹对象的周围
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 300;
    spotLight.shadow.camera.fov = 20;
    console.log(spotLight);
    // e.add(spotLight); //光对象添加到scene场景中

    const lightObj2 = new THREE.SpotLightHelper(spotLight);
    // e.add(lightObj2);
    // 方向光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    // 设置光源位置
    directionalLight.position.set(60, 100, 40);
    // 设置用于计算阴影的光源对象
    directionalLight.castShadow = true;
    // 设置计算阴影的区域，最好刚好紧密包围在对象周围
    // 计算阴影的区域过大：模糊  过小：看不到或显示不完整
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 300;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 200;
    directionalLight.shadow.camera.bottom = -100;
    directionalLight.shadow.mapSize.set(1024, 1024);
    // e.add(directionalLight);
    //平行光
    const lightObj = new THREE.DirectionalLightHelper(directionalLight);
    // e.add(lightObj);
    // 设置mapSize属性可以使阴影更清晰，不那么模糊
    // directionalLight.shadow.mapSize.set(1024,1024)
    // console.log(directionalLight.shadow.camera);
  }
  init() {
    const home = document.getElementById("light");
    // 创建场景对象scene
    this.scene = new THREE.Scene();
    this.blockShaow(this.scene);
    // this.light(this.scene);
    //坐标系
    const axesHelper = new THREE.AxesHelper(2500);
    this.scene.add(axesHelper);
    //环境光    环境光颜色与网格模型的颜色进行RGB进行乘法运算
    // const ambient = new THREE.AmbientLight(0x444444);
    // this.scene.add(ambient);
    /**
     * 相机设置
     */
    const width = window.innerWidth; //窗口宽度
    const height = window.innerHeight; //窗口高度
    const k = width / height; //窗口宽高比
    const s = 200; //三维场景显示范围控制系数，系数越大，显示的范围越大
    this.camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
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
    // (this.mesh as THREE.Mesh<
    //   THREE.BoxGeometry,
    //   THREE.MeshBasicMaterial
    // >).rotateX(0.001 * t);
  }
}
</script>
<style lang="less"></style>

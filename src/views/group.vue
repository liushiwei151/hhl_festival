<template>
  <div id="group"></div>
</template>
<script lang="ts">
import * as THREE from "three";
import "../common/three/OrbitControls";
import { Component, Vue } from "vue-property-decorator";
@Component({})
export default class group extends Vue {
  //场景
  scene: THREE.Scene | null = null;
  camera: THREE.OrthographicCamera | null = null;
  //渲染对象
  renderer: THREE.WebGLRenderer | null = null;
  //当前时间
  nowDate: number = Number(new Date());
  //矩形模型
  mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial> | null = null;
  mounted() {
    this.init();
  }
  blockGroup(e: THREE.Scene) {
    //创建两个网格模型mesh1、mesh2
    const geometry = new THREE.BoxGeometry(20, 20, 20);
    const material = new THREE.MeshLambertMaterial({ color: 0x0000ff });
    const group = new THREE.Group();
    const mesh1 = new THREE.Mesh(geometry, material);
    const mesh2 = new THREE.Mesh(geometry, material);
    mesh2.translateX(25);
    //把mesh1型插入到组group中，mesh1作为group的子对象
    group.add(mesh1);
    //把mesh2型插入到组group中，mesh2作为group的子对象
    group.add(mesh2);
    group.translateY(100);
    console.log("查看group的子对象", group.children);
    //把group插入到场景中作为场景子对象
    e.add(group);
  }
  // 球体网格模型创建函数
  sphereMesh(R: number, x: number, y: number, z: number) {
    var geometry = new THREE.SphereGeometry(R, 25, 25); //球体几何体
    var material = new THREE.MeshPhongMaterial({
      color: 0x0000ff
    }); //材质对象Material
    var mesh = new THREE.Mesh(geometry, material); // 创建网格模型对象
    mesh.position.set(x, y, z);
    return mesh;
  }
  // 圆柱体网格模型创建函数
  cylinderMesh(R: number, h: number, x: number, y: number, z: number) {
    var geometry = new THREE.CylinderGeometry(R, R, h, 25, 25); //球体几何体
    var material = new THREE.MeshPhongMaterial({
      color: 0x0000ff
    }); //材质对象Material
    var mesh = new THREE.Mesh(geometry, material); // 创建网格模型对象
    mesh.position.set(x, y, z);
    return mesh;
  }
  //机械人模型
  robot(e: THREE.Scene) {
    // 头部网格模型和组
    const headMesh = this.sphereMesh(10, 0, 0, 0);
    headMesh.name = "脑壳";
    const leftEyeMesh = this.sphereMesh(1, 8, 5, 4);
    leftEyeMesh.name = "左眼";
    const rightEyeMesh = this.sphereMesh(1, 8, 5, -4);
    rightEyeMesh.name = "右眼";
    const headGroup = new THREE.Group();
    headGroup.name = "头部";
    headGroup.add(headMesh, leftEyeMesh, rightEyeMesh);
    // 身体网格模型和组
    const neckMesh = this.cylinderMesh(3, 10, 0, -15, 0);
    neckMesh.name = "脖子";
    const bodyMesh = this.cylinderMesh(14, 30, 0, -35, 0);
    bodyMesh.name = "腹部";
    const leftLegMesh = this.cylinderMesh(4, 60, 0, -80, -7);
    leftLegMesh.name = "左腿";
    const rightLegMesh = this.cylinderMesh(4, 60, 0, -80, 7);
    rightLegMesh.name = "右腿";
    const legGroup = new THREE.Group();
    legGroup.name = "腿";
    legGroup.add(leftLegMesh, rightLegMesh);
    const bodyGroup = new THREE.Group();
    bodyGroup.name = "身体";
    bodyGroup.add(neckMesh, bodyMesh, legGroup);
    // 人Group
    const personGroup = new THREE.Group();
    personGroup.name = "人";
    personGroup.add(headGroup, bodyGroup);
    personGroup.translateY(50);
    e.add(personGroup);
  }
  //坐标
  coordinate(e: THREE.Scene) {
    const geometry = new THREE.SphereGeometry(25, 25, 25); //球体几何体
    const material = new THREE.MeshPhongMaterial({
      color: 0x0000ff
    }); //材质对象Material
    const mesh = new THREE.Mesh(geometry, material);
    // mesh的本地坐标设置为(50, 0, 0)
    mesh.position.set(50, 0, 0);
    const group = new THREE.Group();
    // group本地坐标设置和mesh一样设置为(50, 0, 0)
    // mesh父对象设置position会影响得到mesh的世界坐标
    group.position.set(50, 0, 0);
    group.add(mesh);
    e.add(group);

    // .position属性获得本地坐标
    console.log("本地坐标", mesh.position);

    // getWorldPosition()方法获得世界坐标
    //该语句默认在threejs渲染的过程中执行,如果渲染之前想获得世界矩阵属性、世界位置属性等属性，需要通过代码更新
    e.updateMatrixWorld(true);
    const worldPosition = new THREE.Vector3();
    mesh.getWorldPosition(worldPosition);
    console.log("世界坐标", worldPosition);
  }
  init() {
    const home = document.getElementById("group");
    // 创建场景对象scene
    this.scene = new THREE.Scene();
    //group模型
    this.blockGroup(this.scene);
    this.robot(this.scene);
    this.coordinate(this.scene);
    /*this.scene.traverse(function(obj) {
      console.group();
      if (obj.type === "Group") {
        console.log(obj.name);
      }
      if (obj.type === "Mesh") {
        console.log("  " + obj.name);
        obj.material.color.set(0xffff00);
      }
      if (obj.name === "左眼" || obj.name === "右眼") {
        obj.material.color.set(0x000000);
      }
      console.log(obj);
      // 打印id属性
      console.log(obj.id);
      // 打印该对象的父对象
      console.log(obj.parent);
      // 打印该对象的子对象
      console.log(obj.children);
      console.groupEnd();
    });*/
    //坐标系
    const axesHelper = new THREE.AxesHelper(2500);
    this.scene.add(axesHelper);
    //环境光    环境光颜色与网格模型的颜色进行RGB进行乘法运算
    const ambient = new THREE.AmbientLight(0x444444);
    this.scene.add(ambient);
    console.log("查看Scene的子对象", this.scene.children);
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

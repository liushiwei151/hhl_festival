<template>
  <div id="demo1"></div>
</template>
<script lang="ts">
import * as THREE from "three";
import "../common/three/OrbitControls";
import { Component, Vue } from "vue-property-decorator";
@Component({})
export default class demo1 extends Vue {
  //渲染对象
  renderer: THREE.WebGLRenderer | null = null;
  //网络模型对象
  mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial> | null = null;
  mesh1: THREE.Mesh<
    THREE.SphereGeometry,
    THREE.MeshLambertMaterial
  > | null = null;
  mesh2: THREE.Mesh<THREE.BoxGeometry, THREE.MeshLambertMaterial> | null = null;
  //场景
  scene: THREE.Scene | null = null;
  //相机
  camera: THREE.OrthographicCamera | null = null;
  //当前时间
  nowDate: number = Number(new Date());
  mounted(): void {
    this.init();
  }
  face3() {
    const geometry = new THREE.Geometry();
    const p1 = new THREE.Vector3(0, 0, 0);
    const p2 = new THREE.Vector3(0, 100, 0);
    const p3 = new THREE.Vector3(50, 0, 0);
    const p4 = new THREE.Vector3(0, 0, 100);
    geometry.vertices.push(p1, p2, p3, p4);

    //使用face添加法向量
    const face1 = new THREE.Face3(0, 1, 2);
    const n1 = new THREE.Vector3(0, 0, -1);
    const n2 = new THREE.Vector3(0, 0, -1);
    const n3 = new THREE.Vector3(0, 0, -1);
    // face1.color = new THREE.Color(0xffff00);
    // face1.color = new THREE.Color(0xff00ff);
    face1.vertexColors = [
      new THREE.Color(0xffff00),
      new THREE.Color(0xff00ff),
      new THREE.Color(0x00ffff)
    ];
    face1.vertexNormals.push(n1, n2, n3);

    //三角面
    const face2 = new THREE.Face3(0, 2, 3);
    face2.normal = new THREE.Vector3(0, -1, 0);
    geometry.faces.push(face1, face2);
    return geometry;
  }
  init() {
    const self = this;
    let home = document.getElementById("demo1");
    // 创建场景对象scene
    this.scene = new THREE.Scene();
    const geometry = new THREE.BufferGeometry(); //声明一个缓冲几何体对象
    const Sphere = new THREE.SphereGeometry(60, 40, 40); //球形几何体
    const material1 = new THREE.MeshLambertMaterial({
      color: 0x5667124
    }); //材质对象
    this.mesh1 = new THREE.Mesh(Sphere, material1); //网络模型对象
    // this.scene.add(this.mesh1); //网格模型添加到场景中
    //类型数组创建顶点位置position数据
    const vertices = new Float32Array([
      0,
      0,
      0, //顶点1坐标
      50,
      0,
      0, //顶点2坐标
      0,
      100,
      0, //顶点3坐标

      0,
      0,
      0, //顶点4坐标
      0,
      0,
      100, //顶点5坐标
      50,
      0,
      0 //顶点6坐标
    ]);
    // 创建属性缓冲区对象
    const attribue = new THREE.BufferAttribute(vertices, 3); //3个为一组，作为一个顶点的xyz坐标
    // 设置几何体attributes属性的位置position属性
    geometry.attributes.position = attribue;
    //类型数组创建顶点颜色color数据
    const colors = new Float32Array([
      1,
      0,
      0, //顶点1颜色
      0,
      1,
      0, //顶点2颜色
      0,
      0,
      1, //顶点3颜色

      1,
      1,
      0, //顶点4颜色
      0,
      1,
      1, //顶点5颜色
      1,
      0,
      1 //顶点6颜色
    ]);
    // 设置几何体attributes属性的颜色color属性
    //geometry.attributes.color = new THREE.BufferAttribute(colors, 3); //3个为一组,表示一个顶点的颜色数据RGB
    //添加顶点
    const normals = new Float32Array([
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,

      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0
    ]);
    geometry.attributes.normal = new THREE.BufferAttribute(normals, 3);
    //材质对象
    const material = new THREE.PointsMaterial({
      // 使用顶点颜色数据渲染模型，不需要再定义color属性
      // color: 0xff0000,
      vertexColors: true, //以顶点颜色为准
      size: 10.0 //点对象像素尺寸
    });
    //使用顶点定义矩形
    let geometry1 = new THREE.BufferGeometry();
    let vertices1 = new Float32Array([0, 0, 0, 80, 0, 0, 80, 80, 0, 0, 80, 0]);
    let attribue1 = new THREE.BufferAttribute(vertices1, 3);
    geometry1.attributes.position = attribue1;
    let normal1 = new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]);
    geometry1.attributes.normal = new THREE.BufferAttribute(normal1, 3);
    let indexs = new Uint16Array([0, 1, 3, 0, 1, 2]);
    geometry1.index = new THREE.BufferAttribute(indexs, 1);

    // 点渲染模式  点模型对象Points
    // const points = new THREE.Points(geometry, material); //点模型对象
    // this.scene.add(points); //点对象添加到场景
    // 几何体
    // const geometry = new THREE.BoxGeometry(100, 100, 100); //创建一个立方体几何对象Geometry
    // const material = new THREE.MeshLambertMaterial({
    //   color: 0x0000ff
    // }); //材质对象Material
    const geometry2 = this.face3();
    const mesh2 = new THREE.Mesh(geometry, material1); //网格模型对象Mesh
    const mesh3 = new THREE.Mesh(geometry1, material1); //网格模型对象Mesh
    const mesh4 = new THREE.Mesh(geometry2, material1); //网格模型对象Mesh
    // this.scene.add(mesh2);
    this.scene.add(mesh4);
    //点光源
    let point = new THREE.PointLight(0xffffff);
    point.position.set(-100, -200, -300); //点光源位置
    // 通过add方法插入场景中，不插入的话，渲染的时候不会获取光源的信息进行光照计算
    this.scene.add(point); //点光源添加到场景中
    //坐标系
    const axesHelper = new THREE.AxesHelper(2500);
    this.scene.add(axesHelper);
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
  //顶点颜色
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
    // this.mesh.rotateY(0.001 * t);
  }
}
</script>
<style lang="less"></style>

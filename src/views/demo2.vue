<template>
  <div id="demo2"></div>
</template>
<script lang="ts">
import * as THREE from "three";
import "../common/three/OrbitControls";
import { Component, Vue } from "vue-property-decorator";
@Component({})
export default class demo2 extends Vue {
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
  //多颜色方块
  blockBox() {
    const geometry = new THREE.BoxGeometry(100, 100, 100);
    geometry.faces.shift();
    geometry.faces.pop();
    // 几何体xyz三个方向都放大2倍
    // geometry.scale(2, 2, 2);
    // 几何体xyz方向分别缩放0.5,1.5,2倍
    // geometry.scale(0.5, 1.5, 2);
    // 几何体沿着x轴平移50
    geometry.translate(50, 0, 0);
    // 几何体绕着x轴旋转45度
    geometry.rotateX(Math.PI / 4);
    // 居中：偏移的几何体居中
    geometry.center();
    // 遍历几何体的face属性
    geometry.faces.forEach(face => {
      // 设置三角面face三个顶点的颜色
      face.vertexColors = [
        new THREE.Color(0xffff00),
        new THREE.Color(0xff00ff),
        new THREE.Color(0x00ffff)
      ];
    });
    const material = new THREE.MeshBasicMaterial({
      // color: 0x0000ff,
      vertexColors: true,
      side: THREE.DoubleSide
      // wireframe:true,//线框模式渲染
    }); //材质对象Material
    console.log(geometry);
    const mesh = new THREE.Mesh(geometry, material); //网络模型对象
    // 网格模型xyz方向分别缩放0.5,1.5,2倍
    // mesh.scale.set(0.5, 1.5, 2);
    this.mesh = mesh;
    return mesh;
  }
  //点材质 球体
  point() {
    const geometry = new THREE.SphereGeometry(100, 25, 25);
    const material = new THREE.PointsMaterial({
      color: 0x0000ff,
      size: 3
    });
    const point = new THREE.Points(geometry, material);
    return point;
  }
  //基础线材质球体
  basicsLine() {
    const geometry = new THREE.SphereGeometry(100, 25, 25);
    const material = new THREE.LineBasicMaterial({
      color: 0x0000ff
    });
    const line = new THREE.Line(geometry, material);
    return line;
  }
  //虚线材质球体
  dasheLine() {
    const geometry = new THREE.SphereGeometry(110, 25, 25);
    const material = new THREE.LineDashedMaterial({
      color: 0x0000ff,
      dashSize: 10, //显示线段的大小。默认为3。
      gapSize: 5 //间隙的大小。默认为1
    });
    const dashe = new THREE.LineLoop(geometry, material);
    return dashe;
  }
  //测试网络材质的方块
  blockDemo() {
    const geometry = new THREE.BoxGeometry(50, 50, 50);
    const material = new THREE.MeshBasicMaterial({
      color: 0x0000ff
    });
    const demo = new THREE.Mesh(geometry, material);
    return demo;
  }
  //测试网络材质的方块
  blockDemo1() {
    const geometry = new THREE.BoxGeometry(50, 50, 50);
    geometry.translate(100, 0, 0);
    const material = new THREE.MeshLambertMaterial({
      color: 0xfffffff
      // transparent: true,
      // 设置材质透明度
      // opacity: 0.4
    });
    const demo = new THREE.Mesh(geometry, material);
    return demo;
  }
  //测试网络材质的方块
  blockDemo2() {
    const geometry = new THREE.BoxGeometry(50, 50, 50);
    geometry.translate(0, 100, 0);
    const material = new THREE.MeshPhongMaterial({
      color: 0xff0000,
      specular: 0x444444, //高光部分的颜色
      shininess: 20 //高光部分的亮度，默认30
    });
    const demo = new THREE.Mesh(geometry, material);
    return demo;
  }
  blockDemo3() {
    const geometry = new THREE.BoxGeometry(50, 50, 50);
    geometry.translate(0, 0, 100);
    const material = new THREE.LineBasicMaterial({
      color: 0xff0000 //线条颜色
    }); //材质对象
    const demo = new THREE.LineSegments(geometry, material);
    return demo;
  }
  blockDemo4() {
    const geometry = new THREE.BoxGeometry(50, 50, 50);
    // geometry.translate(200, 0, 0);
    const material = new THREE.MeshLambertMaterial({
      color: 0x0000ff, //三角面颜色
      wireframe: true
    }); //材质对象
    const demo = new THREE.Mesh(geometry, material);
    demo.position.set(200, 0, 0);
    demo.rotateY(Math.PI / 4);
    console.log(demo.quaternion);
    return demo;
  }
  //光源
  light(e: THREE.Scene) {
    //点光源
    let point = new THREE.PointLight(0xffffff);
    point.position.set(200, 200, 300); //点光源位置
    // 通过add方法插入场景中，不插入的话，渲染的时候不会获取光源的信息进行光照计算
    // e.add(point); //点光源添加到场景中
    /* 平行光*/
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    // 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
    directionalLight.position.set(500, 500, 500);
    // 方向光指向对象网格模型mesh2，可以不设置，默认的位置是0,0,0
    // directionalLight.target = mesh2;
    // e.add(directionalLight);
    //光源辅助对象
    //平行光
    const lightObj = new THREE.DirectionalLightHelper(directionalLight);
    // e.add(lightObj);
    /**聚光源 */
    // 聚光光源
    const spotLight = new THREE.SpotLight(0x440000);
    // 设置聚光光源位置
    spotLight.position.set(200, 200, 200);
    // 聚光灯光源指向网格模型mesh2
    spotLight.target = this.blockDemo2();
    // 设置聚光光源发散角度
    spotLight.angle = Math.PI / 6;
    e.add(spotLight); //光对象添加到scene场景中
    const lightObj2 = new THREE.SpotLightHelper(spotLight);
    e.add(lightObj2);
  }
  init() {
    const home = document.getElementById("demo2");
    // 创建场景对象scene
    this.scene = new THREE.Scene();

    // this.scene.add(this.blockBox());
    this.scene.add(this.point());
    // this.scene.add(this.basicsLine());
    this.scene.add(this.dasheLine());
    this.scene.add(this.blockDemo());
    this.scene.add(this.blockDemo1());
    this.scene.add(this.blockDemo2());
    this.scene.add(this.blockDemo3());
    this.scene.add(this.blockDemo4());
    this.light(this.scene);
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
    // (this.mesh as THREE.Mesh<
    //   THREE.BoxGeometry,
    //   THREE.MeshBasicMaterial
    // >).rotateX(0.001 * t);
  }
}
</script>
<style lang="less"></style>

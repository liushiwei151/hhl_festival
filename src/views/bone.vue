<template>
  <div id="bone"></div>
</template>
<script lang="ts">
import * as THREE from "three";
import "../common/three/OrbitControls";
import { Component, Vue } from "vue-property-decorator";
@Component({})
export default class bone extends Vue {
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
  blockShaow() {
    const geometry = new THREE.BoxGeometry(50, 50, 50);
    const material = new THREE.MeshPhongMaterial({
      color: 0x0000ff,
      specular: 0x444444, //高光部分的颜色
      shininess: 20 //高光部分的亮度，默认30
    });
    const demo = new THREE.Mesh(geometry, material);
    demo.castShadow = true;
    return demo;
  }
  //绘制一个圆
  sphere() {
    const geometry = new THREE.SphereGeometry(60, 40, 40);
    const material = new THREE.MeshPhongMaterial({
      color: 0x0000ff,
      specular: 0x444444, //高光部分的颜色
      shininess: 20 //高光部分的亮度，默认30
    });
    const demo = new THREE.Mesh(geometry, material);
    demo.castShadow = true;
    return demo;
  }
  //骨骼
  bone() {
    var Bone1 = new THREE.Bone(); //关节1，用来作为根关节
    var Bone2 = new THREE.Bone(); //关节2
    var Bone3 = new THREE.Bone(); //关节3
    // 设置关节父子关系   多个骨头关节构成一个树结构
    Bone1.add(Bone2);
    Bone2.add(Bone3);
    // 设置关节之间的相对位置
    //根关节Bone1默认位置是(0,0,0)
    Bone2.position.y = 60; //Bone2相对父对象Bone1位置
    Bone3.position.y = 40; //Bone3相对父对象Bone2位置
    // 所有Bone对象插入到Skeleton中，全部设置为.bones属性的元素
    var skeleton = new THREE.Skeleton([Bone1, Bone2, Bone3]); //创建骨骼系统
    // 查看.bones属性中所有骨关节Bone
    console.log(skeleton.bones);
    // 返回所有关节的世界坐标
    skeleton.bones.forEach(elem => {
      console.log(elem.getWorldPosition(new THREE.Vector3()));
    });
  }
  //骨骼动画
  boneAnimation(scene: THREE.Scene) {
    /**
     * 创建骨骼网格模型SkinnedMesh
     */
    // 创建一个圆柱几何体，高度120，顶点坐标y分量范围[-60,60]
    var geometry = new THREE.CylinderGeometry(5, 10, 120, 50, 300);
    geometry.translate(0, 60, 0); //平移后，y分量范围[0,120]
    console.log("name", geometry.vertices); //控制台查看顶点坐标
    //
    /**
     * 设置几何体对象Geometry的蒙皮索引skinIndices、权重skinWeights属性
     * 实现一个模拟腿部骨骼运动的效果
     */
    //遍历几何体顶点，为每一个顶点设置蒙皮索引、权重属性
    //根据y来分段，0~60一段、60~100一段、100~120一段
    for (var i = 0; i < geometry.vertices.length; i++) {
      var vertex = geometry.vertices[i]; //第i个顶点
      if (vertex.y <= 60) {
        // 设置每个顶点蒙皮索引属性  受根关节Bone1影响
        geometry.skinIndices.push(new THREE.Vector4(0, 0, 0, 0));
        // 设置每个顶点蒙皮权重属性
        // 影响该顶点关节Bone1对应权重是1-vertex.y/60
        geometry.skinWeights.push(
          new THREE.Vector4(1 - vertex.y / 60, 0, 0, 0)
        );
      } else if (60 < vertex.y && vertex.y <= 60 + 40) {
        // Vector4(1, 0, 0, 0)表示对应顶点受关节Bone2影响
        geometry.skinIndices.push(new THREE.Vector4(1, 0, 0, 0));
        // 影响该顶点关节Bone2对应权重是1-(vertex.y-60)/40
        geometry.skinWeights.push(
          new THREE.Vector4(1 - (vertex.y - 60) / 40, 0, 0, 0)
        );
      } else if (60 + 40 < vertex.y && vertex.y <= 60 + 40 + 20) {
        // Vector4(2, 0, 0, 0)表示对应顶点受关节Bone3影响
        geometry.skinIndices.push(new THREE.Vector4(2, 0, 0, 0));
        // 影响该顶点关节Bone3对应权重是1-(vertex.y-100)/20
        geometry.skinWeights.push(
          new THREE.Vector4(1 - (vertex.y - 100) / 20, 0, 0, 0)
        );
      }
    }
    // 材质对象
    var material = new THREE.MeshPhongMaterial({
      skinning: true //允许蒙皮动画
      // wireframe:true,
    });
    // 创建骨骼网格模型
    var SkinnedMesh = new THREE.SkinnedMesh(geometry, material);
    SkinnedMesh.position.set(50, 120, 50); //设置网格模型位置
    SkinnedMesh.rotateX(Math.PI); //旋转网格模型
    scene.add(SkinnedMesh); //网格模型添加到场景中

    /**
     * 骨骼系统
     */
    var Bone1 = new THREE.Bone(); //关节1，用来作为根关节
    var Bone2 = new THREE.Bone(); //关节2
    var Bone3 = new THREE.Bone(); //关节3
    // 设置关节父子关系   多个骨头关节构成一个树结构
    Bone1.add(Bone2);
    Bone2.add(Bone3);
    // 设置关节之间的相对位置
    //根关节Bone1默认位置是(0,0,0)
    Bone2.position.y = 60; //Bone2相对父对象Bone1位置
    Bone3.position.y = 40; //Bone3相对父对象Bone2位置

    // 所有Bone对象插入到Skeleton中，全部设置为.bones属性的元素
    var skeleton = new THREE.Skeleton([Bone1, Bone2, Bone3]); //创建骨骼系统
    // console.log(skeleton.bones);
    // 返回所有关节的世界坐标
    // skeleton.bones.forEach(elem => {
    //   console.log(elem.getWorldPosition(new THREE.Vector3()));
    // });
    //骨骼关联网格模型
    SkinnedMesh.add(Bone1); //根骨头关节添加到网格模型
    SkinnedMesh.bind(skeleton); //网格模型绑定到骨骼系统
    console.log(SkinnedMesh);
    /**
     * 骨骼辅助显示
     */
    var skeletonHelper = new THREE.SkeletonHelper(SkinnedMesh);
    scene.add(skeletonHelper);

    // 转动关节带动骨骼网格模型出现弯曲效果  好像腿弯曲一样
    skeleton.bones[1].rotation.x = 0.5;
    skeleton.bones[2].rotation.x = 0.5;
  }
  morphTargets(e: any) {
    /**
     * 创建网格模型，并给模型的几何体设置多个变形目标
     */
    // 创建一个几何体具有8个顶点
    var geometry = new THREE.BoxBufferGeometry(50, 50, 50); //立方体几何对象
    console.log(geometry);
    // 为geometry提供变形目标的数据
    var box1 = new THREE.BoxGeometry(100, 5, 100); //为变形目标1提供数据
    var box2 = new THREE.BoxGeometry(5, 200, 5); //为变形目标2提供数据
    // 设置变形目标的数据
    geometry.morphTargets[0] = { name: "target1", vertices: box1.vertices };
    geometry.morphTargets[1] = { name: "target2", vertices: box2.vertices };
    var material = new THREE.MeshLambertMaterial({
      morphTargets: true, //允许变形
      color: 0x0000ff
    }); //材质对象
    var mesh = new THREE.Mesh(geometry, material); //网格模型对象
    e.add(mesh); //网格模型添加到场景中
  }
  init() {
    const home = document.getElementById("bone");
    // 创建场景对象scene
    this.scene = new THREE.Scene();
    /**添加的各种模型 */
    // this.morphTargets(this.scene);
    // this.boneAnimation(this.scene);
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
    this.clock = new THREE.Clock();
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
    requestAnimationFrame(this.renders);
    this.renderer.render(this.scene, this.camera);
    this.renderer.shadowMap.enabled = true;
  }
}
</script>

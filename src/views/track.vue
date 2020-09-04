<template>
  <div id="tracks">
    <button @click="pause" style="padding:10px">暂停/播放</button>
  </div>
</template>
<script lang="ts">
import * as THREE from "three";
import "../common/three/OrbitControls";
import { Component, Vue } from "vue-property-decorator";
@Component({})
export default class tracks extends Vue {
  //场景
  scene: THREE.Scene | null = null;
  camera: THREE.OrthographicCamera | THREE.PerspectiveCamera | null = null;
  //渲染对象
  renderer: THREE.WebGLRenderer | null = null;
  //当前时间
  nowDate: number = Number(new Date());
  //矩形模型
  mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial> | null = null;
  mixer!: THREE.AnimationMixer;
  clock!: THREE.Clock;
  AnimationAction: any;
  clip: any;
  mounted() {
    this.init();
  }
  pause() {
    //快进
    // 开始结束时间设置为一样，相当于播放时间为0，直接跳转到时间点对应的状态
    this.AnimationAction.time += 2; //操作对象设置开始播放时间
    // this.clip.duration = this.AnimationAction.time; //剪辑对象设置播放结束时间
    this.AnimationAction.play(); //开始播放
    return;
    // 设置播放区间
    this.AnimationAction.time = 1; //操作对象设置开始播放时间
    this.clip.duration = 10; //剪辑对象设置播放结束时间
    return;
    //播放暂停
    if (this.AnimationAction.paused) {
      // 如果是播放状态，设置为暂停状态
      this.AnimationAction.paused = false;
    } else {
      // 如果是暂停状态，设置为播放状态
      this.AnimationAction.paused = true;
    }
  }
  //简单帧动画
  trackAnimation(group: any) {
    /**
     * 编辑group子对象网格模型mesh1和mesh2的帧动画数据
     */
    // 创建名为Box对象的关键帧数据
    var times = [0, 10]; //关键帧时间数组，离散的时间点序列
    var values = [0, 0, 0, 150, 0, 0]; //与时间点对应的值组成的数组
    // 创建位置关键帧对象：0时刻对应位置0, 0, 0   10时刻对应位置150, 0, 0
    var posTrack = new THREE.KeyframeTrack("Box.position", times, values);
    // 创建颜色关键帧对象：10时刻对应颜色1, 0, 0   20时刻对应颜色0, 0, 1
    var colorKF = new THREE.KeyframeTrack(
      "Box.material.color",
      [10, 20],
      [1, 0, 0, 0, 0, 1]
    );
    // 创建名为Sphere对象的关键帧数据  从0~20时间段，尺寸scale缩放3倍
    var scaleTrack = new THREE.KeyframeTrack(
      "Sphere.scale",
      [0, 20],
      [1, 1, 1, 3, 3, 3]
    );

    // duration决定了默认的播放时间，一般取所有帧动画的最大时间
    // duration偏小，帧动画数据无法播放完，偏大，播放完帧动画会继续空播放
    var duration = 20;
    // 多个帧动画作为元素创建一个剪辑clip对象，命名"default"，持续时间20
    this.clip = new THREE.AnimationClip("default", duration, [
      posTrack,
      colorKF,
      scaleTrack
    ]);
    /**
     * 播放编辑好的关键帧数据
     */
    // group作为混合器的参数，可以播放group中所有子对象的帧动画
    this.mixer = new THREE.AnimationMixer(group);
    // 剪辑clip作为参数，通过混合器clipAction方法返回一个操作对象AnimationAction
    this.AnimationAction = this.mixer.clipAction(this.clip);
    //通过操作Action设置播放方式
    this.AnimationAction.timeScale = 1; //默认1，可以调节播放速度
    this.AnimationAction.time = 1; //操作对象设置开始播放时间
    this.clip.duration = 20; //剪辑对象设置播放结束时间
    // AnimationAction.loop = THREE.LoopOnce; //不循环播放
    this.AnimationAction.play(); //开始播放
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
  init() {
    const home = document.getElementById("tracks");
    // 创建场景对象scene
    this.scene = new THREE.Scene();
    /**添加的各种模型 */
    var group = new THREE.Group();
    const mesh1 = this.sphere();
    const mesh2 = this.blockShaow();
    mesh1.name = "Box"; //网格模型1命名
    mesh2.name = "Sphere"; //网格模型2命名
    group.add(mesh1); //网格模型添加到组中
    group.add(mesh2); //网格模型添加到组中
    this.scene.add(group);
    this.trackAnimation(group);
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
    if (this.mixer) {
      this.mixer.update(this.clock.getDelta());
    }
  }
}
</script>

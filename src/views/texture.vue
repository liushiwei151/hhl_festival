<template>
  <div id="texture">
    <canvas
      style="display:none"
      id="newCanvas"
      width="512"
      height="218"
    ></canvas>
  </div>
</template>
<script lang="ts">
import * as THREE from "three";
import "../common/three/OrbitControls";
import { Component, Vue } from "vue-property-decorator";
@Component({})
export default class curve extends Vue {
  //场景
  scene: THREE.Scene | null = null;
  camera: THREE.OrthographicCamera | null = null;
  //渲染对象
  renderer: THREE.WebGLRenderer | null = null;
  //当前时间
  nowDate: number = Number(new Date());
  //矩形模型
  mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial> | null = null;
  texture: any;
  mounted() {
    this.init();
  }
  //纹理基本操作
  textrue(e: THREE.Scene) {
    // 纹理贴图映射到一个矩形平面上
    // var geometry = new THREE.PlaneGeometry(204, 102); //矩形平面
    // var geometry = new THREE.BoxGeometry(100, 100, 100); //立方体
    var geometry = new THREE.SphereGeometry(60, 25, 25); //球体
    // TextureLoader创建一个纹理加载器对象，可以加载图片作为几何体纹理
    var textureLoader = new THREE.TextureLoader();
    // 执行load方法，加载纹理贴图成功后，返回一个纹理对象Texture
    textureLoader.load(require("../static/1.jpg"), function(texture) {
      var material = new THREE.MeshLambertMaterial({
        // color: 0x0000ff,
        // 设置颜色纹理贴图：Texture对象作为材质map属性的属性值
        map: texture //设置颜色贴图属性值
      }); //材质对象Material
      var mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
      e.add(mesh); //网格模型添加到场景中

      //纹理贴图加载成功后，调用渲染函数执行渲染操作
      // render();
    });
  }
  //图片加载器 在平面上自定义坐标
  imgLoad(e: THREE.Scene) {
    var geometry = new THREE.PlaneGeometry(204, 102, 4, 4); //矩形平面
    // var geometry = new THREE.BoxGeometry(100, 100, 100); //立方体
    // var geometry = new THREE.SphereGeometry(60, 25, 25); //球体
    /**
     * 遍历uv坐标
     */
    // geometry.faceVertexUvs[0].forEach(elem => {
    //   elem.forEach(Vector2 => {
    //     // 所有的UV坐标全部设置为一个值
    //     Vector2.set(1, 1);
    //   });
    // });
    /**
     * 局部三角面显示完整纹理贴图
     */
    var t0 = new THREE.Vector2(0, 1); //图片左下角
    var t1 = new THREE.Vector2(0, 0); //图片右下角
    var t2 = new THREE.Vector2(1, 0); //图片右上角
    var t3 = new THREE.Vector2(1, 1); //图片左上角
    var uv1 = [t0, t1, t3]; //选中图片一个三角区域像素——用于映射到一个三角面
    var uv2 = [t1, t2, t3]; //选中图片一个三角区域像素——用于映射到一个三角面
    // 设置第五、第六个三角形面对应的纹理坐标
    geometry.faceVertexUvs[0][0] = uv1;
    geometry.faceVertexUvs[0][1] = uv2;
    // 图片加载器
    var ImageLoader = new THREE.ImageLoader();
    // load方法回调函数，按照路径加载图片，返回一个html的元素img对象
    ImageLoader.load(require("../static/1.jpg"), function(img) {
      console.log(img);
      // image对象作为参数，创建一个纹理对象Texture
      var texture = new THREE.Texture(img);
      // 下次使用纹理时触发更新
      texture.needsUpdate = true;
      var material = new THREE.MeshLambertMaterial({
        map: texture, //设置纹理贴图
        side: THREE.DoubleSide
        // wireframe: true //线框模式渲染
      });
      var mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
      e.add(mesh); //网格模型添加到场景中
    });
  }
  //Geometry自定义顶点UV坐标 几何体自定义uv坐标
  geometryUV(e: THREE.Scene) {
    var geometry = new THREE.Geometry(); //创建一个空几何体对象
    /**顶点坐标(纹理映射位置)*/
    var p1 = new THREE.Vector3(10, 10, 0); //顶点1坐标
    var p2 = new THREE.Vector3(160, 10, 0); //顶点2坐标
    var p3 = new THREE.Vector3(160, 80, 0); //顶点3坐标
    var p4 = new THREE.Vector3(10, 80, 0); //顶点4坐标
    geometry.vertices.push(p1, p2, p3, p4); //顶点坐标添加到geometry对象
    /** 三角面1、三角面2*/
    var normal = new THREE.Vector3(0, 0, 1); //三角面法向量
    var face0 = new THREE.Face3(0, 1, 2, normal); //三角面1
    var face1 = new THREE.Face3(0, 2, 3, normal); //三角面2
    geometry.faces.push(face0, face1); //三角面1、2添加到几何体
    // /**纹理坐标*/
    var t0 = new THREE.Vector2(0, 0); //图片左下角
    var t1 = new THREE.Vector2(1, 0); //图片右下角
    var t2 = new THREE.Vector2(1, 1); //图片右上角
    var t3 = new THREE.Vector2(0, 1); //图片左上角
    var uv1 = [t0, t1, t2]; //选中图片一个三角区域像素——映射到三角面1
    var uv2 = [t0, t2, t3]; //选中图片一个三角区域像素——映射到三角面2
    geometry.faceVertexUvs[0].push(uv1, uv2); //纹理坐标传递给纹理三角面属性
    // 图片加载器
    var ImageLoader = new THREE.ImageLoader();
    // load方法回调函数，按照路径加载图片，返回一个html的元素img对象
    ImageLoader.load(require("../static/1.jpg"), function(img) {
      // image对象作为参数，创建一个纹理对象Texture
      var texture = new THREE.Texture(img);
      // 下次使用纹理时触发更新
      texture.needsUpdate = true;
      var material = new THREE.MeshLambertMaterial({
        map: texture, //设置纹理贴图
        side: THREE.DoubleSide
        // wireframe: true //线框模式渲染
      });
      var mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
      e.add(mesh); //网格模型添加到场景中
    });
  }
  //BufferGeometry自定义顶点UV坐标
  bufferGeometry(e: THREE.Scene) {
    var geometry = new THREE.BufferGeometry(); //声明一个空几何体对象
    //类型数组创建顶点位置position数据
    var vertices = new Float32Array([
      0,
      0,
      0, //顶点1坐标
      80,
      0,
      0, //顶点2坐标
      80,
      80,
      0, //顶点3坐标
      0,
      80,
      0 //顶点4坐标
    ]);
    // 创建属性缓冲区对象
    var attribue = new THREE.BufferAttribute(vertices, 3); //3个为一组
    // 设置几何体attributes属性的位置position属性
    geometry.attributes.position = attribue;
    var normals = new Float32Array([
      0,
      0,
      1, //顶点1法向量
      0,
      0,
      1, //顶点2法向量
      0,
      0,
      1, //顶点3法向量
      0,
      0,
      1 //顶点4法向量
    ]);
    // 设置几何体attributes属性的位置normal属性
    geometry.attributes.normal = new THREE.BufferAttribute(normals, 3); //3个为一组,表示一个顶点的xyz坐标
    // Uint16Array类型数组创建顶点索引数据
    var indexes = new Uint16Array([0, 1, 2, 0, 2, 3]);
    // 索引数据赋值给几何体的index属性
    geometry.index = new THREE.BufferAttribute(indexes, 1); //1个为一组
    /**纹理坐标*/
    var uvs = new Float32Array([
      0,
      0, //图片左下角
      1,
      0, //图片右下角
      1,
      1, //图片右上角
      0,
      1 //图片左上角
    ]);
    // 设置几何体attributes属性的位置normal属性
    geometry.attributes.uv = new THREE.BufferAttribute(uvs, 2); //2个为一组,表示一个顶点的纹理坐标
    // 图片加载器
    var ImageLoader = new THREE.ImageLoader();
    // load方法回调函数，按照路径加载图片，返回一个html的元素img对象
    ImageLoader.load(require("../static/1.jpg"), function(img) {
      // image对象作为参数，创建一个纹理对象Texture
      var texture = new THREE.Texture(img);
      // 下次使用纹理时触发更新
      texture.needsUpdate = true;
      var material = new THREE.MeshLambertMaterial({
        map: texture, //设置纹理贴图
        side: THREE.DoubleSide
        // wireframe: true //线框模式渲染
      });
      var mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
      e.add(mesh); //网格模型添加到场景中
    });
  }
  //数组材质
  materiaArray(e: THREE.Scene) {
    // var geometry = new THREE.BoxGeometry(100, 100, 100); //立方体
    var geometry = new THREE.PlaneGeometry(204, 102, 4, 4); //矩形平面
    // var geometry = new THREE.SphereGeometry(60, 25, 25); //球体
    // var geometry = new THREE.CylinderGeometry(60, 60, 25,25); //圆柱
    //
    console.log(geometry.faces);
    geometry.faces.forEach(elem => {
      console.log(elem.materialIndex);
    });
    // 材质对象1
    var material_1 = new THREE.MeshPhongMaterial({
      color: 0xffff3f
    });
    var textureLoader = new THREE.TextureLoader(); // 纹理加载器
    var texture = textureLoader.load(require("../static/1.jpg")); // 加载图片，返回Texture对象
    // 材质对象2
    var material_2 = new THREE.MeshLambertMaterial({
      map: texture // 设置纹理贴图
      // wireframe:true,
    });
    // 设置材质数组
    var materialArr = [
      material_1,
      material_2,
      material_1,
      material_1,
      material_1,
      material_1
    ];
    // 设置几何体的材质索引(对于PlaneGeometry而言所有Face3的材质索引默认0)
    geometry.faces[4].materialIndex = 1;
    geometry.faces[5].materialIndex = 1;
    // 设置数组材质对象作为网格模型材质参数
    var mesh = new THREE.Mesh(geometry, materialArr); //网格模型对象Mesh
    e.add(mesh); //网格模型添加到场景中
  }
  //草地
  grass(e: THREE.Scene) {
    /**
     * 创建一个地面
     */
    var geometry = new THREE.PlaneGeometry(1000, 1000); //矩形平面
    // 加载树纹理贴图
    var texture = new THREE.TextureLoader().load(
      require("../static/grass.jpg")
    );
    // 设置阵列
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    // uv两个方向纹理重复数量
    texture.repeat.set(10, 10);
    var material = new THREE.MeshLambertMaterial({
      map: texture
    });
    var mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
    e.add(mesh); //网格模型添加到场景中
    mesh.rotateX(-Math.PI / 2);
  }
  //移动的管道
  runs(e: THREE.Scene) {
    /**
     * 创建一个设置重复纹理的管道
     */
    var curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-80, -40, 0),
      new THREE.Vector3(-70, 40, 0),
      new THREE.Vector3(70, 40, 0),
      new THREE.Vector3(80, -40, 0)
    ]);
    var tubeGeometry = new THREE.TubeGeometry(curve, 100, 6, 50, false);
    var textureLoader = new THREE.TextureLoader();
    this.texture = textureLoader.load(require("../static/grass.jpg"));
    // 设置阵列模式为 RepeatWrapping
    this.texture.wrapS = THREE.RepeatWrapping;
    this.texture.wrapT = THREE.RepeatWrapping;
    // 设置x方向的偏移(沿着管道路径方向)，y方向默认1
    //等价texture.repeat= new THREE.Vector2(20,1)
    this.texture.repeat.x = 20;
    var tubeMaterial = new THREE.MeshPhongMaterial({
      map: this.texture,
      transparent: true
    });
    var mesh = new THREE.Mesh(tubeGeometry, tubeMaterial); //网格模型对象Mesh
    e.add(mesh); //网格模型添加到场景中
  }
  canvasBox(canvas: HTMLElement) {
    let c = canvas.getContext("2d");
    // 矩形区域填充背景
    c.fillStyle = "#ff00ff";
    c.fillRect(0, 0, 512, 128);
    c.beginPath();
    // 文字
    c.beginPath();
    c.translate(256, 64);
    c.fillStyle = "#000000"; //文本填充颜色
    c.font = "bold 48px 宋体"; //字体样式设置
    c.textBaseline = "middle"; //文本与fillText定义的纵坐标
    c.textAlign = "center"; //文本居中(以fillText定义的横坐标)
    c.fillText("测试测试Canvas", 0, 0);
  }
  //使用canvas作为照片渲染模型
  writeCanvas(e: THREE.Scene) {
    // canvas画布对象作为CanvasTexture的参数重建一个纹理对象
    // canvas画布可以理解为一张图片
    var canvas = document.getElementById("newCanvas");
    this.canvasBox(canvas);
    var texture = new THREE.CanvasTexture(canvas);
    //打印纹理对象的image属性
    console.log(texture.image);
    //矩形平面
    var geometry = new THREE.PlaneGeometry(128, 50);

    var material = new THREE.MeshPhongMaterial({
      map: texture // 设置纹理贴图
    });
    // 创建一个矩形平面网模型，Canvas画布作为矩形网格模型的纹理贴图
    var mesh = new THREE.Mesh(geometry, material);
    e.add(mesh);
  }
  //视频为纹理
  videoTexture(e: THREE.Scene) {
    // 创建video对象
    let video = document.createElement("video");
    video.src = require("../static/movie.mp4"); // 设置视频地址
    video.autoplay = true; //要设置播放
    // video对象作为VideoTexture参数创建纹理对象
    var texture = new THREE.VideoTexture(video);
    var geometry = new THREE.PlaneGeometry(108, 71); //矩形平面
    var material = new THREE.MeshPhongMaterial({
      map: texture // 设置纹理贴图
    }); //材质对象Material
    var mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
    e.add(mesh); //网格模型添加到场景中
  }
  //法线贴图
  normalMap(e: THREE.Scene) {
    var geometry = new THREE.BoxGeometry(100, 100, 100);
    // TextureLoader创建一个纹理加载器对象，可以加载图片作为几何体纹理
    var textureLoader = new THREE.TextureLoader();
    // 加载法线贴图
    var textureNormal = textureLoader.load(
      require("../static/normal3_256.jpg")
    );
    var material = new THREE.MeshPhongMaterial({
      color: 0xff0000,
      normalMap: textureNormal, //法线贴图
      //设置深浅程度，默认值(1,1)。
      normalScale: new THREE.Vector2(5, 5)
    }); //材质对象Material
    var mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
    e.add(mesh);
  }
  //地球
  eathMap(e: THREE.Scene) {
    var geometry = new THREE.SphereGeometry(100, 25, 25); //球体
    // TextureLoader创建一个纹理加载器对象，可以加载图片作为几何体纹理
    var textureLoader = new THREE.TextureLoader();
    // 加载纹理贴图
    var texture = textureLoader.load(require("../static/Earth.png"));
    // 加载法线贴图
    var textureNormal = textureLoader.load(
      require("../static/EarthNormal.png")
    );
    // 加载高光贴图
    var textureSpecular = textureLoader.load(
      require("../static/EarthSpec.png")
    );

    var material = new THREE.MeshPhongMaterial({
      shininess: 30, //高光部分的亮度，默认30
      specularMap: textureSpecular, //高光贴图
      map: texture, // 普通颜色纹理贴图
      normalMap: textureNormal, //法线贴图
      //设置深浅程度，默认值(1,1)。
      normalScale: new THREE.Vector2(2, 2)
    }); //材质对象Material
    var mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
    e.add(mesh);
  }
  //阴影贴图
  shadowTexture(e: THREE.Scene) {
    //创建一个平面几何体作为投影面
    var planeGeometry = new THREE.PlaneGeometry(300, 200);

    planeGeometry.faceVertexUvs[1] = planeGeometry.faceVertexUvs[0];
    var textureLoader = new THREE.TextureLoader();
    // 加载光照贴图
    var textureLight = textureLoader.load(require("../static/Earth.png"));
    var planeMaterial = new THREE.MeshLambertMaterial({
      color: 0x999999,
      lightMap: textureLight // 设置光照贴图
      // lightMapIntensity:0.5,//烘培光照的强度. 默认 1.
    });
    var planeMesh = new THREE.Mesh(planeGeometry, planeMaterial); //网格模型对象Mesh
    e.add(planeMesh);
  }
  init() {
    const home = document.getElementById("texture");
    // 创建场景对象scene
    this.scene = new THREE.Scene();
    /**添加的各种模型 */
    // this.textrue(this.scene);
    // this.imgLoad(this.scene);
    // this.geometryUV(this.scene);
    // this.bufferGeometry(this.scene);
    // this.materiaArray(this.scene);
    // this.grass(this.scene);
    // this.runs(this.scene);
    // this.writeCanvas(this.scene);
    // this.videoTexture(this.scene);
    // this.normalMap(this.scene);
    this.eathMap(this.scene);
    // this.shadowTexture(this.scene);
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
    // 设置纹理偏移
    if (this.texture) {
      this.texture.offset.x -= 0.06;
    }
  }
}
</script>

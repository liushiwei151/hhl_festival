<template>
  <div id="curve"></div>
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
  mounted() {
    this.init();
  }
  //正常方法绘制圆弧 new一个圆弧出来，使用getPoints获取这个圆弧的顶点，再使用setFromPoints把顶点赋值给geometry模型
  arcCurve(e: THREE.Scene) {
    const geometry = new THREE.Geometry(); //声明一个几何体对象Geometry
    //参数：0, 0圆弧坐标原点x，y  100：圆弧半径    0, 2 * Math.PI：圆弧起始角度
    const arc = new THREE.ArcCurve(0, 0, 100, 0, 2 * Math.PI, false);
    //getPoints是基类Curve的方法，返回一个vector2对象作为元素组成的数组
    const points = arc.getPoints(50); //分段数50，返回51个顶点
    // setFromPoints方法从points中提取数据改变几何体的顶点属性vertices
    geometry.setFromPoints(points);
    //材质对象
    const material = new THREE.LineBasicMaterial({
      color: 0x000000
    });
    //线条模型对象
    var line = new THREE.Line(geometry, material);
    e.add(line); //线条对象添加到场景中
  }
  //非正常方法，直接计算出圆弧的各个点位,然后循环push进geometry的vertices里
  arcCurve1(e: THREE.Scene) {
    const geometry = new THREE.Geometry(); //声明一个几何体对象Geometry
    const R = 100; //圆弧半径
    const N = 50; //分段数量
    // 批量生成圆弧上的顶点数据
    for (var i = 0; i <= N; i++) {
      const angle = ((2 * Math.PI) / N) * i;
      const x = R * Math.sin(angle);
      const y = R * Math.cos(angle);
      geometry.vertices.push(new THREE.Vector3(x, y, 0));
    }
    // 插入最后一个点，line渲染模式下，产生闭合效果
    // geometry.vertices.push(geometry.vertices[0])
    //材质对象
    const material = new THREE.LineBasicMaterial({
      color: 0x000000
    });
    //线条模型对象
    var line = new THREE.Line(geometry, material);
    e.add(line); //线条对象添加到场景中
  }
  //直线，直接给几何体Geometry设置两个顶点数据。
  line(e: THREE.Scene) {
    const geometry = new THREE.Geometry(); //声明一个几何体对象Geometry
    const p1 = new THREE.Vector3(50, 0, 0); //顶点1坐标
    const p2 = new THREE.Vector3(0, 70, 0); //顶点2坐标
    //顶点坐标添加到geometry对象
    geometry.vertices.push(p1, p2);
    const material = new THREE.LineBasicMaterial({
      color: 0xffff00
    }); //材质对象
    //线条模型对象
    const line = new THREE.Line(geometry, material);
    e.add(line); //线条对象添加到场景中
  }
  line1(e: THREE.Scene) {
    const geometry = new THREE.Geometry(); //声明一个几何体对象Geometry
    const geometry1 = new THREE.Geometry(); //声明一个几何体对象Geometry
    const p1 = new THREE.Vector3(75, 0, 0); //顶点1坐标
    const p2 = new THREE.Vector3(0, 110, 0); //顶点2坐标
    // 三维直线LineCurve3
    const LineCurve = new THREE.LineCurve3(p1, p2);
    // 二维直线LineCurve
    const LineCurve1 = new THREE.LineCurve(
      new THREE.Vector2(100, 0),
      new THREE.Vector2(0, 140)
    );
    const pointArr = LineCurve.getPoints(10);
    const pointArr1 = LineCurve1.getPoints(10);
    geometry.setFromPoints(pointArr);
    geometry1.setFromPoints(pointArr1);
    const material = new THREE.LineBasicMaterial({
      color: 0xffff00
    }); //材质对象
    //线条模型对象
    const line = new THREE.Line(geometry, material);
    const line1 = new THREE.Line(geometry1, material);
    e.add(line); //线条对象添加到场景中
    e.add(line1); //线条对象添加到场景中
  }
  //光滑样条曲线
  catmu(e: THREE.Scene) {
    const geometry = new THREE.Geometry(); //声明一个几何体对象Geometry
    // 三维样条曲线  Catmull-Rom算法
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-50, 0, 0),
      new THREE.Vector3(0, 50, 0),
      new THREE.Vector3(0, 0, 50),
      new THREE.Vector3(60, 60, 0),
      new THREE.Vector3(70, 60, 0),
      new THREE.Vector3(-70, 160, 50),
      new THREE.Vector3(70, 160, 50)
    ]);
    //getPoints是基类Curve的方法，返回一个vector3对象作为元素组成的数组
    const points = curve.getPoints(100); //分段数100，返回101个顶点
    // setFromPoints方法从points中提取数据改变几何体的顶点属性vertices
    geometry.setFromPoints(points);
    //材质对象
    const material = new THREE.LineBasicMaterial({
      color: 0x000000
    });
    //线条模型对象
    const line = new THREE.Line(geometry, material);
    e.add(line); //线条对象添加到场景中
  }
  //贝赛尔曲线
  bezier(e: THREE.Scene) {
    const geometry = new THREE.Geometry(); //声明一个几何体对象Geometry
    const geometry1 = new THREE.Geometry(); //声明一个几何体对象Geometry
    const p1 = new THREE.Vector3(-80, 0, 0);
    const p2 = new THREE.Vector3(20, 100, 0);
    const p3 = new THREE.Vector3(80, 0, 0);
    // 三维二次贝赛尔曲线
    const curve = new THREE.QuadraticBezierCurve3(p1, p2, p3);
    const p4 = new THREE.Vector3(-180, 0, 0);
    const p5 = new THREE.Vector3(-140, 100, 0);
    const p6 = new THREE.Vector3(140, 100, 0);
    const p7 = new THREE.Vector3(180, 0, 0);
    // 三维三次贝赛尔曲线
    const curve1 = new THREE.CubicBezierCurve3(p4, p5, p6, p7);
    const points = curve.getPoints(100); //分段数100，返回101个顶点
    const points1 = curve1.getPoints(100); //分段数100，返回101个顶点
    // setFromPoints方法从points中提取数据改变几何体的顶点属性vertices
    geometry.setFromPoints(points);
    geometry1.setFromPoints(points1);
    //材质对象
    const material = new THREE.LineBasicMaterial({
      color: 0x000000
    });
    //线条模型对象
    const line = new THREE.Line(geometry, material);
    const line1 = new THREE.Line(geometry1, material);
    e.add(line); //线条对象添加到场景中
    e.add(line1); //线条对象添加到场景中
  }
  //组合曲线
  curvePath(e: THREE.Scene) {
    const geometry = new THREE.Geometry(); //声明一个几何体对象Geometry
    // 绘制一个U型轮廓
    const R = 80; //圆弧半径
    const arc = new THREE.ArcCurve(0, 0, R, 0, Math.PI, true);
    // 半圆弧的一个端点作为直线的一个端点
    const line1 = new THREE.LineCurve(
      new THREE.Vector2(R, 200),
      new THREE.Vector2(R, 0)
    );
    const line2 = new THREE.LineCurve(
      new THREE.Vector2(-R, 0),
      new THREE.Vector2(-R, 200)
    );
    // 创建组合曲线对象CurvePath
    const CurvePath = new THREE.CurvePath();
    // 把多个线条插入到CurvePath中
    CurvePath.curves.push(line1, arc, line2);
    //分段数200
    const points = CurvePath.getPoints(200);
    // setFromPoints方法从points中提取数据改变几何体的顶点属性vertices
    geometry.setFromPoints(points as THREE.Vector2[]);
    //材质对象
    const material = new THREE.LineBasicMaterial({
      color: 0x000000
    });
    //线条模型对象
    const line = new THREE.Line(geometry, material);
    e.add(line); //线条对象添加到场景中
  }
  //样条曲面生成圆管
  Catmull(e: THREE.Scene) {
    //创建管道成型的路径(3D样条曲线)
    const path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -150, -50),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(8, 50, 50),
      new THREE.Vector3(-5, 0, 100)
    ]);
    // path:路径   40：沿着轨迹细分数  2：管道半径   25：管道截面圆细分数
    const geometry = new THREE.TubeGeometry(path, 100, 20, 25);
    //材质对象
    const material = new THREE.LineBasicMaterial({
      color: 0x000000
      // side: THREE.DoubleSide
    });
    //线条模型对象
    const line = new THREE.Line(geometry, material);
    e.add(line); //线条对象添加到场景中
  }
  //CurvePath多段路径生成管道
  Catmull1(e: THREE.Scene) {
    // 创建多段线条的顶点数据
    const p1 = new THREE.Vector3(-85.35, -35.36);
    const p2 = new THREE.Vector3(-50, 0, 0);
    const p3 = new THREE.Vector3(0, 50, 0);
    const p4 = new THREE.Vector3(50, 0, 0);
    const p5 = new THREE.Vector3(85.35, -35.36);
    // 创建线条一：直线
    const line1 = new THREE.LineCurve3(p1, p2);
    // 重建线条2：三维样条曲线
    const curve = new THREE.CatmullRomCurve3([p2, p3, p4]);
    // 创建线条3：直线
    const line2 = new THREE.LineCurve3(p4, p5);
    const CurvePath = new THREE.CurvePath(); // 创建CurvePath对象
    CurvePath.curves.push(line1, curve, line2); // 插入多段线条
    //通过多段曲线路径创建生成管道
    //通过多段曲线路径创建生成管道，CCurvePath：管道路径
    const geometry2 = new THREE.TubeGeometry(CurvePath, 100, 5, 25, false);
    //材质对象
    const material = new THREE.LineBasicMaterial({
      color: 0x000000
      // side: THREE.DoubleSide
    });
    //线条模型对象
    const line = new THREE.Line(geometry2, material);
    e.add(line); //线条对象添加到场景中
  }
  //旋转造型LatheGeometry
  latheGeometry(e: THREE.Scene) {
    /**
     * 创建旋转网格模型
     */
    const points = [
      new THREE.Vector2(50, 60),
      new THREE.Vector2(50, 0),
      new THREE.Vector2(50, -60)
    ];
    const geometry = new THREE.LatheGeometry(points, 10);
    const material = new THREE.MeshPhongMaterial({
      color: 0x0000ff, //三角面颜色
      side: THREE.DoubleSide //两面可见
    }); //材质对象
    material.wireframe = true; //线条模式渲染(查看细分数)
    const mesh = new THREE.Mesh(geometry, material); //旋转网格模型对象
    e.add(mesh); //旋转网格模型添加到场景中
  }
  //样条曲线插值计算
  splineThru(e: THREE.Scene) {
    const shape = new THREE.Shape(); //创建Shape对象
    const points = [
      //定位定点
      new THREE.Vector2(50, 60),
      new THREE.Vector2(25, 0),
      new THREE.Vector2(50, -60)
    ];
    shape.splineThru(points); //顶点带入样条插值计算函数
    var splinePoints = shape.getPoints(20); //插值计算细分数20
    var geometry = new THREE.LatheGeometry(splinePoints, 30); //旋转造型
    const material = new THREE.MeshPhongMaterial({
      color: 0x0000ff, //三角面颜色
      side: THREE.DoubleSide //两面可见
    }); //材质对象
    // material.wireframe = true; //线条模式渲染(查看细分数)
    const mesh = new THREE.Mesh(geometry, material); //旋转网格模型对象
    e.add(mesh); //旋转网格模型添加到场景中
  }
  //shape轮廓填充
  shape(e: THREE.Scene) {
    const points = [
      new THREE.Vector2(-50, -50),
      new THREE.Vector2(-60, 0),
      new THREE.Vector2(0, 50),
      new THREE.Vector2(60, 0),
      new THREE.Vector2(50, -50),
      new THREE.Vector2(-50, -50)
    ];
    // 通过shpae基类path的方法绘制轮廓（本质也是生成顶点）
    const shape = new THREE.Shape();
    // 四条直线绘制一个矩形轮廓
    shape.moveTo(10, 10); //起点
    shape.lineTo(10, 100); //第2点
    shape.lineTo(100, 100); //第3点
    shape.lineTo(100, 10); //第4点
    shape.lineTo(10, 10); //第5点
    // 通过顶点定义轮廓
    // const shape = new THREE.Shape();
    // const shape = new THREE.Shape(points);
    // shape.absarc(0, 0, 100, 0, 2 * Math.PI, false); //圆弧轮廓
    // console.log(shape.getPoints(15)); //查看shape顶点数据
    // shape可以理解为一个需要填充轮廓
    // 所谓填充：ShapeGeometry算法利用顶点计算出三角面face3数据填充轮廓
    const geometry = new THREE.ShapeGeometry(shape, 10);
    const material = new THREE.MeshPhongMaterial({
      color: 0x0000ff, //三角面颜色
      side: THREE.DoubleSide, //两面可见
      wireframe: true
    }); //材质对象
    // material.wireframe = true; //线条模式渲染(查看细分数)
    const mesh = new THREE.Mesh(geometry, material); //旋转网格模型对象
    e.add(mesh); //旋转网格模型添加到场景中
  }
  shape1(e: THREE.Scene) {
    // 圆弧与直线连接
    var shape = new THREE.Shape(); //Shape对象
    var R = 50;
    // 绘制一个半径为R、圆心坐标(0, 0)的半圆弧
    shape.absarc(0, 0, R, 0, Math.PI, false);
    //从圆弧的一个端点(-R, 0)到(-R, -200)绘制一条直线
    shape.lineTo(-R, -200);
    // 绘制一个半径为R、圆心坐标(0, -200)的半圆弧
    shape.absarc(0, -200, R, Math.PI, 2 * Math.PI, false);
    //从圆弧的一个端点(R, -200)到(-R, -200)绘制一条直线
    shape.lineTo(R, 0);
    var geometry = new THREE.ShapeGeometry(shape, 30);
    const material = new THREE.MeshPhongMaterial({
      color: 0x0000ff, //三角面颜色
      side: THREE.DoubleSide //两面可见
      // wireframe: true
    }); //材质对象
    // material.wireframe = true; //线条模式渲染(查看细分数)
    const mesh = new THREE.Mesh(geometry, material); //旋转网格模型对象
    e.add(mesh); //旋转网格模型添加到场景中
  }
  shape2(e: THREE.Scene) {
    // 一个外轮廓圆弧嵌套三个内圆弧轮廓
    var shape = new THREE.Shape(); //Shape对象
    //外轮廓
    shape.arc(0, 0, 100, 0, 2 * Math.PI, false);
    // 内轮廓1
    var path1 = new THREE.Path();
    path1.arc(0, 0, 40, 0, 2 * Math.PI, false);
    // 内轮廓2
    var path2 = new THREE.Path();
    path2.arc(80, 0, 10, 0, 2 * Math.PI, false);
    // 内轮廓3
    var path3 = new THREE.Path();
    path3.arc(-80, 0, 10, 0, 2 * Math.PI, false);
    //三个内轮廓分别插入到holes属性中
    shape.holes.push(path1, path2, path3);
    var geometry = new THREE.ShapeGeometry(shape, 30);
    const material = new THREE.MeshPhongMaterial({
      color: 0x0000ff, //三角面颜色
      side: THREE.DoubleSide //两面可见
      // wireframe: true
    }); //材质对象
    // material.wireframe = true; //线条模式渲染(查看细分数)
    const mesh = new THREE.Mesh(geometry, material); //旋转网格模型对象
    e.add(mesh); //旋转网格模型添加到场景中
  }
  shape3(e: THREE.Scene) {
    // 矩形嵌套矩形或圆弧
    var shape = new THREE.Shape(); //Shape对象
    //外轮廓
    shape.moveTo(0, 0); //起点
    shape.lineTo(0, 100); //第2点
    shape.lineTo(100, 100); //第3点
    shape.lineTo(100, 0); //第4点
    shape.lineTo(0, 0); //第5点

    //内轮廓
    var path = new THREE.Path(); //path对象
    // path.arc(50,50,40,0,2*Math.PI);//圆弧
    path.moveTo(20, 20); //起点
    path.lineTo(20, 80); //第2点
    path.lineTo(80, 80); //第3点
    path.lineTo(80, 20); //第4点
    path.lineTo(20, 20); //第5点
    shape.holes.push(path); //设置内轮廓
    var geometry = new THREE.ShapeGeometry(shape, 30);
    const material = new THREE.MeshPhongMaterial({
      color: 0x0000ff, //三角面颜色
      side: THREE.DoubleSide //两面可见
      // wireframe: true
    }); //材质对象
    // material.wireframe = true; //线条模式渲染(查看细分数)
    const mesh = new THREE.Mesh(geometry, material); //旋转网格模型对象
    e.add(mesh); //旋转网格模型添加到场景中
  }
  shape4(e: THREE.Scene) {
    // 轮廓对象1
    var shape = new THREE.Shape();
    shape.arc(-50, 0, 30, 0, 2 * Math.PI, false);
    // 轮廓对象2
    var shape2 = new THREE.Shape();
    shape2.arc(50, 0, 30, 0, 2 * Math.PI, false);
    // 轮廓对象3
    var shape3 = new THREE.Shape();
    shape3.arc(0, 50, 30, 0, 2 * Math.PI, false);
    // 多个shape作为元素组成数组,每一个shpae可以理解为一个要填充的轮廓
    var geometry = new THREE.ShapeGeometry([shape, shape2, shape3], 30);
    const material = new THREE.MeshPhongMaterial({
      color: 0x0000ff, //三角面颜色
      side: THREE.DoubleSide //两面可见
      // wireframe: true
    }); //材质对象
    // material.wireframe = true; //线条模式渲染(查看细分数)
    const mesh = new THREE.Mesh(geometry, material); //旋转网格模型对象
    e.add(mesh); //旋转网格模型添加到场景中
  }
  //拉伸扫描成型ExtrudeGeometry
  extrudeGeometry(e: THREE.Scene) {
    /**
     * 创建拉伸网格模型
     */
    var shape = new THREE.Shape();
    /**四条直线绘制一个矩形轮廓*/
    shape.moveTo(0, 0); //起点
    shape.lineTo(0, 100); //第2点
    shape.lineTo(100, 100); //第3点
    shape.lineTo(100, 0); //第4点
    shape.lineTo(0, 0); //第5点
    var geometry = new THREE.ExtrudeGeometry( //拉伸造型
      shape, //二维轮廓
      //拉伸参数
      {
        amount: 120, //拉伸长度
        bevelEnabled: true //无倒角
      }
    );
    var material = new THREE.MeshPhongMaterial({
      color: 0x0000ff,
      size: 5.0 //点对象像素尺寸
    }); //材质对象
    var mesh = new THREE.Mesh(geometry, material); //点模型对象
    e.add(mesh); //点模型添加到场景中
  }
  //不规则拉伸
  extrudeGeometry1(e: THREE.Scene) {
    /**
     * 创建扫描网格模型
     */
    var shape = new THREE.Shape();
    /**四条直线绘制一个矩形轮廓*/
    shape.moveTo(0, 0); //起点
    shape.lineTo(0, 10); //第2点
    shape.lineTo(10, 10); //第3点
    shape.lineTo(10, 0); //第4点
    shape.lineTo(0, 0); //第5点
    /**创建轮廓的扫描轨迹(3D样条曲线)*/
    var curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-10, -50, -50),
      new THREE.Vector3(10, 0, 0),
      new THREE.Vector3(8, 50, 50),
      new THREE.Vector3(-5, 0, 100)
    ]);
    var geometry = new THREE.ExtrudeGeometry( //拉伸造型
      shape, //二维轮廓
      //拉伸参数
      {
        bevelEnabled: false, //无倒角
        extrudePath: curve, //选择扫描轨迹
        steps: 50 //扫描方向细分数
      }
    );
    var material = new THREE.MeshPhongMaterial({
      color: 0x0000ff
    }); //材质对象
    var mesh = new THREE.Mesh(geometry, material); //点模型对象
    e.add(mesh); //点模型添加到场景中
  }
  init() {
    const home = document.getElementById("curve");
    // 创建场景对象scene
    this.scene = new THREE.Scene();
    /**添加的各种模型 */
    this.arcCurve1(this.scene);
    this.line1(this.scene);
    this.catmu(this.scene);
    this.bezier(this.scene);
    this.curvePath(this.scene);
    this.Catmull(this.scene);
    this.Catmull1(this.scene);
    this.latheGeometry(this.scene);
    this.splineThru(this.scene);
    this.shape(this.scene);
    this.shape1(this.scene);
    this.shape2(this.scene);
    this.shape3(this.scene);
    this.shape4(this.scene);
    this.extrudeGeometry(this.scene);
    this.extrudeGeometry1(this.scene);
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
  }
}
</script>

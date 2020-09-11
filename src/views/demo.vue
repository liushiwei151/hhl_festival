<template>
  <div id="container">
    <script id="fragmentShaderNoise" type="x-shader/x-fragment">

      //
      // Description : Array and textureless GLSL 3D simplex noise function.
      //      Author : Ian McEwan, Ashima Arts.
      //  Maintainer : ijm
      //     Lastmod : 20110409 (stegu)
      //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
      //               Distributed under the MIT License. See LICENSE file.
      //

      uniform float time;
      varying vec2 vUv;

      vec4 permute( vec4 x ) {

      	return mod( ( ( x * 34.0 ) + 1.0 ) * x, 289.0 );

      }

      vec4 taylorInvSqrt( vec4 r ) {

      	return 1.79284291400159 - 0.85373472095314 * r;

      }

      float snoise( vec3 v ) {

      	const vec2 C = vec2( 1.0 / 6.0, 1.0 / 3.0 );
      	const vec4 D = vec4( 0.0, 0.5, 1.0, 2.0 );

      	// First corner

      	vec3 i  = floor( v + dot( v, C.yyy ) );
      	vec3 x0 = v - i + dot( i, C.xxx );

      	// Other corners

      	vec3 g = step( x0.yzx, x0.xyz );
      	vec3 l = 1.0 - g;
      	vec3 i1 = min( g.xyz, l.zxy );
      	vec3 i2 = max( g.xyz, l.zxy );

      	vec3 x1 = x0 - i1 + 1.0 * C.xxx;
      	vec3 x2 = x0 - i2 + 2.0 * C.xxx;
      	vec3 x3 = x0 - 1. + 3.0 * C.xxx;

      	// Permutations

      	i = mod( i, 289.0 );
      	vec4 p = permute( permute( permute(
      			 i.z + vec4( 0.0, i1.z, i2.z, 1.0 ) )
      		   + i.y + vec4( 0.0, i1.y, i2.y, 1.0 ) )
      		   + i.x + vec4( 0.0, i1.x, i2.x, 1.0 ) );

      	// Gradients
      	// ( N*N points uniformly over a square, mapped onto an octahedron.)

      	float n_ = 1.0 / 7.0; // N=7

      	vec3 ns = n_ * D.wyz - D.xzx;

      	vec4 j = p - 49.0 * floor( p * ns.z *ns.z );  //  mod(p,N*N)

      	vec4 x_ = floor( j * ns.z );
      	vec4 y_ = floor( j - 7.0 * x_ );    // mod(j,N)

      	vec4 x = x_ *ns.x + ns.yyyy;
      	vec4 y = y_ *ns.x + ns.yyyy;
      	vec4 h = 1.0 - abs( x ) - abs( y );

      	vec4 b0 = vec4( x.xy, y.xy );
      	vec4 b1 = vec4( x.zw, y.zw );


      	vec4 s0 = floor( b0 ) * 2.0 + 1.0;
      	vec4 s1 = floor( b1 ) * 2.0 + 1.0;
      	vec4 sh = -step( h, vec4( 0.0 ) );

      	vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
      	vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

      	vec3 p0 = vec3( a0.xy, h.x );
      	vec3 p1 = vec3( a0.zw, h.y );
      	vec3 p2 = vec3( a1.xy, h.z );
      	vec3 p3 = vec3( a1.zw, h.w );

      	// Normalise gradients

      	vec4 norm = taylorInvSqrt( vec4( dot( p0, p0 ), dot( p1, p1 ), dot( p2, p2 ), dot( p3, p3 ) ) );
      	p0 *= norm.x;
      	p1 *= norm.y;
      	p2 *= norm.z;
      	p3 *= norm.w;

      	// Mix final noise value

      	vec4 m = max( 0.6 - vec4( dot( x0, x0 ), dot( x1, x1 ), dot( x2, x2 ), dot( x3, x3 ) ), 0.0 );
      	m = m * m;
      	return 42.0 * dot( m*m, vec4( dot( p0, x0 ), dot( p1, x1 ),
      								  dot( p2, x2 ), dot( p3, x3 ) ) );

      }

      float surface3( vec3 coord ) {

      	float n = 0.0;

      	n += 1.0 * abs( snoise( coord ) );
      	n += 0.5 * abs( snoise( coord * 2.0 ) );
      	n += 0.25 * abs( snoise( coord * 4.0 ) );
      	n += 0.125 * abs( snoise( coord * 8.0 ) );

      	return n;

      }

      void main( void ) {

      	vec3 coord = vec3( vUv, -time );
      	float n = surface3( coord );

      	gl_FragColor = vec4( vec3( n, n, n ), 1.0 );

      }
    </script>

    <script id="vertexShader" type="x-shader/x-vertex">

      varying vec2 vUv;
      uniform vec2 scale;
      uniform vec2 offset;

      void main( void ) {

      	vUv = uv * scale + offset;
      	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

      }
    </script>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as THREE from "three";
const orienter = require("../common/orienter.js");
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import { NormalMapShader } from "three/examples/jsm/shaders/NormalMapShader.js";
const TerrainShader = require("../common/TerrainShader.js");
const Stats = require("../common/stats.module.js");
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils.js";
@Component({})
export default class container extends Vue {
  //场景
  scene: THREE.Scene | null = null;
  //相机
  camera: THREE.PerspectiveCamera | null = null;
  //矩形模型
  mesh: THREE.Mesh | null = null;
  terrain: THREE.Mesh | null = null;
  //渲染对象
  renderer: THREE.WebGLRenderer | null = null;
  controls: OrbitControls | null = null;
  //是否开始陀螺仪
  isStart = false;
  //计算出的陀螺仪移动距离
  lons = 0;
  lat = 0;
  //相机当前朝向坐标
  lookat!: THREE.Vector3;
  //是否显示首页
  isShowPage = true;
  //开启教学动画
  isTeachAnimation = false;
  //当前时间
  nowDate = Number(new Date());
  SCREEN_WIDTH = window.innerWidth;
  SCREEN_HEIGHT = window.innerHeight;
  lightVal = 0;
  lightDir = 1;
  clock = new THREE.Clock();
  directionalLight: THREE.DirectionalLight | null = null;
  pointLight: THREE.PointLight | null = null;
  updateNoise = true;
  uniformsTerrain: any;
  mlib: any = {};
  animDelta = 0;
  animDeltaDir = -1;
  uniformsNoise: any;
  quadTarget: any;
  heightMap: any;
  sceneRenderTarget: any;
  cameraOrtho: any;
  normalMap: any;

  mounted() {
    this.init();
    this.animate();
  }
  animate() {
    requestAnimationFrame(this.animate);

    this.renders();
    Stats.default.Panel().update();
  }
  init() {
    const container = document.getElementById("container");
    // SCENE (RENDER TARGET)
    this.sceneRenderTarget = new THREE.Scene();
    this.cameraOrtho = new THREE.OrthographicCamera(
      this.SCREEN_WIDTH / -2,
      this.SCREEN_WIDTH / 2,
      this.SCREEN_HEIGHT / 2,
      this.SCREEN_HEIGHT / -2,
      -10000,
      10000
    );
    this.cameraOrtho.position.z = 100;
    this.sceneRenderTarget.add(this.cameraOrtho);
    // CAMERA

    this.camera = new THREE.PerspectiveCamera(
      40,
      this.SCREEN_WIDTH / this.SCREEN_HEIGHT,
      2,
      4000
    );
    this.camera.position.set(-1200, 800, 1200);
    // SCENE (FINAL)
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x050505);
    this.scene.fog = new THREE.Fog(0x050505, 2000, 4000);
    // LIGHTS
    this.scene.add(new THREE.AmbientLight(0x111111));
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.15);
    this.directionalLight.position.set(500, 2000, 0);
    this.scene.add(this.directionalLight);
    this.pointLight = new THREE.PointLight(0xff4400, 1.5);
    this.pointLight.position.set(0, 0, 0);
    this.scene.add(this.pointLight);
    // HEIGHT + NORMAL MAPS

    const normalShader = NormalMapShader;

    const rx = 256,
      ry = 256;
    const pars = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBFormat
    };

    this.heightMap = new THREE.WebGLRenderTarget(rx, ry, pars);
    this.heightMap.texture.generateMipmaps = false;

    this.normalMap = new THREE.WebGLRenderTarget(rx, ry, pars);
    this.normalMap.texture.generateMipmaps = false;

    this.uniformsNoise = {
      time: { value: 1.0 },
      scale: { value: new THREE.Vector2(1.5, 1.5) },
      offset: { value: new THREE.Vector2(0, 0) }
    };
    const uniformsNormal = THREE.UniformsUtils.clone(normalShader.uniforms);
    uniformsNormal["height"].value = 0.05;
    uniformsNormal["resolution"].value.set(rx, ry);
    uniformsNormal["heightMap"].value = this.heightMap.texture;
    const vertexShader = (document.getElementById(
      "vertexShader"
    ) as HTMLElement).textContent;
    // TEXTURES
    const self = this;
    var loadingManager = new THREE.LoadingManager(function() {
      if (self.terrain !== null) {
        self.terrain.visible = true;
      }
    });
    var textureLoader = new THREE.TextureLoader(loadingManager);
    var specularMap = new THREE.WebGLRenderTarget(2048, 2048, pars);
    specularMap.texture.generateMipmaps = false;
    var diffuseTexture1 = textureLoader.load(
      "../static/terrain/grasslight-big.jpg"
    );
    var diffuseTexture2 = textureLoader.load(
      "../static/terrain/backgrounddetailed6.jpg"
    );
    var detailTexture = textureLoader.load(
      "../static/terrain/grasslight-big-nm.jpg"
    );
    diffuseTexture1.wrapS = diffuseTexture1.wrapT = THREE.RepeatWrapping;
    diffuseTexture2.wrapS = diffuseTexture2.wrapT = THREE.RepeatWrapping;
    detailTexture.wrapS = detailTexture.wrapT = THREE.RepeatWrapping;
    specularMap.texture.wrapS = specularMap.texture.wrapT =
      THREE.RepeatWrapping;
    // TERRAIN SHADER

    var terrainShader = TerrainShader.TerrainShader;
    this.uniformsTerrain = THREE.UniformsUtils.clone(terrainShader.uniforms);
    this.uniformsTerrain["tNormal"].value = this.normalMap.texture;
    this.uniformsTerrain["uNormalScale"].value = 3.5;

    this.uniformsTerrain["tDisplacement"].value = this.heightMap.texture;

    this.uniformsTerrain["tDiffuse1"].value = diffuseTexture1;
    this.uniformsTerrain["tDiffuse2"].value = diffuseTexture2;
    this.uniformsTerrain["tSpecular"].value = specularMap.texture;
    this.uniformsTerrain["tDetail"].value = detailTexture;

    this.uniformsTerrain["enableDiffuse1"].value = true;
    this.uniformsTerrain["enableDiffuse2"].value = true;
    this.uniformsTerrain["enableSpecular"].value = true;

    this.uniformsTerrain["diffuse"].value.setHex(0xffffff);
    this.uniformsTerrain["specular"].value.setHex(0xffffff);

    this.uniformsTerrain["shininess"].value = 30;

    this.uniformsTerrain["uDisplacementScale"].value = 375;

    this.uniformsTerrain["uRepeatOverlay"].value.set(6, 6);
    if (document.getElementById("fragmentShaderNoise") === null) return;
    var params = [
      [
        "heightmap",
        (document.getElementById("fragmentShaderNoise") as HTMLElement)
          .textContent,
        vertexShader,
        this.uniformsNoise,
        false
      ],
      [
        "normal",
        normalShader.fragmentShader,
        normalShader.vertexShader,
        uniformsNormal,
        false
      ],
      [
        "terrain",
        terrainShader.fragmentShader,
        terrainShader.vertexShader,
        this.uniformsTerrain,
        true
      ]
    ];
    for (var i = 0; i < params.length; i++) {
      console.log(this.mlib);
      var material = new THREE.ShaderMaterial({
        uniforms: params[i][3],
        vertexShader: params[i][2],
        fragmentShader: params[i][1],
        lights: params[i][4],
        fog: true
      });
      this.mlib[params[i][0]] = material;
    }

    var plane = new THREE.PlaneBufferGeometry(
      this.SCREEN_WIDTH,
      this.SCREEN_HEIGHT
    );

    this.quadTarget = new THREE.Mesh(
      plane,
      new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    this.quadTarget.position.z = -500;
    this.sceneRenderTarget.add(this.quadTarget);
    // TERRAIN MESH

    var geometryTerrain = new THREE.PlaneBufferGeometry(6000, 6000, 256, 256);

    BufferGeometryUtils.computeTangents(geometryTerrain);

    this.terrain = new THREE.Mesh(geometryTerrain, this.mlib["terrain"]);
    this.terrain.position.set(0, -125, 0);
    this.terrain.rotation.x = -Math.PI / 2;
    this.terrain.visible = false;
    this.scene.add(this.terrain);

    // RENDERER

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
    (container as HTMLElement).appendChild(this.renderer.domElement);

    // CONTROLS

    const controls = new OrbitControls(this.camera, this.renderer.domElement);

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    controls.keys = [65, 83, 68];
  }
  renders() {
    var delta = this.clock.getDelta();
    if (
      this.scene === null ||
      this.scene.fog === null ||
      this.directionalLight === null ||
      this.pointLight === null ||
      this.renderer === null ||
      this.camera === null
    )
      return;
    if (this.terrain && this.terrain.visible) {
      var fLow = 0.1,
        fHigh = 0.8;

      const lightVal = THREE.MathUtils.clamp(
        this.lightVal + 0.5 * delta * this.lightDir,
        fLow,
        fHigh
      );

      var valNorm = (lightVal - fLow) / (fHigh - fLow);

      (this.scene.background as THREE.Color).setHSL(0.1, 0.5, lightVal);
      this.scene.fog.color.setHSL(0.1, 0.5, lightVal);

      this.directionalLight.intensity = THREE.MathUtils.mapLinear(
        valNorm,
        0,
        1,
        0.1,
        1.15
      );
      this.pointLight.intensity = THREE.MathUtils.mapLinear(
        valNorm,
        0,
        1,
        0.9,
        1.5
      );

      this.uniformsTerrain["uNormalScale"].value = THREE.MathUtils.mapLinear(
        valNorm,
        0,
        1,
        0.6,
        3.5
      );

      if (this.updateNoise) {
        this.animDelta = THREE.MathUtils.clamp(
          this.animDelta + 0.00075 * this.animDeltaDir,
          0,
          0.05
        );
        this.uniformsNoise["time"].value += delta * this.animDelta;

        this.uniformsNoise["offset"].value.x += delta * 0.05;

        this.uniformsTerrain["uOffset"].value.x =
          4 * this.uniformsNoise["offset"].value.x;

        this.quadTarget.material = this.mlib["heightmap"];
        this.renderer.setRenderTarget(this.heightMap);
        this.renderer.clear();
        this.renderer.render(this.sceneRenderTarget, this.cameraOrtho);

        this.quadTarget.material = this.mlib["normal"];
        this.renderer.setRenderTarget(this.normalMap);
        this.renderer.clear();
        this.renderer.render(this.sceneRenderTarget, this.cameraOrtho);
      }

      this.renderer.setRenderTarget(null);
      this.renderer.render(this.scene, this.camera);
    }
  }
}
</script>
<style lang="less" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
#home {
  overflow: hidden;
}
</style>

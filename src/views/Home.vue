<template>
  <div class="home">
    <div id="container"></div>
  </div>
</template>

<script lang="ts">
import * as Three from "three";
import { Component, Vue } from "vue-property-decorator";
@Component({})
export default class Home extends Vue {
  camera: any;
  scene: any;
  renderer: any;
  mesh: any;

  mounted(): void {
    this.init();
    this.animate();
  }
  init() {
    let container = document.getElementById("container");

    this.camera = new Three.PerspectiveCamera(
      70,
      (container as HTMLElement).clientWidth /
        (container as HTMLElement).clientHeight,
      0.01,
      10
    );
    this.camera.position.z = 1;

    this.scene = new Three.Scene();

    let geometry = new Three.BoxGeometry(0.2, 0.2, 0.2);
    let material = new Three.MeshNormalMaterial();

    this.mesh = new Three.Mesh(geometry, material);
    this.scene.add(this.mesh);

    this.renderer = new Three.WebGLRenderer({ antialias: true });
    this.renderer.setSize(
      (container as HTMLElement).clientWidth,
      (container as HTMLElement).clientHeight
    );
    (container as HTMLElement).appendChild(this.renderer.domElement);
  }
  animate() {
    requestAnimationFrame(this.animate);
    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.02;
    this.renderer.render(this.scene, this.camera);
  }
}
</script>
<style lang="less">
#container {
  height: 400px;
}
</style>

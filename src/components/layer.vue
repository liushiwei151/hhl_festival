<template>
  <div class="layer">
    <div v-if="layerValue" class="text">{{ value }}</div>
    <!-- wait -->
    <div v-if="!layerValue" class="box">
      <div class="wait"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
@Component({})
export default class Layer extends Vue {
  @Prop() value!: string | null;

  get layerValue(): boolean {
    if (this.value === "wait") {
      return false;
    }
    return true;
  }
  mounted(): void {}
}
</script>
<style lang="less" scoped>
.layer {
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .text {
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
    padding: 3vw;
  }
  .box {
    background-color: rgba(0, 0, 0, 0.5);
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    .wait {
      background: url(../static/pageBox/loading-1.gif) no-repeat;
      background-size: 100% 100%;
      width: 15vw;
      height: 15vw;
    }
  }
}
</style>

<template>
  <div class="loading">{{ imgNum[0] }}/{{ imgNum[1] }}</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class Loading extends Vue {
  @Prop() imgNum!: number[];
}
</script>
<style lang="less" scoped>
.loading {
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  z-index: 100;
  color: #fff;
}
</style>

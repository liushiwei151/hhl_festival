<template>
  <div class="showPopup" @click.self="closePopup(1)">
    <div class="actRule">
      <div @click.stop="closePopup(2)"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit } from "vue-property-decorator";
@Component({})
export default class showPopup extends Vue {
  @Emit("popupClick") closePopups(e: string) {}
  closePopup(e: string) {
    this.closePopups(e);
  }
}
</script>
<style lang="less" scope>
.showPopup {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 20;
  display: flex;
  justify-content: center;
  align-items: center;
  .actRule {
    background: url(../assets/actRule.png) no-repeat;
    background-size: 100% 100%;
    width: 85vw;
    height: 85vh;
    position: relative;
    div {
      background: url(../assets/rule_button.png) no-repeat;
      background-size: 100% 100%;
      width: 10vw;
      height: 10vw;
      position: absolute;
      top: 0;
      right: -5vw;
    }
  }
}
</style>

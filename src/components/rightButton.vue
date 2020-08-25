<template>
  <div class="rightButton">
    <div class="buttonBox">
      <i
        v-for="item in showButtonName"
        :key="item"
        @click="resultClick(item)"
        :class="[
          item === 'myMoonCake' && isShowShadow ? 'shadow ' + item : item
        ]"
      ></i>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
@Component({})
export default class rightButton extends Vue {
  @Prop() showButtonName!: string[];
  @Prop() isShowShadow!: boolean;
  @Emit("result") resultClicks(e: string) {}
  resultClick(e: string) {
    this.resultClicks(e);
  }
}
</script>
<style lang="less" scope>
.buttonBox {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 3vw;
  top: 3vw;
  z-index: 10;
  .rule {
    background-image: url(../assets/rule.png);
  }
  .myMoonCake {
    background-image: url(../assets/myMoonCake.png);
  }
  .rank {
    background-image: url(../assets/rank.png);
  }
  .shadow {
    box-shadow: 0 0 20px #fff;
    border-radius: 50%;
  }
  i {
    display: block;
    width: 13vw;
    height: 13vw;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    margin-bottom: 1vh;
  }
}
</style>

<template>
  <div class="toast">
    <p v-show="msg !== 'wait'">{{ msg }}</p>
    <div class="wait" v-show="msg === 'wait'"><div></div></div>
  </div>
</template>
<script>
export default {
  name: "Toast",
  data() {
    return {
      msg: "",
      duration: 3000
    };
  },
  mounted() {
    setTimeout(() => {
      // 3s 后通过父级移除子元素的方式来移除该组件
      if (this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el);
      }
    }, this.duration);
  }
};
</script>
<style lang="less" scoped>
.toast {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  color: #fff;
  z-index: 9999;
  background: transparent;
  .wait {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    div {
      background: url(../../assets/loading-1.gif) no-repeat;
      background-size: 100% 100%;
      width: 10vw;
      height: 10vw;
    }
  }
  p {
    padding: 12px 22px;
    font-size: 18px;
    border-radius: 4px;
    background: rgba(17, 17, 17, 0.7);
  }
}
</style>

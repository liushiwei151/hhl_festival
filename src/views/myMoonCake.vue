<template>
  <div class="myMoonCake"></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

interface cakeObjData {
  name: string;
  imgName: string;
  num: number;
}
@Component({})
export default class myMoonCake extends Vue {
  cakeObj: cakeObjData[] = [
    {
      name: "楼楼蛋黄月饼",
      imgName: require("../assets/myMoonCake/yolk_cake.png"),
      num: 0
    },
    {
      name: "楼楼豆沙月饼",
      imgName: require("../assets/myMoonCake/dousha_cake.png"),
      num: 0
    },
    {
      name: "楼楼五仁月饼",
      imgName: require("../assets/myMoonCake/wuren_cake.png"),
      num: 0
    },
    {
      name: "楼楼莲蓉月饼",
      imgName: require("../assets/myMoonCake/lotus_seed_cake.png"),
      num: 0
    },
    {
      name: "黄鹤楼蛋黄月饼",
      imgName: require("../assets/myMoonCake/hhl_yolk_cake.png"),
      num: 0
    },
    {
      name: "黄鹤楼豆沙月饼",
      imgName: require("../assets/myMoonCake/hhl_dousha_cake.png"),
      num: 0
    },
    {
      name: "黄鹤楼五仁月饼",
      imgName: require("../assets/myMoonCake/hhl_wuren_cake.png"),
      num: 0
    },
    {
      name: "黄鹤楼莲蓉月饼",
      imgName: require("../assets/myMoonCake/hhl_lotus_seed_cake.png"),
      num: 0
    }
  ];
}
</script>
<style lang="less" scope>
.myMoonCake {
  background: url(../assets/myMoonCake/my_bg.png) no-repeat;
  background-size: 100% 100%;
  width: 100vw;
  height: 100vh;
}
</style>

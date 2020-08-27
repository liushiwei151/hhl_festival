<template>
  <div class="myMoonCake-web">
    <ul>
      <li
        v-for="(item, index) in cakeObj"
        :key="item.name"
        @click="choseCake(item)"
      >
        <div
          class="img"
          :style="{ backgroundImage: 'url(' + item.imgName + ')' }"
        ></div>
        <div class="fontBox">
          <div class="fontColor">{{ item.name }} ×{{ item.num }}</div>
          <div
            class="fontConfirem"
            :class="{ fontYes: choseCakeData.indexOf(item.name) > -1 }"
          ></div>
        </div>
      </li>
    </ul>
    <button
      class="syntheticGift"
      :class="{ gray: !isClickSyntheticGift }"
    ></button>
  </div>
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
  //月饼对象
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
  //选中的月饼
  choseCakeData: string[] = [];
  //按钮只有在选中四个的时候能点击
  get isClickSyntheticGift(): boolean {
    if (this.choseCakeData.length === 4) {
      return true;
    }
    return false;
  }
  //选取月饼
  choseCake(e: cakeObjData) {
    let index = this.choseCakeData.indexOf(e.name);
    if (index > -1) {
      this.choseCakeData.splice(index, 1);
    } else {
      if (this.choseCakeData.length >= 4) {
        this.choseCakeData.shift();
      }
      this.choseCakeData.push(e.name);
    }
  }
}
</script>
<style lang="less" scope>
.myMoonCake-web {
  background: url(../assets/myMoonCake/my_bg.png) no-repeat;
  background-size: 100% 100%;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  box-sizing: border-box;
  padding-top: 8vh;
  .gray {
    filter: grayscale(100%);
  }
  .syntheticGift {
    border: none;
    outline: none;
    background: url(../assets/myMoonCake/syntheticGift.png) no-repeat;
    background-size: 100% 100%;
    width: 35vw;
    height: 15vw;
  }
  ul {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    box-sizing: border-box;
    padding-left: 5vw;
  }
  li {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 40vw;
  }
  .img {
    background-size: 100% 100%;
    background-repeat: no-repeat;
    width: 30vw;
    height: 20vw;
  }
  .fontBox {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1vh 0;
    .fontColor {
      color: rgb(224, 133, 118);
      font-size: 3vw;
      margin-right: 1vw;
    }
    .fontConfirem {
      border: solid 1px rgb(224, 133, 118);
      width: 3vw;
      height: 3vw;
    }
    .fontYes {
      background: url(../assets/moonCake/yes.png) no-repeat;
      background-size: 100% 100%;
    }
  }
}
</style>

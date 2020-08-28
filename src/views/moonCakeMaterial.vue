<template>
  <div class="moonCake">
    <div class="bg"></div>
    <ul>
      <li v-for="(item, index) in materialObj" :key="index">
        <i :class="index"></i>
        <div
          v-for="(a, b) in item"
          :key="a.imgName"
          @click="choseMaterial(index, b)"
          class="liDiv"
        >
          <div
            class="img"
            :style="{ backgroundImage: 'url(' + a.imgName + ')' }"
          ></div>
          <div class="fontBox">
            <div class="fontColor">{{ a.name }} ×{{ a.num }}</div>
            <div class="fontConfirem" :class="{ fontYes: a.isConfirm }"></div>
          </div>
        </div>
      </li>
      <li class="moonCakeButton">
        <div @click="getmaterials"></div>
        <div :class="{ gray: isShowButton }"></div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
const api = require("../api/index.js");
interface materialObjData {
  [key: string]: materialObjDatas[];
}
interface materialObjDatas {
  name: string;
  imgName: string;
  isConfirm: boolean;
  num: number;
}
@Component({})
export default class MoonCake extends Vue {
  //材料的数据对象
  materialObj: materialObjData = {
    cake_crust: [
      {
        name: "面粉",
        imgName: require("../assets/moonCake/flour.png"),
        isConfirm: false,
        num: 0
      }
    ],
    stuffing: [
      {
        name: "蛋黄",
        imgName: require("../assets/moonCake/yolk.png"),
        isConfirm: false,
        num: 0
      },
      {
        name: "豆沙",
        imgName: require("../assets/moonCake/dousha.png"),
        isConfirm: false,
        num: 0
      },
      {
        name: "莲蓉",
        imgName: require("../assets/moonCake/lotus_seed.png"),
        isConfirm: false,
        num: 0
      },
      {
        name: "五仁",
        imgName: require("../assets/moonCake/wuren.png"),
        isConfirm: false,
        num: 0
      }
    ],
    pancake_noodles: [
      {
        name: "黄鹤楼",
        imgName: require("../assets/moonCake/hhl.png"),
        isConfirm: false,
        num: 0
      },
      {
        name: "楼楼",
        imgName: require("../assets/moonCake/hhl_people.png"),
        isConfirm: false,
        num: 0
      }
    ]
  };

  get isShowButton(): boolean {
    let array = Object.values(this.materialObj);
    let array1 = array.map(res => {
      for (let i in res) {
        //todo 添加判断&& res[i].num > 0 只有当材料的数量大于0时才显示制作月饼按钮
        if (res[i].isConfirm) {
          return true;
        }
      }
    });
    if (array1.indexOf(undefined) > -1) {
      return true;
    } else {
      return false;
    }
  }
  //接口：收集材料
  getmaterials() {
    let openid = localStorage.getItem("hhl_openId");
    api.getmaterials(openid).then((res: any) => {
      console.log(res);
    });
  }
  //选中材料
  choseMaterial(e: string, f: number) {
    if (this.materialObj[e][f].isConfirm) {
      this.materialObj[e][f].isConfirm = false;
      return;
    }
    for (let i in this.materialObj[e]) {
      this.materialObj[e][i].isConfirm = false;
    }
    this.materialObj[e][f].isConfirm = true;
  }
}
</script>
<style lang="less" scope>
@titleFont: {
  background-size: 100% 100%;
  width: 5vw;
  height: 10vw;
};
.moonCake {
  background: url(../assets/moonCake/moonCakeBg.png) no-repeat;
  background-size: 100% 100%;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  padding-top: 47vh;
  .gray {
    filter: grayscale(100%);
  }
  .bg {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
  }
  i {
    display: block;
  }
  .cake_crust {
    background: url(../assets/moonCake/cake_crust.png) no-repeat;
    @titleFont();
  }
  .stuffing {
    background: url(../assets/moonCake/stuffing.png) no-repeat;
    @titleFont();
  }
  .pancake_noodles {
    background: url(../assets/moonCake/pancake_noodles.png) no-repeat;
    @titleFont();
  }
  li {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 7vw;
    box-sizing: border-box;
    margin-bottom: 0.5vh;
    .liDiv {
      margin: 0 1.5vw;
    }
  }
  li:last-of-type {
    padding: 0 5vw;
  }
  .moonCakeButton {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 2vh;
    background-color: #50210f;
    div {
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 35vw;
      height: 15vw;
    }
    div:first-of-type {
      background-image: url(../assets/moonCake/collect_ingredients.png);
    }
    div:last-of-type {
      background-image: url(../assets/moonCake/makeMoonCake.png);
    }
  }
  .img {
    display: block;
    width: 15vw;
    height: 15vw;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .fontBox {
    display: flex;
    justify-content: center;
    align-items: center;
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

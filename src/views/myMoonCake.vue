<template>
  <div class="myMoonCake-web">
    <ul>
      <li v-for="item in cakeObj" :key="item.name" @click="choseCake(item)">
        <div
          class="img"
          :style="{ backgroundImage: 'url(' + item.imgName + ')' }"
        ></div>
        <div class="fontBox">
          <div class="fontColor">
            {{ item.name }} ×{{ item.numArray.length }}
          </div>
          <div
            class="fontConfirem"
            :class="{ fontYes: choseCakeData.indexOf(item.cakeType) > -1 }"
          ></div>
        </div>
      </li>
    </ul>
    <button
      class="syntheticGift"
      :class="{ gray: !isClickSyntheticGift }"
      @click="syntheticGift"
    ></button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
const api = require("../api/index.js");
interface CakeObjData {
  name: string;
  imgName: string;
  numArray: number[];
  cakeType: number;
}
@Component({})
export default class MyMoonCake extends Vue {
  @Inject()
  private popup!: Function;
  //月饼对象
  cakeObj: CakeObjData[] = [
    {
      name: "楼楼蛋黄月饼",
      imgName: require("../assets/myMoonCake/yolk_cake.png"),
      numArray: [],
      cakeType: 1
    },
    {
      name: "楼楼豆沙月饼",
      imgName: require("../assets/myMoonCake/dousha_cake.png"),
      numArray: [],
      cakeType: 2
    },
    {
      name: "楼楼五仁月饼",
      imgName: require("../assets/myMoonCake/wuren_cake.png"),
      numArray: [],
      cakeType: 3
    },
    {
      name: "楼楼莲蓉月饼",
      imgName: require("../assets/myMoonCake/lotus_seed_cake.png"),
      numArray: [],
      cakeType: 4
    },
    {
      name: "黄鹤楼蛋黄月饼",
      imgName: require("../assets/myMoonCake/hhl_yolk_cake.png"),
      numArray: [],
      cakeType: 5
    },
    {
      name: "黄鹤楼豆沙月饼",
      imgName: require("../assets/myMoonCake/hhl_dousha_cake.png"),
      numArray: [],
      cakeType: 6
    },
    {
      name: "黄鹤楼五仁月饼",
      imgName: require("../assets/myMoonCake/hhl_wuren_cake.png"),
      numArray: [],
      cakeType: 7
    },
    {
      name: "黄鹤楼莲蓉月饼",
      imgName: require("../assets/myMoonCake/hhl_lotus_seed_cake.png"),
      numArray: [],
      cakeType: 8
    }
  ];
  //选中的月饼
  choseCakeData: number[] = [];
  //按钮只有在选中四个的时候能点击
  get isClickSyntheticGift(): boolean {
    if (this.choseCakeData.length === 4) {
      const array = this.choseCakeData.map(res => {
        return this.cakeObj[res - 1].numArray.length;
      });
      const bo = array.every(val => {
        return val > 0;
      });
      return bo;
    }
    return false;
  }
  mounted(): void {
    this.getCheckCake();
  }
  //接口:合成礼盒
  syntheticGift() {
    const self = this;
    const userInfo = localStorage.getItem("hhl_festival_userInfo");
    if (this.isClickSyntheticGift && userInfo) {
      const user = JSON.parse(userInfo);
      const data = {
        userId: user.id,
        data: {
          cakeRecordIds: this.handleData(),
          openid: user.openid
        }
      };
      api.synthesis(data).then((res: any) => {
        console.log(res.data.data);
        const value = res.data.data;
        self.handleData("del");
        if (value.prizeType === 0) {
          self.popup("popupBox", {
            imgUrl: require("../assets/thanks.png"),
            name: "楼中月",
            prize: "谢谢参与",
            buttonText: "好的"
          });
        } else {
          self.popup("popupBox", {
            imgUrl: value.imgUrl,
            name: "楼中月",
            prize: value.prizeName,
            buttonText: "收下"
          });
        }
      });
    }
  }
  //根据选中的id返回选中的月饼中的第一个，如果传del，则把这几个删除
  handleData(e?: string): number[] {
    const value = this.choseCakeData.map(res => {
      if (e === "del") {
        this.cakeObj[res - 1].numArray.shift();
      }
      return this.cakeObj[res - 1].numArray[0];
    });
    return value;
  }
  // 接口：获取查看月饼
  getCheckCake() {
    const self = this;
    const data = localStorage.getItem("hhl_openId");
    if (data) {
      api.checkCake(data).then((res: any) => {
        console.log(res.data.data);
        const value = res.data.data;
        for (const i in value) {
          for (const p in self.cakeObj) {
            if (self.cakeObj[p].cakeType === value[i].cakeType) {
              self.cakeObj[p].numArray.push(value[i].id);
            }
          }
        }
      });
    } else {
      this.$Toast({
        msg: "未知错误，请刷新重试",
        duration: "1500"
      });
    }
  }
  //选取月饼
  choseCake(e: CakeObjData) {
    const index = this.choseCakeData.indexOf(e.cakeType);
    if (index > -1) {
      this.choseCakeData.splice(index, 1);
    } else {
      if (this.choseCakeData.length >= 4) {
        this.choseCakeData.shift();
      }
      this.choseCakeData.push(e.cakeType);
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

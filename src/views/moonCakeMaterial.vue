<template>
  <div class="moonCake">
    <div class="bg"></div>
    <ul>
      <li v-for="(item, index) in materialObj" :key="index">
        <i :class="imgName[index - 1]"></i>
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
            <div class="fontColor">{{ a.name }} ×{{ a.numArray.length }}</div>
            <div class="fontConfirem" :class="{ fontYes: a.isConfirm }"></div>
          </div>
        </div>
      </li>
      <li class="moonCakeButton">
        <div @click="getmaterials"></div>
        <div :class="{ gray: isShowButton }" @click="makeCake"></div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
const api = require("../api/index.js");
interface MaterialObjData {
  [key: number]: MaterialObjDatas[];
}
interface MaterialObjDatas {
  name: string;
  imgName: string;
  isConfirm: boolean;
  materialId: number;
  materialCategoryId: number;
  numArray: number[];
}
@Component({})
export default class MoonCake extends Vue {
  @Inject()
  private popup!: Function;
  //标题图片名字
  imgName = ["cakeCrust", "stuffing", "pancakeNoodles"];
  //材料的数据对象 对象的key值1，2，3代表下标和种类id和图片名字下标
  materialObj: MaterialObjData = {
    1: [
      {
        name: "面粉",
        imgName: require("../assets/moonCake/flour.png"),
        isConfirm: false,
        materialId: 1,
        materialCategoryId: 1,
        numArray: []
      }
    ],
    2: [
      {
        name: "蛋黄",
        imgName: require("../assets/moonCake/yolk.png"),
        isConfirm: false,
        materialId: 2,
        materialCategoryId: 2,
        numArray: []
      },
      {
        name: "豆沙",
        imgName: require("../assets/moonCake/dousha.png"),
        isConfirm: false,
        materialId: 3,
        materialCategoryId: 2,
        numArray: []
      },
      {
        name: "莲蓉",
        imgName: require("../assets/moonCake/lotus_seed.png"),
        isConfirm: false,
        materialId: 4,
        materialCategoryId: 2,
        numArray: []
      },
      {
        name: "五仁",
        imgName: require("../assets/moonCake/wuren.png"),
        isConfirm: false,
        materialId: 5,
        materialCategoryId: 2,
        numArray: []
      }
    ],
    3: [
      {
        name: "黄鹤楼",
        imgName: require("../assets/moonCake/hhl.png"),
        isConfirm: false,
        materialId: 6,
        materialCategoryId: 3,
        numArray: []
      },
      {
        name: "楼楼",
        imgName: require("../assets/moonCake/hhl_people.png"),
        isConfirm: false,
        materialId: 7,
        materialCategoryId: 3,
        numArray: []
      }
    ]
  };
  //材料接口返回的userId
  userId!: number;

  get isShowButton(): boolean {
    const array = Object.values(this.materialObj);
    const array1 = array.map(res => {
      for (const i in res) {
        //todo 添加判断&& res[i].num > 0 只有当材料的数量大于0时才显示制作月饼按钮
        if (res[i].isConfirm && res[i].numArray.length > 0) {
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
  mounted(): void {
    this.checkMaterials();
  }
  //遍历材料并返回当前选中的材料如果传del则删除当前选中的材料中的第一个
  forMaterials(e?: string): number[] {
    const array = Object.values(this.materialObj);
    const array1 = [],
      array2 = [];
    for (const i in array) {
      array1.push(...array[i]);
    }
    for (const i in array1) {
      if (array1[i].isConfirm) {
        array2.push(array1[i]);
      }
    }
    if (e === "del") {
      for (const i in array2) {
        for (const p in this.materialObj[array2[i].materialCategoryId]) {
          if (
            this.materialObj[array2[i].materialCategoryId][p].materialId ===
            array2[i].materialId
          ) {
            this.materialObj[array2[i].materialCategoryId][p].numArray.shift();
          }
        }
      }
      console.log(array2);
    }
    const value = array2.map(res => {
      return res.numArray[0];
    });
    return value;
  }

  //初始化材料
  initMaterials() {
    for (const i in this.materialObj) {
      for (const p in this.materialObj[i]) {
        this.materialObj[i][p].numArray = [];
      }
    }
  }
  //接口：制作月饼
  makeCake() {
    const self = this;
    const userInfo = localStorage.getItem("hhl_festival_userInfo");
    if (!self.isShowButton && userInfo) {
      const info = JSON.parse(userInfo);
      const data = {
        userId: info.id,
        data: {
          openid: info.openid,
          userMaterialIds: self.forMaterials()
        }
      };
      // eslint-disable-next-line
      api.makeCake(data).then((res: any) => {
        const value = res.data.data;
        self.forMaterials("del");
        if (value.prizeType === 0) {
          self.popup("popupBox", {
            imgUrl: require("../assets/thanks.png"),
            name: value.cakeName,
            prize: "谢谢参与",
            buttonText: "好的"
          });
        } else {
          self.popup("popupBox", {
            imgUrl: value.imgUrl,
            name: value.cakeName,
            prize: value.prizeName,
            buttonText: "收下"
          });
        }
        console.log(res.data.data);
      });
    }
  }
  //接口：查看材料
  checkMaterials() {
    const self = this;
    const openid = localStorage.getItem("hhl_openId");
    // eslint-disable-next-line
    api.checkMaterials(openid).then((res: any) => {
      const value = res.data.data;
      self.initMaterials();
      for (const i in value) {
        const obj = value[i];
        for (const p in self.materialObj[obj.materialCategoryId]) {
          if (
            self.materialObj[obj.materialCategoryId][p].materialId ===
            obj.materialId
          ) {
            self.materialObj[obj.materialCategoryId][p].numArray.push(obj.id);
          }
        }
      }
    });
  }
  //接口：收集材料
  getmaterials() {
    const self = this;
    const openid = localStorage.getItem("hhl_openId");

    // eslint-disable-next-line
    api.getMaterials(openid).then((res: any) => {
      console.log(res.data.code);
      const code = res.data.code;
      const value = res.data.data;
      if (code === 200) {
        for (const i in self.materialObj[value.materialCategoryId]) {
          if (
            self.materialObj[value.materialCategoryId][i].materialId ===
            value.materialId
          ) {
            self.materialObj[value.materialCategoryId][i].numArray.push(
              value.id
            );
          }
        }
        const titleArray = ["饼皮", "馅料", "饼面"];
        self.popup("popupBox", {
          imgUrl: require("../assets/popup/" + value.materialId + ".png"),
          name: "material",
          prize:
            titleArray[value.materialCategoryId - 1] + "-" + value.materialName,
          buttonText: "收下"
        });
      } else if (code === 1001) {
        self.popup("shareCollection");
      } else if (code === 1002) {
        self.popup("fourCollectionEnd");
      } else if (code === 1003) {
        self.popup("collectionEnd");
      }
    });
  }
  //选中材料
  choseMaterial(e: number, f: number) {
    if (this.materialObj[e][f].isConfirm) {
      this.materialObj[e][f].isConfirm = false;
      return;
    }
    for (const i in this.materialObj[e]) {
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
  .title {
    display: block;
    height: 16vw;
    width: 10vw;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
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
  .cakeCrust {
    background: url(../assets/moonCake/cake_crust.png) no-repeat;
    @titleFont();
  }
  .stuffing {
    background: url(../assets/moonCake/stuffing.png) no-repeat;
    @titleFont();
  }
  .pancakeNoodles {
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

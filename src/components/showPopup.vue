<template>
  <div class="showPopup" @click.self="closePopup('box')">
    <!-- 规则弹窗 -->
    <div class="actRule" v-show="isShowContent.contentName === 'rule'">
      <div @click.stop="closePopup('rule')" class="closePopup"></div>
    </div>
    <!-- 排行榜 -->
    <div v-show="isShowContent.contentName === 'rank'" class="rank">
      <div class="closePopup" @click.stop="closePopup('rank')"></div>
      <ul>
        <li v-for="(item, index) in isShowContent.content" :key="index">
          <div class="box">
            <div class="headImg">
              <div class="front_row"></div>
              <img :src="item.headImgUrl" alt="" />
            </div>
            <div class="member">{{ item.memberNo }}</div>
            <div class="cakeAmount">
              <div>{{ item.cakeAmount }}个</div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- 收集完成 -->
    <div
      class="collectionEnd"
      v-show="isShowContent.contentName === 'collectionEnd'"
    >
      <div class="closeButton" @click.stop="closePopup('collectionEnd')"></div>
    </div>
    <!-- 前四次收集完成 -->
    <div
      class="fourCollectionEnd"
      v-show="isShowContent.contentName === 'fourCollectionEnd'"
    >
      <div
        class="closeButton"
        @click.stop="closePopup('fourCollectionEnd')"
      ></div>
    </div>
    <!-- 分享获得收集机会 -->
    <div
      class="shareCollection"
      @click.stop="closePopup('shareCollection')"
      v-show="isShowContent.contentName === 'shareCollection'"
    ></div>
    <!-- 所有奖品材料弹框 -->
    <div class="popupBox" v-show="isShowContent.contentName === 'popupBox'">
      <div @click.stop="closePopup('rule')" class="closePopup"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop } from "vue-property-decorator";
interface showContent {
  [key: string]: string | number;
}
interface content {
  contentName: string;
  content: Content;
}
type Content = showContent[] | null | showContent;

@Component({})
export default class showPopup extends Vue {
  @Prop() isShowContent!: content;
  @Emit("popupClick") closePopups(e: string) {}

  closePopup(e: string) {
    this.closePopups(e);
  }
}
</script>
<style lang="less" scope>
@no: {
  display: block;
  position: absolute;
  background-size: 100% 100%;
  width: 100%;
  height: 119%;
  top: -3vw;
};
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
  .popupBox {
    background: url(../assets/popup/popupBg.png) no-repeat;
    background-size: 100% 100%;
    width: 100vw;
    height: 80vh;
    position: absolute;
    top: 0;
    .closePopup {
      top: 18vh;
      right: 12vw;
    }
  }
  .shareCollection {
    background: url(../assets/popup/shareCollection.png) no-repeat;
    background-size: 100% 100%;
    width: 75vw;
    height: 90vh;
  }
  .collectionEnd {
    background: url(../assets/popup/collectionEnd.png) no-repeat;
    background-size: 100% 100%;
    width: 75vw;
    height: 90vh;
    .closeButton {
      position: absolute;
      bottom: 5vh;
      left: 23vw;
      width: 51vw;
      height: 10vh;
    }
  }
  .fourCollectionEnd {
    background: url(../assets/popup/fourCollectionEnd.png) no-repeat;
    background-size: 100% 100%;
    width: 75vw;
    height: 90vh;
    .closeButton {
      position: absolute;
      bottom: 5vh;
      left: 25vw;
      width: 49vw;
      height: 10vh;
    }
  }
  .rank {
    background: url(../assets/rank/rankBg.png) no-repeat;
    background-size: 100% 100%;
    width: 85vw;
    height: 85vh;
    position: relative;
    box-sizing: border-box;
    padding-top: 14vh;
    ul {
      height: 68vh;
      overflow: hidden;
      overflow-y: auto;
      padding-top: 2vh;
    }
    li {
      box-sizing: border-box;
      padding: 0 3vw 2vh;
      .front_row {
        display: none;
      }
      .box {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        border-bottom: black solid 1px;
      }
      .member {
        width: 32vw;
      }
      .cakeAmount {
        width: 25vw;
        display: flex;
        justify-content: center;
        align-items: center;
        div {
          width: 15vw;
          padding: 0.5vh 0;
          border-radius: 10vw;
          background-color: #a93532;
          color: #fff09e;
        }
      }
    }
    li:first-of-type,
    li:nth-of-type(2),
    li:nth-of-type(3) {
      img {
        width: 15vw;
        height: auto;
      }
    }
    li:first-of-type {
      .member {
        color: #d36132;
      }
      .front_row {
        background: url(../assets/rank/no1.png) no-repeat;
        @no();
      }
    }
    li:nth-of-type(2) {
      .member {
        color: #feaf00;
      }
      .front_row {
        background: url(../assets/rank/no2.png) no-repeat;
        @no();
      }
    }
    li:nth-of-type(3) {
      .member {
        color: #89a3f1;
      }
      .front_row {
        background: url(../assets/rank/no3.png) no-repeat;
        @no();
      }
    }
    .headImg {
      width: 18vw;
      position: relative;
      img {
        border-radius: 50%;
        width: 10vw;
        height: auto;
      }
    }
  }
  .actRule {
    background: url(../assets/actRule.png) no-repeat;
    background-size: 100% 100%;
    width: 85vw;
    height: 85vh;
    position: relative;
  }
  .closePopup {
    background: url(../assets/rule_button.png) no-repeat;
    background-size: 100% 100%;
    width: 10vw;
    height: 10vw;
    position: absolute;
    top: 0;
    right: -5vw;
  }
}
</style>

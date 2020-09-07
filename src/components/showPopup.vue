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
    <div class="popupBox" v-if="isShowContent.contentName === 'popupBox'">
      <div @click.stop="closePopup('popupBox')" class="closePopup"></div>
      <div
        class="popupImg"
        :style="{
          backgroundImage: 'url(' + isShowContent.content.imgUrl + ')'
        }"
      ></div>
      <!-- 获得材料 -->
      <div
        class="popupMaterial"
        v-if="isShowContent.content.name === 'material'"
      >
        <p>恭喜您!</p>
        <p>
          获得<span>{{ isShowContent.content.prize }}</span
          >一份
        </p>
        <button @click.stop="closePopup('popupBox')">
          {{ isShowContent.content.buttonText }}
        </button>
      </div>
      <!-- 获得奖品 -->
      <div
        class="popupPrize"
        v-if="
          isShowContent.content.name !== 'material' &&
            isShowContent.content.name !== 'thanks' &&
            isShowContent.content.prize !== '谢谢参与'
        "
      >
        <p>您制作完成{{ isShowContent.content.name }}一个!</p>
        <p>恭喜您获得</p>
        <p>{{ isShowContent.content.prize }}</p>
        <button @click.stop="closePopup('popupBox')">
          {{ isShowContent.content.buttonText }}
        </button>
      </div>
      <!-- 谢谢参与 -->
      <div
        class="popupThanks"
        v-if="isShowContent.content.prize === '谢谢参与'"
      >
        <p>
          您制作完成<span>{{ isShowContent.content.name }}</span
          >一个!
        </p>
        <p>谢谢您的参与!</p>
        <button @click.stop="closePopup('popupBox')">
          {{ isShowContent.content.buttonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop } from "vue-property-decorator";
interface ShowContent {
  [key: string]: string | number;
}
interface ContCents {
  contentName: string;
  content: Content;
}
type Content = ShowContent[] | null | ShowContent;

@Component({})
export default class ShowPopup extends Vue {
  @Prop() isShowContent!: ContCents;
  @Emit("popupClick") closePopups(e: string) {
    console.log(e);
  }

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
  background-color: rgba(0, 0, 0, 0.8);
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
    height: 116vw;
    position: absolute;
    top: 0;
    span {
      color: rgb(240, 85, 76);
      font-size: 7vw;
    }
    .closePopup {
      top: 24vw;
      right: 12vw;
    }
    .popupThanks {
      position: absolute;
      top: 78vw;
      width: 70vw;
      left: 15vw;
      font-weight: bold;
      font-size: 5vw;
      p {
        white-space: nowrap;
      }
      p:first-of-type {
        margin-bottom: 2vw;
      }
      button {
        border: none;
        outline: none;
        background: url(../assets/popup/buttonBox.png) no-repeat;
        background-size: 100% 100%;
        width: 30vw;
        height: 11vw;
        color: #b84635;
        font-weight: bold;
        line-height: 10vw;
        margin-top: 3vw;
        white-space: nowrap;
      }
    }
    .popupImg {
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 40vw;
      height: 40vw;
      position: absolute;
      left: 30vw;
      top: 25vw;
    }
    .popupPrize {
      position: absolute;
      top: 75vw;
      width: 70vw;
      left: 15vw;
      font-weight: bold;
      font-size: 4.2vw;
      p {
        white-space: nowrap;
      }
      p:nth-of-type(2) {
        font-size: 5vw;
      }
      p:last-of-type {
        font-size: 6vw;
        color: rgb(240, 85, 76);
      }
      button {
        border: none;
        outline: none;
        background: url(../assets/popup/buttonBox.png) no-repeat;
        background-size: 100% 100%;
        width: 30vw;
        height: 11vw;
        color: #b84635;
        font-weight: bold;
        line-height: 10vw;
        margin-top: 2vw;
        white-space: nowrap;
      }
    }
    .popupMaterial {
      position: absolute;
      top: 75vw;
      width: 70vw;
      left: 15vw;
      font-weight: bold;
      font-size: 6vw;
      p {
        span {
          color: rgb(240, 85, 76);
          font-size: 10vw;
        }
      }
      button {
        border: none;
        outline: none;
        background: url(../assets/popup/buttonBox.png) no-repeat;
        background-size: 100% 100%;
        width: 30vw;
        height: 11vw;
        color: #b84635;
        font-weight: bold;
        line-height: 10vw;
        margin-top: 2vw;
        white-space: nowrap;
      }
    }
  }
  .shareCollection {
    background: url(../assets/popup/shareCollection.png) no-repeat;
    background-size: 100% 100%;
    width: 75vw;
    height: 113vw;
    position: absolute;
    top: 0;
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

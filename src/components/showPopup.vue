<template>
  <div class="showPopup" @click.self="closePopup('box')">
    <!-- 规则弹窗 -->
    <div class="actRule" v-show="isShowContent.contentName === 'rule'">
      <div class="ruleContent">
        <p class="red">
          <span class="red bold">活动时间：</span>2020年9月11日-24日
        </p>
        <p>
          <span class="red bold"> 活动内容：</span
          >楼主每天可参与活动收集月饼食材，食材分为“饼皮”、“馅料”、“饼面”三个部分，三个部分各集齐一份即可制作一个月饼，并获得一次抽奖机会。每四个不一样的月饼即可生成一个月饼礼盒。获得月饼礼盒后即可获得一次抽大奖的机会，数量有限，先到先得！
        </p>
        <p class="red bold">活动流程：</p>
        <p>
          1）每天进入活动页面，即获得3次收集食材的机会，每次会随机收集一份食材。3次机会使用完毕后，还可通过分享活动给好友或分享到朋友圈，额外获得1次收集次数。参与黄鹤楼扫码验真获得，也可以额外获得收集次数，最高3次；
        </p>
        <p>
          2）每集齐一套食材，即“饼皮”+“馅料”+“饼面”，就可以、制作一个月饼。包括楼楼蛋黄月饼、楼楼豆沙月饼、楼楼五仁月饼、楼楼莲蓉月饼、黄鹤楼蛋黄月饼、黄鹤楼豆沙月饼、黄鹤楼五仁月饼、黄鹤楼莲蓉月饼。每生成一个月饼就有一次抽奖机会；
        </p>
        <p>
          3）在“我的月饼”中可以查看所有制作完成的月饼。每集齐四个不同的月饼，即可生成一份“楼中月”月饼礼盒。并获得一次抽大奖的机会。
        </p>
        <p>
          4）活动结束后，在月饼排行榜中，排名前100的用户，即可获得大奖一份。
        </p>
        <p class="red">奖品设置:</p>
        <ul>
          <li class="red"><span class="bold">月饼排行：</span>美的电烤箱</li>
          <li class="red">
            <span class="bold">礼盒抽奖：</span
            >博洋羊毛被、飞利浦手持吸尘器、泰昌足 浴器、欧姆龙体温计、小熊养生壶
          </li>
          <li class="red">
            <span class="bold">月饼抽奖：</span>威露士衣物洗护套装、天堂晴雨伞
          </li>
        </ul>
        <p>本活动最终解释权由黄鹤楼1916公众号所有。</p>
      </div>
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
        :class="{ popupT: isShowContent.content.prize === '谢谢参与' }"
      ></div>
      <div
        class="hhlImg"
        v-if="isShowContent.content.prize !== '谢谢参与'"
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
      font-size: 6vw;
    }
    .closePopup {
      top: 24vw;
      right: 12vw;
    }
    .popupThanks {
      position: absolute;
      top: 81vw;
      width: 70vw;
      left: 15vw;
      font-weight: bold;
      font-size: 4.5vw;
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
    .hhlImg {
      background: url(../assets/popup/hhlImg.png) no-repeat;
      background-size: 100% 100%;
      width: 20vw;
      height: 25vw;
      position: absolute;
      top: 52vw;
      right: 19vw;
    }
    .popupImg {
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 40vw;
      height: 40vw;
      position: absolute;
      left: 30vw;
      top: 31vw;
    }
    .popupT {
      height: 50vw;
      top: 29vw;
    }
    .popupPrize {
      position: absolute;
      top: 79vw;
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
      top: 79vw;
      width: 70vw;
      left: 15vw;
      font-weight: bold;
      font-size: 6vw;
      p {
        span {
          color: rgb(240, 85, 76);
          font-size: 8vw;
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
        font-size: 5vw;
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
    .ruleContent {
      position: absolute;
      width: 75vw;
      height: 75vh;
      left: 5vw;
      top: 7vh;
      overflow: hidden;
      overflow-y: auto;
      font-size: 3vw;
      text-align: left;
      ul {
        padding-left: 5vw;
      }
      .red {
        color: rgb(207, 0, 0);
      }
      .bold {
        font-weight: bold;
      }
    }
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

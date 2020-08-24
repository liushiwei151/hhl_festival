<template>
  <div id="container" @mouseenter="stop()" @mouseleave="plays()">
    <div id="list" :style="{ left: listStyleLife + 'px' }">
      <!-- <div v-for="item in imgArray" :key="item.url">{{ item.url }}</div> -->
      <div class="box" v-for="item in imgArray" :key="item.url">
        <img v-for="item in imgArray" :src="item.url" :key="item.url" />
      </div>
    </div>
    <div id="buttons">
      <span
        v-for="(item, index) in imgArray"
        :key="index"
        @click="fn(index)"
        :class="{ on: item.className == 'on' }"
      ></span>
    </div>
    <a href="javascript:;" id="prev" @click="prev()" class="arrow">&lt;</a>
    <a href="javascript:;" id="next" @click="next()" class="arrow">&gt;</a>
  </div>
</template>
<script>
export default {
  name: "rotation",
  data() {
    return {
      colorArray: ["red", "yellow", "green", "blue", "gray"],
      //图片地址集合
      imgArray: [
        { url: require("../static/1.jpg"), className: "on" },
        { url: require("../static/2.jpg"), className: "" },
        { url: require("../static/3.jpg"), className: "" },
        { url: require("../static/4.jpg"), className: "" },
        { url: require("../static/5.jpg"), className: "" }
      ],
      index: 1,
      len: 5,
      animated: false,
      interval: 3000,
      timer: "",
      listStyleLife: -600
    };
  },
  mounted() {
    this.plays();
  },
  methods: {
    fn(e) {
      if (this.animated) {
        return;
      }
      if (this.imgArray[e].className == "on") {
        return;
      }
      var myIndex = e;
      var offset = -600 * (myIndex - this.index);

      this.animate(offset);
      this.index = myIndex;
      this.showButton(e);
    },
    animate(offset) {
      if (offset == 0) {
        return;
      }
      this.animated = true;
      var time = 300;
      var inteval = 10;
      var speed = offset / (time / inteval);
      var left = this.listStyleLife + offset;
      console.log(left);
      this.go(speed, left, inteval);
    },
    go(speed, left, inteval) {
      const self = this;
      if (
        (speed > 0 && this.listStyleLife < left) ||
        (speed < 0 && this.listStyleLife > left)
      ) {
        // Vue.set(self, "listStyleLife", self.listStyleLife + speed);
        let num = self.listStyleLife + speed;
        self.listStyleLife = num;
        console.log(self.listStyleLife);
        setTimeout(self.go(speed, left, inteval), inteval);
      } else {
        self.listStyleLife = left;
        if (left > -200) {
          self.listStyleLife = -600 * self.len + "px";
        }
        if (left < -600 * self.len) {
          self.listStyleLife = "-600px";
        }
        self.animated = false;
      }
    },
    showButton(index) {
      for (var i = 0; i < this.imgArray.length; i++) {
        if (this.imgArray[i].className == "on") {
          this.imgArray[i].className = "";
          break;
        }
      }
      //todo 有问题
      this.imgArray[index - 1].className = "on";
    },
    plays() {
      const self = this;
      self.timer = setTimeout(function() {
        self.next();
        self.plays();
      }, self.interval);
    },
    stop() {
      clearTimeout(this.timer);
    },
    next() {
      if (this.animated) {
        return;
      }
      if (this.index == 5) {
        this.index = 1;
      } else {
        this.index += 1;
      }
      this.animate(-600);
      this.showButton(this.index);
    },
    prev() {
      if (this.animated) {
        return;
      }
      if (this.index == 1) {
        this.index = 5;
      } else {
        this.index -= 1;
      }
      this.animate(600);
      this.showButton(this.index);
    }
  }
};
</script>
<style lang="less" scop>
.box {
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: black;
}
* {
  margin: 0;
  padding: 0;
  text-decoration: none;
}
body {
  padding: 20px;
}
#container {
  width: 600px;
  height: 400px;
  border: 3px solid #333;
  overflow: hidden;
  position: relative;
}
#list {
  width: 4200px;
  height: 400px;
  position: absolute;
  z-index: 1;
  transition: all 0.5s ease;
}
#list img {
  float: left;
}
#buttons {
  position: absolute;
  height: 10px;
  width: 100px;
  z-index: 2;
  bottom: 20px;
  left: 250px;
}
#buttons span {
  cursor: pointer;
  float: left;
  border: 1px solid #fff;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #333;
  margin-right: 5px;
}
#buttons .on {
  background: orangered;
}
.arrow {
  cursor: pointer;
  display: none;
  line-height: 39px;
  text-align: center;
  font-size: 36px;
  font-weight: bold;
  width: 40px;
  height: 40px;
  position: absolute;
  z-index: 2;
  top: 180px;
  background-color: RGBA(0, 0, 0, 0.3);
  color: #fff;
}
.arrow:hover {
  background-color: RGBA(0, 0, 0, 0.7);
}
#container:hover .arrow {
  display: block;
}
#prev {
  left: 20px;
}
#next {
  right: 20px;
}
</style>

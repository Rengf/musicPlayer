<template>
  <div class="carouselWrap">
    <div class="carouselBox">
      <div class="imageBox">
        <transition-group tag="ul" name="image">
          <li v-show="lunboIndex === index" v-for="(image,index) in imageList" :key="index">
            <img :src="image.pic" :alt="index+'.png'" />
          </li>
        </transition-group>
      </div>
      <div class="buttonBox">
        <ul>
          <li v-for="(image,index) in imageList" :key="index">
            <i @click="jump(index)" :class="{active:index===lunboIndex}"></i>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      lunboIndex: 0,
      imageList: [
        {
          pic: require("../../../../assets/images/avatar.png")
        },
        {
          pic: require("../../../../assets/images/avatar.png")
        },
        {
          pic: require("../../../../assets/images/avatar.png")
        },
        {
          pic: require("../../../../assets/images/avatar.png")
        },
        {
          pic: require("../../../../assets/images/avatar.png")
        },
        {
          pic: require("../../../../assets/images/avatar.png")
        },
        {
          pic: require("../../../../assets/images/avatar.png")
        }
      ],
      timer: ""
    };
  },
  destroyed() {
    clearInterval(this.timer);
  },
  mounted() {
    this.jumpadd();
    this.getImg();
  },
  methods: {
    //点击跳到第几张
    jump(index) {
      this.lunboIndex = index;
    },
    //自动播放
    jumpadd() {
      this.timer = setInterval(() => {
        this.lunboIndex++;
        if (this.lunboIndex == this.imageList.length) {
          this.lunboIndex = 0;
        }
      }, 3000);
    },
    getImg() {
      axios.get("http://localhost:3000/banner?type=2").then(res => {
        if (res.status == 200) {
          this.imageList = res.data.banners;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.active {
  background: rgb(248, 2, 2) !important;
}
.carouselWrap {
  position: relative;
  width: 100%;
  height: 150px;
  .carouselBox {
    width: 100%;
    height: 100%;
    margin: auto;
    .imageBox {
      width: 100%;
      height: 100%;
      ul {
        position: relative;
        li {
          position: absolute;
          width: 100%;
          height: 150px;
          img {
            display: block;
            width: 95%;
            height: 150px;
            margin: auto;
          }
        }
      }
    }
  }
  .buttonBox {
    z-index: 99999;
    position: absolute;
    bottom: 10px;
    left: 50%;
    right: 0;
    margin-left: -13%;
    ul {
      li {
        width: 7px;
        height: 7px;
        float: left;
        margin: 2px;
        i {
          width: 7px;
          height: 7px;
          display: block;
          background: #ccc;
          border-radius: 50%;
        }
      }
    }
  }
}
.image-enter-active {
  // 过渡
  // transform: translateX(0);
  transition: all 1s linear;
}

.image-leave-active {
  // 过渡
  // transform: translateX(-100%);
  transition: all 1s linear;
}

.image-enter {
  //  开始进入动画的位置
  transform: translateX(100%);
}

.image-leave-to {
  // 结束消失的位置
  transform: translateX(-100%);
}
</style>

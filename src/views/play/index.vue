<template>
  <div
    class="playWrap"
    :style="{backgroundImage:'url('+playMusic.image+')',backgroundSize:'100% 100%',backgroundRepeat:'no-repeat'}"
  >
    <div class="backBox"></div>
    <div class="playBox">
      <div class="palyHeader">
        <ul>
          <li class="return">
            <i class="iconfont" @click="returnPre()">&#xe62d;</i>
          </li>
          <li class="musicMsg">
            <span ref="musicName" :class="isStop?'stop':'musicName'">{{playMusic.name}}</span>
            <span class="singer" @click="toSingerMsg(playMusic.singerId)">
              {{playMusic.singer}}
              <i class="iconfont">&#xe60c;</i>
            </span>
          </li>
          <li class="live">
            <i class="iconfont">&#xe6b7;</i>
          </li>
          <li class="share">
            <i class="iconfont">&#xe63c;</i>
          </li>
        </ul>
      </div>
      <div class="playMain" @click="isShowImg()">
        <div class="musicImg" v-show="showImg">
          <div class="changtou">
            <img
              src="../../assets/images/2.png"
              ref="changtou"
              :class="{changtouImg:playing}"
              alt="图片"
            />
          </div>
          <div class="changpian">
            <img :src="playMusic.image||require('../../assets/images/2.png')" alt="图片" />
          </div>
        </div>
        <div class="musicLyric" v-show="!showImg">
          <div class="volume">
            <span class="volumeImg iconfont">&#xec0a;</span>
            <div class="volumeBar" ref="volumeBar"></div>
            <div class="volumedBar" ref="volumedBar">
              <span ref="volumePoint" class="volumePoint" @touchmove.stop="dragVolume"></span>
            </div>
          </div>
          <div class="lyric">
            <scroll class="lyricList" ref="lyricList">
              <div class="lyricBox" ref="lyricBox">
                <div v-if="lyricData">
                  <p
                    v-for="(line,index) in lyricData"
                    ref="lyricLine"
                    class="text"
                    :class="{'current': currentLineNum === index}"
                    :key="index"
                  >{{line.txt}}</p>
                </div>
              </div>
            </scroll>
          </div>
          <div class="subMenu"></div>
        </div>
      </div>
      <div class="playBar">
        <div class="timeAxisBox">
          <span class="currentTime">{{musicMsg.currentTime|filterTime}}</span>
          <div class="timeAxis">
            <div class="timeBar" ref="timeBar" @click.stop="jumpTime"></div>
            <div class="timedBar" ref="timedBar" @click.stop="jumpTime">
              <span ref="timePoint" class="timePoint" @touchmove="dragTime"></span>
            </div>
          </div>
          <span class="duration">{{musicMsg.duration|filterTime}}</span>
        </div>
        <div class="playControl">
          <ul>
            <li>
              <i class="iconfont" v-html="switchLoopData[loopIndex]" @click="switchLoop">&#xe628;</i>
            </li>
            <li>
              <i class="iconfont" @click="prev()">&#xe604;</i>
            </li>
            <li>
              <i class="iconfont" v-html="playIcon" @click="playPause()"></i>
            </li>
            <li>
              <i class="iconfont" @click="next()">&#xe7a9;</i>
            </li>
            <li>
              <i class="iconfont" @click="showMusicList()">&#xe605;</i>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <transition name="slide-fade">
      <MusicList v-if="isShowList" @showMusicList="showMusicList"></MusicList>
    </transition>
  </div>
</template>
<script>
import MusicList from "@/components/musicList/musicList";
import scroll from "@/components/common/scroll";
import { mapGetters } from "vuex";
import axios from "axios";
import Lyric from "lyric-parser";
export default {
  data() {
    return {
      isShowList: false,
      $timeBar: "",
      timeBarLength: 0, //  滑竿多长距离
      timedBarLength: 0,
      positionX: 0, //时间点距离
      timer: "", //定时器
      autox: 0, //每秒移动距离
      playIcon: "&#xe75e;",
      switchLoopData: ["&#xe603;", "&#xe600;", "&#xe628;"],
      currentSong: "",
      duration: 0, //总时长，按秒为单位
      currentTime: 0, //已播放时长，秒
      playBackRate: 1, //播放速度
      showImg: false,
      volumePositionX: 0,
      volumeBarLength: 0,
      lyric: null,
      currentLineNum: 0,
      isStop: false
    };
  },
  created() {},
  mounted() {
    this.initDefault();
    this.getPlaying();
    this.autoPlay();
    this.getLyric();
  },
  components: {
    MusicList,
    scroll
  },
  filters: {
    filterTime(value) {
      if (!value) {
        return "00:00";
      }
      var timeString = "";
      var min = parseInt(value / 60);
      var seconds = parseInt(value % 60);
      if (min >= 10) {
        timeString = min + ":";
      } else {
        timeString = "0" + min + ":";
      }
      if (seconds >= 10) {
        timeString = timeString + seconds;
      } else {
        timeString = timeString + "0" + seconds;
      }
      return timeString;
    }
  },
  computed: {
    ...mapGetters([
      "playMusic",
      "playLists",
      "playIndex",
      "loopIndex",
      "musicMsg",
      "playing",
      "playedLists"
    ]),
    lyricData() {
      return this.lyric ? this.lyric.lines : [];
    }
  },
  watch: {
    playMusic() {
      if (this.lyric) {
        this.lyric.stop();
        this.currentLineNum = 0;
        this.lyric = null;
      }
      this.currentLineNum = 0;
      this.lyric = null;
      if (this.$refs.musicName.clientWidth < 205) {
        this.isStop = true;
      } else {
        this.isStop = false;
      }
      this.musicPlay();
    },
    playing() {
      this.getPlaying();
    },
    musicMsg: {
      handler(newval, oldval) {},
      deep: true
    }
  },
  destroyed() {
    clearTimeout(this.timer);
  },
  methods: {
    isShowImg() {
      this.showImg = !this.showImg;
    },
    toSingerMsg(id) {
      this.$store.dispatch("getSingerArtists", id).then(() => {
        this.$router.push("/singerMsg?id=" + id);
      });
    },
    //判断是否播放，播放图标控制
    getPlaying() {
      if (this.playing == true) {
        this.playIcon = "&#xe775;";
      } else {
        this.playIcon = "&#xe658;";
      }
    },
    //获取歌词
    getLyric() {
      if (this.playMusic) {
        axios
          .get("http://localhost:3000/lyric?id=" + this.playMusic.id)
          .then(res => {
            if (res.data.code == 200) {
              if (res.data.lrc !== undefined) {
                this.lyric = new Lyric(res.data.lrc.lyric, this.handl);
                this.lyric.seek(this.musicMsg.currentTime * 1000);
              } else {
                this.lyric = null;
              }
            }
          });
      } else {
        return;
      }
    },
    //处理歌词
    handl({ lineNum, txt }) {
      if (!this.$refs.lyricLine || !this.$refs.lyricList) {
        return;
      }
      this.currentLineNum = lineNum;
      let lineEl = this.$refs.lyricLine[lineNum];
      this.$refs.lyricList.scrollToElement(lineEl, 1000);
    },
    //控制显示音乐列表
    showMusicList(showMusicList) {
      if (showMusicList == undefined) {
        this.isShowList = true;
      } else {
        this.isShowList = showMusicList;
      }
    },
    //控制播放暂停
    playPause() {
      if (this.playing == true) {
        this.$store.dispatch("isPlaying", false);
        this.lyric.togglePlay();
      } else {
        this.$store.dispatch("isPlaying", true);
        this.lyric.togglePlay();
      }
    },
    //播放音乐
    musicPlay() {
      this.getLyric();
      this.currentSong = this.playMusic.url;
      if (this.currentSong == undefined) {
        return;
      }

      this.$nextTick(() => {
        this.autoPlay();
        this.playIcon = "&#xe775;";
      });
    },
    //下一首
    next() {
      this.lyric.stop();
      this.currentLineNum = 0;
      this.lyric = null;
      var index = 0;
      if (this.loopIndex == 0) {
        index = this.playIndex;
      } else if (this.loopIndex == 1) {
        index = this.playIndex + 1;
      } else {
        index = parseInt(Math.random() * this.playLists.length);
      }
      var playMusic = [
        this.playLists[index].id,
        this.playLists[index].name,
        this.playLists[index].ar[0].name,
        this.playLists[index].al.picUrl,
        this.playLists[index].ar[0].id
      ];
      this.$store.dispatch("playMusicIndex", index);
      this.$store.dispatch("getPlayMusic", playMusic);
    },
    //上一首
    prev() {
      this.lyric.stop();
      this.currentLineNum = 0;
      this.lyric = null;
      this.$store.dispatch("setPrevMusic");
      if (this.playedLists.length == 0) {
        return;
      }
      var index = this.playedLists[this.playedLists.length - 1];
      var playMusic = [
        this.playLists[index].id,
        this.playLists[index].name,
        this.playLists[index].ar[0].name,
        this.playLists[index].al.picUrl,
        this.playLists[index].ar[0].id
      ];
      this.$store.dispatch("playMusicIndex", index);
      this.$store.dispatch("setPrevMusic");
      this.$store.dispatch("getPlayMusic", playMusic);
    },
    //控制播放循环方式
    switchLoop() {
      if (this.loopIndex < 2) {
        this.$store.dispatch("setSwitchLoop", this.loopIndex + 1);
      } else {
        this.$store.dispatch("setSwitchLoop", 0);
      }
    },
    //获取默认数据
    initDefault() {
      var _this = this;
      this.$timeBar = this.$refs.timeBar;
      this.$volumeBar = this.$refs.volumeBar;
      this.timeBarLength = this.$timeBar.clientWidth;
      this.volumeBarLength = this.$volumeBar.clientWidth;
      this.volumePositionX = this.volumeBarLength / 2;
      this.$refs.volumePoint.style.left = this.volumePositionX + "px";
      this.$refs.volumedBar.style.width = this.volumePositionX + "px";
      this.currentSong = this.playMusic.url;
      this.autox = this.timeBarLength / this.musicMsg.duration;
      if (this.$refs.musicName.clientWidth < 205) {
        this.isStop = true;
      } else {
        this.isStop = false;
      }
    },
    //滑动控制进度
    dragTime(e) {
      var slidedis = e.touches[0].pageX - 43;
      if (slidedis > this.timeBarLength || slidedis < 0) {
        return;
      }
      var newTime =
        (this.positionX / this.timeBarLength) * this.musicMsg.duration;
      this.$store.dispatch("setCurrentTime", newTime);
      this.lyric.seek(this.musicMsg.currentTime * 1000);
      this.positionX = slidedis;
      this.$refs.timedBar.style.width = this.positionX + "px";
      this.$refs.timePoint.style.left = this.positionX + "px";
    },
    //点击控制进度
    jumpTime(e) {
      this.positionX = e.offsetX;
      this.$refs.timePoint.style.left = this.positionX + "px";
      var newTime =
        (this.positionX / this.timeBarLength) * this.musicMsg.duration;
      this.$store.dispatch("setCurrentTime", newTime);
      this.lyric.seek(this.musicMsg.currentTime * 1000);
      if (this.timeBarLength < this.positionX + 5) {
        clearInterval(this.timer);
        this.$refs.timedBar.style.width = this.timeBarLength - 5 + "px";
        this.$refs.timePoint.style.left = this.timeBarLength - 5 + "px";
      } else {
        this.autoPlay();
      }
    },
    //进度条显示
    autoPlay() {
      this.autox = this.timeBarLength / this.musicMsg.duration;
      this.$refs.timePoint.style.left =
        this.musicMsg.currentTime * this.autox + "px";
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        if (this.timeBarLength < this.positionX + this.autox) {
          this.$refs.timedBar.style.width = this.timeBarLength - 5 + "px";
          this.$refs.timePoint.style.left = this.timeBarLength - 5 + "px";
          clearInterval(this.timer);
        } else {
          this.$refs.timedBar.style.width =
            this.musicMsg.currentTime * this.autox + "px";
          this.$refs.timePoint.style.left =
            this.musicMsg.currentTime * this.autox + "px";
        }
      }, 1000);
    },
    //音量控制
    dragVolume(e) {
      var slidedis = parseInt(e.touches[0].pageX);
      if (slidedis - 44 > this.volumeBarLength || slidedis - 44 < 0) {
        return;
      } else {
        this.volumePositionX = slidedis - 44;
        var volume = this.volumePositionX / this.volumeBarLength;
        this.$refs.volumePoint.style.left = this.volumePositionX + "px";
        this.$refs.volumedBar.style.width = this.volumePositionX + "px";
        this.$store.dispatch("setMusic", ["volume", volume]);
      }
    },
    lyricBoxDrift() {},
    //返回上一页面
    returnPre() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="scss" scoped>
.iconfont {
  font-size: 20px;
  color: #fff;
}
.slide-fade-enter-active {
  transition: all 0.3s linear;
}

.slide-fade-leave-active {
  transition: all 0.3s linear;
}

.slide-fade-enter,
.slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */

 {
  transform: translateY(100%);
  opacity: 1;
}

.slier-slide-fade-enter-active {
  transition: all 0.5s linear;
}

.slier-slide-fade-leave-active {
  transition: all 0.5s linear;
}

.slier-slide-fade-enter,
.slier-slide-fade-leave-to {
  transform: translateY(100%);
  opacity: 1;
}
.playWrap:after {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: inherit;
  filter: blur(20px);
  z-index: 1;
}

.changtouImg {
  transform: rotate(25deg);
  transform-origin: left top;
}
.playWrap {
  width: 100%;
  z-index: 0;
  .backBox {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(36, 36, 36, 0.333);
    z-index: 2;
  }
  .playBox {
    position: absolute;
    width: 100%;
    z-index: 2;
    .palyHeader {
      width: 95%;
      margin: auto;
      height: 45px;
      ul {
        display: flex;
        li {
          height: 45px;
        }
        .return {
          flex: 1;
          line-height: 45px;
        }
        .musicMsg {
          flex: 5;
          overflow: hidden;
          .stop {
            width: auto;
            margin: 5px 0;
            font-size: 16px;
            display: inline-block;
            color: #fff;
            white-space: nowrap;
          }
          .musicName {
            width: auto;
            margin: 5px 0;
            font-size: 16px;
            display: inline-block;
            color: #fff;
            white-space: nowrap;
            animation: 10s wordsLoop linear infinite normal;
          }
          .singer {
            font-size: 14px;
            color: #eee;
            display: block;
            i {
              font-size: 16px;
              color: #eee;
              line-height: 16px;
              margin-left: -6px;
            }
          }
        }
        .live {
          flex: 1;
          text-align: center;
          line-height: 40px;
        }
        .share {
          flex: 1;
          text-align: center;
          line-height: 40px;
        }
      }
    }
    .playMain {
      width: 95%;
      margin: 10px auto;
      height: 530px;
      overflow: hidden;
      .musicImg {
        position: relative;
        width: 100%;
        height: 500px;
        .changtou {
          width: 100%;
          margin: auto;
          height: 200px;

          img {
            position: relative;
            left: 50%;
            margin-left: -10px;
            z-index: 1;
          }
        }
        .changpian {
          position: relative;
          width: 300px;
          height: 300px;
          left: 50%;
          margin-left: -150px;
          margin-top: -100px;
          animation: musicimg 30s linear infinite;
          background: url(../../assets/images/1.png);
          background-size: cover;
          background-repeat: no-repeat;
          img {
            position: absolute;
            top: 50px;
            left: 50px;
            width: 200px;
            height: 200px;
            border-radius: 50%;
          }
        }
      }
      @-webkit-keyframes musicimg {
        0% {
          -webkit-transform: rotate(0deg);
        }

        25% {
          -webkit-transform: rotate(90deg);
        }

        50% {
          -webkit-transform: rotate(180deg);
        }

        75% {
          -webkit-transform: rotate(270deg);
        }

        100% {
          -webkit-transform: rotate(360deg);
        }
      }
      .musicLyric {
        width: 100%;
        .volume {
          position: relative;
          width: 100%;
          height: 20px;
          display: flex;
          .volumeImg {
            flex: 1;
          }
          .volumeBar {
            flex: 15;
            margin: 0 30px 0 10px;
            height: 2px;
            background: #888;
            border-radius: 1px;
            float: right;
            margin-top: 9px;
          }
          .volumedBar {
            position: absolute;
            width: 130px;
            height: 2px;
            background: #fff;
            margin: 9px 0px 9px 30px;
            .volumePoint {
              position: absolute;
              width: 10px;
              left: 130px;
              height: 10px;
              border-radius: 50%;
              background: #fff;
              top: -4px;
            }
          }
        }
        .lyric {
          height: 500px;
          overflow: hidden;
          .lyricList {
            position: relative;
            width: 100%;
            height: 32px;
            top: 50%;
            margin-top: -16px;
            .lyricBox {
              position: absolute;
              width: 100%;
              text-align: center;
              .text {
                line-height: 32px;
                color: rgba(255, 151, 151, 0.582);
                font-size: 16px;
              }
              .current {
                color: rgb(250, 171, 0);
                font-size: 20px;
              }
            }
          }
        }
      }
    }
    .playBar {
      width: 100%;
      position: fixed;
      bottom: 5px;
      .timeAxisBox {
        display: flex;
        width: 95%;
        height: 15px;
        margin: auto;
        .duration,
        .currentTime {
          color: #fff;
        }

        .timeAxis {
          flex: 12;
          max-width: 75%;
          position: relative;
          .timeBar {
            position: relative;
            width: 100%;
            margin: auto;
            height: 1px;
            margin-top: 7px;
            border-radius: 1px 1px 1px 1px;
            background: #bc381c;
          }
          .timedBar {
            width: 0px;
            position: relative;
            top: -2px;
            height: 3px;
            background: #fff;
            border-radius: 1px 1px 1px 1px;
            .timePoint {
              top: -4px;
              position: absolute;
              width: 10px;
              height: 10px;
              display: block;
              border-radius: 50%;
              background: #1b2af2;
            }
          }
        }
        span {
          display: block;
          font-size: 12px;
          line-height: 15px;
          flex: 2;
          text-align: center;
        }
      }
      .playControl {
        width: 95%;
        margin: auto;
        ul {
          width: 100%;
          height: 30px;
          display: flex;
          li {
            flex: 1;
            line-height: 30px;
            text-align: center;
          }
        }
      }
    }
  }
}

@keyframes wordsLoop {
  0% {
    transform: translateX(300px);
    -webkit-transform: translateX(300px);
  }
  100% {
    transform: translateX(-100%);
    -webkit-transform: translateX(-100%);
  }
}
</style>

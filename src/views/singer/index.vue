<template>
  <div class="singerWrap">
    <ReturnHeader :title="title"></ReturnHeader>
    <div class="singerCategoryTag">
      <div class="singer">
        <ul>
          <li
            v-for="(area,index) of singerCategory.area"
            :key="index"
            @click="setArea(index,area.id)"
          >
            <span :class="{active:index==scIndex}">{{area.name}}</span>
          </li>
        </ul>
      </div>
      <div class="singer">
        <ul>
          <li v-for="(sex,index) of singerCategory.sex" :key="index" @click="setSex(index,sex.id)">
            <span :class="{active:index==sexIndex}">{{sex.name}}</span>
          </li>
        </ul>
      </div>
    </div>
    <scroll class="singerLists" :pullup="pullup" @scrollToEnd="getMoreSinger()">
      <ul>
        <li v-for="(singer,index) of singerLists" :key="index" @click="getSingerArtists(singer.id)">
          <img :src="singer.img1v1Url" alt />
          <span>{{singer.name}}</span>
        </li>
      </ul>
    </scroll>
    <NavBar v-if="isMusicPlay"></NavBar>
  </div>
</template>
<script>
import NavBar from "@/components/navBar/navBar";
import ReturnHeader from "@/components/common/returnHeader";
import scroll from "@/components/common/scroll";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      title: "歌手",
      page: 1,
      scIndex: 0,
      sexIndex: 0,
      areaCode: "100",
      sexCode: "1",
      newCode: "1001",
      singerCategory: {
        area: [
          { id: "000", name: "全部" },
          { id: "100", name: "华语" },
          { id: "200", name: "港台" },
          { id: "200", name: "欧美" },
          { id: "600", name: "日本" },
          { id: "700", name: "韩国" },
          { id: "400", name: "其他" }
        ],
        sex: [
          { id: "0", name: "全部" },
          { id: "1", name: "男" },
          { id: "2", name: "女" },
          { id: "3", name: "组合" }
        ]
      },
      pullup: true,
      isMusicPlay: false
    };
  },
  mounted() {
    if (this.playMusic.name) {
      this.isMusicPlay = true;
    }
    var data = {
      cat: 1001,
      limit: 30,
      page: (this.page - 1) * 30
    };
    this.$store.dispatch("getSingerList", [data, "1001"]);
  },
  computed: {
    ...mapGetters(["singerLists", "singerArtist", "playMusic"])
  },
  watch: {
    playMusic() {
      this.isMusicPlay = true;
    }
  },
  methods: {
    setArea(index, id) {
      this.scIndex = index;
      this.areaCode = id;
      this.getSingerList(id);
    },
    setSex(index, id) {
      this.sexIndex = index;
      this.sexCode = id;
      this.getSingerList(id);
    },
    getSingerList(id) {
      if (id === "0") {
        this.sexCode = "1";
        if (this.areaCode + this.sexCode == this.newCode) {
          return;
        } else {
          this.page = 1;
          this.newcode = this.areaCode + this.sexCode;
        }
      } else if (id === "000") {
        this.areaCode = "001";
        if (this.areaCode + this.sexCode == this.newCode) {
          return;
        } else {
          this.page = 1;
          this.newcode = this.areaCode + this.sexCode;
        }
      } else {
        if (this.areaCode + this.sexCode == this.newCode) {
          return;
        } else {
          this.page = 1;
          this.newcode = this.areaCode + this.sexCode;
        }
      }
      var data = {
        cat: this.newcode,
        limit: 30,
        page: (this.page - 1) * 30
      };
      this.$store.dispatch("getSingerList", [data, this.newcode]);
    },
    getSingerArtists(id) {
      this.$store.dispatch("getSingerArtists", id).then(() => {
        this.$router.push("/singerMsg?id=" + id);
      });
    },
    getMoreSinger() {
      this.page = this.page + 1;
      var data = {
        cat: this.newCode,
        limit: 30,
        page: (this.page - 1) * 30
      };
      this.$store.dispatch("getSingerList", [data, this.newCode]);
    }
  },
  components: {
    ReturnHeader,
    scroll,
    NavBar
  }
};
</script>
<style lang="scss" scoped>
.active {
  background: rgb(253, 1, 1);
  color: #fff;
}
.singerWrap {
  width: 100%;
  .singerCategoryTag {
    width: 95%;
    margin: auto;
    overflow: hidden;
    .singer {
      width: 100%;
      margin: 5px 0;
      overflow: hidden;
      ul {
        width: 100%;
        overflow: hidden;
        li {
          width: 14%;
          float: left;
          span {
            display: block;
            width: 100%;
            height: 24px;
            border-radius: 12px;
            line-height: 24px;
            font-size: 15px;
            text-align: center;
          }
        }
      }
    }
  }
  .singerLists {
    width: 95%;
    margin: 10px auto;
    height: 520px;
    overflow: hidden;
    ul {
      width: 100%;
      margin-top: 20px;
      li {
        width: 100%;
        height: 30px;
        margin-top: 10px;
        img {
          display: inline-block;
          vertical-align: middle;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
        span {
          display: inline-block;
          margin-left: 20px;
          vertical-align: middle;
          color: burlywood;
          line-height: 30px;
        }
      }
    }
  }
}
</style>

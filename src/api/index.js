//调用数据接口
import ajax from "./ajax";
const BASE_URL = "http://localhost:3000";
const USER_API = "/api";

//歌单列表
export const reqSheetList = (data) =>
    ajax(BASE_URL + "/top/playlist", {
        limit: data.limit,
        order: 'hot',
        cat: data.cat,
        offset: data.offset
    }, "GET");

//推荐歌单
export const reqPersonaLizedList = (data) => ajax(BASE_URL + "/personalized", {
    limit: 12,
}, "GET")

//歌曲列表
export const reqSheetMusicList = (id) =>
    ajax(BASE_URL + "/playlist/detail", {
        id: id
    }, "GET");

//播放歌曲
export const reqPlayMusic = (id) =>
    ajax(BASE_URL + "/song/url", {
        id: id
    }, "GET");

//获取歌单类别
export const reqSheetCategoryList = () => ajax(BASE_URL + "/playlist/catlist", {}, "GET")

//获取歌手列表
export const reqSingerList = (data) => ajax(BASE_URL + "/artist/list", {
    cat: data.cat,
    limit: data.limit,
    offset: data.page
}, "GET")

//获取歌手单曲
export const reqSingerArtists = (id) => ajax(BASE_URL + "/artists", {
    id: id
}, "GET")

//获取歌手mv
export const reqSingerMvList = (data) => ajax(BASE_URL + "/artist/mv", {
    id: data.id,
    limit: data.limit,
    offset: data.offset
}, "GET")

//获取歌手专辑
export const reqSingerAlbumList = (data) => ajax(BASE_URL + "/artist/album", {
    id: data.id,
    limit: data.limit,
    offset: data.offset
})

//播放mv
export const reqPlayMv = (id) => ajax(BASE_URL + "/mv/url", {
    id: id,
}, "GET")

//mv详情
export const reqMvDetail = (id) => ajax(BASE_URL + "/mv/detail", {
    mvid: id,
}, "GET")

//播放视频
export const reqPlayVideo = (id) => ajax(BASE_URL + "/video/url", {
    id: id,
}, "GET")

//视频详情
export const reqVideoDetail = (id) => ajax(BASE_URL + "/video/detail", {
    id: id,
}, "GET")

//视频详情
export const reqTopList = (id) => ajax(BASE_URL + "/toplist/detail", {}, "GET")
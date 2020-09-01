/**
 * api接口的统一封装
 */
import api from "./http";

//获取wxjsSdkQs.stringify(query)
const getjsSdk = query => {
  return api({
    url: "/huanghelou1916-cake/api/getJsSign",
    method: "get",
    params: { url: query }
  });
};
const getUserInfo = query => {
  return api({
    url: "/huanghelou1916-cake/api/users",
    method: "post",
    data: query
  });
};
//获取排行榜
const getRank = () => {
  return api({
    url: "/huanghelou1916-cake/api/cakes/rank",
    method: "get"
  });
};
//收集食材
const getMaterials = query => {
  return api({
    url: "/huanghelou1916-cake/api/materials/" + query,
    method: "post"
  });
};
//收集食材
const checkMaterials = query => {
  return api({
    url: "/huanghelou1916-cake/api/materials/" + query,
    method: "get"
  });
};
//制作月饼
const makeCake = query => {
  return api({
    url: "/huanghelou1916-cake/api/cakes/make/" + query.userId,
    method: "post",
    data: query.data
  });
};
//查看月饼
const checkCake = query => {
  return api({
    url: "/huanghelou1916-cake/api/cakes/" + query,
    method: "get"
  });
};
//合成礼盒
const synthesis = query => {
  return api({
    url: "/huanghelou1916-cake/api/gift/synthesis/" + query.userId,
    method: "post",
    data: query.data
  });
};
//分享增加游戏次数
const shareGame = query => {
  return api({
    url: "/huanghelou1916-cake/api/frequencies/share/" + query.openid,
    mehod: "post"
  });
};
export {
  getjsSdk,
  getUserInfo,
  getRank,
  getMaterials,
  checkMaterials,
  makeCake,
  checkCake,
  synthesis,
  shareGame
};

/**
 * api接口的统一封装
 */
import api from "./http";
import Qs from "qs";

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
const getRank = query => {
  return api({
    url: "/huanghelou1916-cake/api/cakes/rank",
    method: "get"
  });
};
//收集食材
const getmaterials = query => {
  return api({
    url: "/huanghelou1916-cake/api/materials/" + query,
    method: "get"
  });
};
export { getjsSdk, getUserInfo, getRank, getmaterials };

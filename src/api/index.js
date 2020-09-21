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
//生成图片
const getImg = query => {
  return api({
    url: "/huanghelou1916-cake/api/pictures/upload",
    method: "post",
    data: query
  });
};

export { getjsSdk, getUserInfo, getImg };

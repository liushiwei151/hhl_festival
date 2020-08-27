/**
 * api接口的统一封装
 */
import api from "@/api/http";
import Qs from "qs";

//获取wxjsSdk
const getjsSdk = query => {
  return api({
    url: "/huanghelou1916-cake/api/getJsSign",
    method: "get",
    data: Qs.stringify(query)
  });
};

export default {
  getjsSdk
};

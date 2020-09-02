/**
 * axios请求封装，响应拦截，错误统一处理
 */
import Axios from "axios";
import Vue from "vue";
//链接
const axios = Axios.create({
  // baseURL: "test", //本地测试
  baseURL: "http://qrhhl.yunyutian.cn",
  timeout: 1000 * 12,
  headers: { "Content-Type": "application/json" }
});

// 提示函数
const tip = msg => {
  Vue.prototype.$Toast({
    msg: msg,
    duration: "1500"
  });
};
//wait
const wait = msg => {
  if (msg === "wait") {
    Vue.prototype.$Toast({
      msg: msg,
      duration: "15000000"
    });
  } else {
    Vue.prototype.$Toast({
      msg: "wait",
      duration: "0"
    });
  }
};
//请求失败后的错误统一处理
const errorHandle = (status, other) => {
  switch (status) {
    case 404:
      tip("网络请求不存在");
      break;
    default:
      tip(other);
  }
};
// 请求拦截器
axios.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么(后期在这里加上token)
    const userInfo = JSON.parse(localStorage.getItem("hhl_festival_userInfo"));
    if (userInfo && userInfo.token) {
      config.headers.token = userInfo.token;
    }
    wait("wait");
    return config;
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);
// 响应拦截器
axios.interceptors.response.use(
  // 请求成功
  res => {
    wait(false);
    console.log(Vue.prototype);
    if (
      res.data.code === 200 ||
      res.data.code === 1001 ||
      res.data.code === 1002 ||
      res.data.code === 1003
    ) {
      return Promise.resolve(res);
    } else {
      errorHandle(res.data.code, res.data.msg);
      return Promise.reject(res);
    }
  },
  // 请求失败
  error => {
    const { response } = error;
    console.log(error);
    if (response) {
      // 请求已发出，但是不在200的范围
      errorHandle(404, "出现未知错误");
      return Promise.reject(response);
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      // store.commit('changeNetwork', false);
      tip("请求失败，出现未知错误");
    }
  }
);

export default axios;

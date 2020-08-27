/**
 * axios请求封装，响应拦截，错误统一处理
 */
import Axios from "axios";
import Vue from "vue";

//链接
let axios = Axios.create({
  baseURL: "test", //测试
  timeout: 1000 * 12,
  headers: { "Content-Type": "application/x-www-form-urlencoded" }
});

// 提示函数

const tip = msg => {
  Vue.$toast({
    message: msg,
    duration: "1000"
  });
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
    // const token = store.state.token;
    // token && (config.headers.Authorization = token);
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
    if (res.data.code === 200) {
      return Promise.resolve(res.data.data);
    } else {
      return Promise.reject(res);
    }
  },
  // 请求失败
  error => {
    const { response } = error;
    console.log(error);
    if (response) {
      // 请求已发出，但是不在200的范围
      errorHandle(response.status, response.data.msg);
      return Promise.reject(response);
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      // store.commit('changeNetwork', false);
      tip("请求超时");
    }
  }
);

export default axios;

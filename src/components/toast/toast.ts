import Vue from "vue"; // 引入 Vue 是因为要用到 Vue.extend() 这个方法
import toast from "./toast.vue"; // 引入刚才的 toast 组件

const ToastConstructor = Vue.extend(toast);
let instance;
const Toast = function(options = {}) {
  instance = new ToastConstructor({ data: options }); // 渲染组件
  document.body.appendChild(instance.$mount().$el); // 挂载到 body 下
};

export default Toast;

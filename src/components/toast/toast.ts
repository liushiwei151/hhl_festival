/* eslint-disable */
import Vue from "vue"; // 引入 Vue 是因为要用到 Vue.extend() 这个方法
import toast from "./toast.vue"; // 引入刚才的 toast 组件

const ToastConstructor = Vue.extend(toast);
let instance;
function removeTags(tagClass: string) {
  const pa: any = document.getElementsByClassName(tagClass);
  if (pa !== null) {
    for (let m = 0; m < pa.length; m++) {
      if (pa[m] !== null) {
        pa[m].parentNode.removeChild(pa[m]);
      }
    }
  }
}
const Toast = function(options = { msg: "" }) {
  instance = new ToastConstructor({ data: options }); // 渲染组件
  if (options.msg === "wait") {
    removeTags("toast");
  }
  document.body.appendChild(instance.$mount().$el); // 挂载到 body 下
};

export default Toast;

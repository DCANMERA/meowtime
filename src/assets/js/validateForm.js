import Vue from 'vue';

//导入提示组件
import { Toast } from 'vant';

//注册提示组件
Vue.use(Toast);


/**
 * @module ValidateForm 表单验证
 * @param {}
 * @returns {}
 * @author : DCanmera
 * @since : 创建时间  2020-11-16 10:01:27
 * */

class ValidateForm {
  constructor() {

  }

  // 校正信息
  validate(data) {
    for (let key in data) {
      if (!data[key].reg.test(data[key].value)) {

        //提示错误信息
        Toast(data[key].errorMsg);

        //表单验证不通过
        return false;
      }
    }

    //表单验证通过
    return true;
  }
}


export const validateForm = new ValidateForm();

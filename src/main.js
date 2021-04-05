import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'

// 导入公共方法
import commonApi from './store/commonApi'

// 适配文件
import 'lib-flexible/flexible'

// 导入vant组件
import {
  Button,
  NavBar,
  Form,
  Field,
  Popup,
  Toast,
  Tabbar,
  TabbarItem,
  Swipe,
  SwipeItem,
  Area,
  Search,
  Grid,
  GridItem,
  Tab,
  Tabs,
  Sticky,
  Tag,
  Icon,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  Stepper,
  Empty,
  SwipeCell,
  Checkbox,
  SubmitBar,
  List,
  AddressEdit,
  AddressList,
  PullRefresh,
  Lazyload,
  Uploader,
  Cell,
  NoticeBar,
  CouponCell,
  CouponList
} from 'vant'

// 注册vant组件
Vue
  .use(Button)
  .use(NavBar)
  .use(Form)
  .use(Field)
  .use(Popup)
  .use(Toast)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Swipe)
  .use(SwipeItem)
  .use(Area)
  .use(Search)
  .use(Grid)
  .use(GridItem)
  .use(Tab)
  .use(Tabs)
  .use(Tag)
  .use(Sticky)
  .use(Icon)
  .use(GoodsAction)
  .use(GoodsActionIcon)
  .use(GoodsActionButton)
  .use(Stepper)
  .use(Empty)
  .use(SwipeCell)
  .use(Checkbox)
  .use(SubmitBar)
  .use(List)
  .use(AddressEdit)
  .use(AddressList)
  .use(PullRefresh)
  .use(Lazyload)
  .use(Uploader)
  .use(Cell)
  .use(NoticeBar)
  .use(CouponCell)
  .use(CouponList)


// 设置Vue原型公共方法
Vue.prototype.commonApi = commonApi;

//设置Vue原型属性
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=';

//配置请求基础路径
axios.defaults.baseURL = 'http://47.106.197.108:10002';

//axios拦截器，在发起请求之前执行
axios.interceptors.request.use(config => {

  //处理post请求参数, 进行参数序列化
  if (config.method == 'post') {

    //序列化post请求参数
    let paramsString = '';
    for (let key in config.data) {
      paramsString += key + '=' + config.data[key] + '&';
    }

    //重新赋值config.data
    config.data = paramsString.slice(0, -1);
  }

  //必须返回config
  return config;
})

// 注册axios
Vue.use(VueAxios, axios)

// 注册公共方法
Vue.use(commonApi)

// 格式化金额
Vue.filter('formattingPrice', (price, num = 2, symbol = '￥') => {
  return symbol + (price - 0).toFixed(num);
})

// 格式化日期
Vue.filter('formatDate', (v, format = 'yyyy-MM-dd hh:mm:ss') => {

  // 创建日期对象
  let date = new Date(v);

  // 格式化年份
  let year = date.getFullYear().toString();
  if (/(y+)/.test(format)) {

    // 获取匹配组的内容
    var content = RegExp.$1;
    format = format.replace(content, year.slice(year.length - content.length));
  }

  // 格式化月份、日份、时、分、秒
  let dateObj = {
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  };

  for (let key in dateObj) {

    // 创建动态正则表达式
    let reg = new RegExp(`(${key}+)`);

    if (reg.test(format)) {

      // 获取组匹配的内容
      let groupContent = RegExp.$1;
      format = format.replace(
        groupContent,
        dateObj[key] >= 10 ?
          dateObj[key] :
          groupContent.length == 2 ?
            '0' + dateObj[key] :
            dateObj[key]
      );
    }
  }

  return format;
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

# Meow Time 移动端咖啡商城

## 前言

- 基于 Vue 前端框架和 Vant 框架构建的交互式咖啡平台，通过 Vue 全家桶构建、指令的灵活运用、组件封装、组件之间通信，使各组件库可实现自由替换和组合。
- 建议使用谷歌浏览器查看或开发，iPhone 6/7/8 屏幕尺寸为 375px 宽和 667px 高是最佳效果。
- 如果感觉还不错的话，请赏个 ★Star 鼓励一哈，后续会持续更新和优化。

[在线效果演示](https://dcanmera.github.io/meowtime/)

# 项目架构

```
│  vue.config.js                      // webpack配置
├─public
|      img                            // ico适配图库
│      favicon.ico                    // ico图标
│      index.html                     // 入口html文件
│      robots.txt                     // 网站根目录下的ASCII编码的文本文件
└─src
    │  App.vue                        // 根组件
    │  main.js                        // 程序入口文件
    │  registerServiceWorker.js       // 简化缓存机制文件
    ├─assets
    │  ├─images                       // 存放公共图片文件夹
    │  ├─js
    │  │      areaList.js             // 地址文件
    │  │      validateForm.js         // 表单验证文件
    │  │      wallet.js               // 钱包数据
    │  └─scss
    │      │  variate.scss            // 公共变量样式文件
    │      │  reset.scss              // 清除样式文件
    │      │  common.scss             // 公用样式文件
    │      │  coffeewallet.scss       // 咖啡钱包样式文件
    │      │  coupon.scss             // 领券中心样式文件
    │      │  detail.scss             // 详情样式文件
    │      │  home.scss               // 首页样式文件
    │      │  like.scss               // 收藏样式文件
    │      │  login.scss              // 登录样式文件
    │      │  menu.scss               // 菜单样式文件
    │      │  order.scss              // 订单样式文件
    │      │  pay.scss                // 支付样式文件
    │      │  person.scss             // 个人资料样式文件
    │      │  profile.scss            // 我的样式文件
    │      │  secure.scss             // 安全中心样式文件
    │      └─shoppingbag.scss         // 购物袋样式文件
    ├─components
    │  ├─GoodsItem                    // 商品组件
    │  ├─LayoutBg                     // 界面背景组件
    │  ├─OrderItem                    // 订单组件
    │  ├─OrderList                    // 订单列表组件
    │  └─SelectRule                   // 商品规格组件
    ├─router
    │      index.js                   // 页面路由注册组件
    │      routes.js                  // 页面路由配置
    ├─store
    │      index.js                   // 状态管理仓库
    │      commonApi.js               // 自定义全局方法
    │      state.js                   // 单一状态树
    │      mutations.js               // 修改状态
    │      actions.js                 // 异步操作数据--未用到
    │      modules.js                 // 模块化--未用到
    └─views
       ├─address
       |  ├─Address.vue               // 地址页
       |  └─NewAddress.vue            // 新增地址页
       ├─coupon
       |  ├─Coffeewallet.vue          // 咖啡钱包页
       |  └─Coupon.vue                // 领券中心页
       ├─detail
       |  └─Detail.vue                // 详情页
       ├─like
       |  └─Like.vue                  // 收藏页
       ├─login
       |  ├─Forgot.vue                // 忘记密码页
       |  └─Login.vue                 // 登录与注册页
       ├─main
       |  ├─Home.vue                  // 首页
       |  ├─Menu.vue                  // 菜单页
       |  ├─Shoppingbag.vue           // 购物袋页
       |  └─Profile.vue               // 我的页
       ├─order
       |  ├─Order.vue                 // 订单页
       |  └─Pay.vue                   // 支付页
       ├─search
       |  └─Search.vue                // 搜索页
       ├─user
       |  ├─Person.vue                // 个人资料页
       |  └─Secure.vue                // 安全中心页
       └─ Main.vue                    // 主页
```

# 技术栈

- vue2.6.11
- vue-axios
- vue-router
- vuex
- vant2.10.12
- webpack
- ES6
- scss
- css3

# 功能模块

- 登录、注册、忘记密码模块
- 首页模块
- 菜单模块
- 购物袋模块
- 我的模块
- 商品详情模块
- 搜索模块
- 支付模块
- 领券中心模块
- 个人资料模块
- 咖啡钱包模块
- 订单模块
- 收藏模块
- 地址、新增地址模块
- 自定义商品模块
- 自定义背景模块
- 自定义订单模块
- 自定义订单列表模块
- 自定义商品规格选择模块

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

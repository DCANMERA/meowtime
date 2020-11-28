<template>
  <div class="M-main">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>

    <van-tabbar class="M-tab_bar"
                v-model="active"
                route>
      <van-tabbar-item v-for="(item,index) in tabData"
                       replace
                       :key="index"
                       :to="item.path"
                       :icon="item.iconName"
                       :name="active">
        <span class="M-tab_text">{{item.title}}</span>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
  export default {
    name: 'Main',

    data() {
      return {

        // 激活的状态表示那个页面下
        active: 'Home',

        // 导航栏的数据
        tabData: [{
            title: '首页',
            name: 'Home',
            path: '/main/home',
            iconName: 'home-o'
          },
          {
            title: '菜单',
            name: 'Menu',
            path: '/main/menu',
            iconName: 'apps-o'
          },

          {
            title: '购物袋',
            name: 'Shoppingbag',
            path: '/main/shoppingbag',
            iconName: 'bag-o'
          },
          {
            title: '我的',
            name: 'Profile',
            path: '/main/profile',
            iconName: 'user-o'
          }
        ]
      }
    }

  }

</script>

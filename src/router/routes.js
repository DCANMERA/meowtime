export const routes = [
  {
    path: '*',
    redirect: {
      name: 'Home'
    }
  },

  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/Login.vue'),
    meta: {
      pageTitle: '登录页',
      keepAlive: false
    }
  },

  {
    path: '/forgot',
    name: 'Forgot',
    component: () => import('@/views/login/Forgot.vue')
  },

  {
    path: '/main',
    name: 'Main',
    component: () => import('@/views/Main.vue'),
    meta: {
      pageTitle: '首页',
      keepAlive: true
    },
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/main/Home.vue'),
        meta: {
          pageTitle: '首页',
          keepAlive: true
        }
      },

      {
        path: 'menu',
        name: 'Menu',
        component: () => import('@/views/main/Menu.vue'),
        meta: {
          pageTitle: '菜单页',
          keepAlive: true
        }
      },

      {
        path: 'shoppingbag',
        name: 'Shoppingbag',
        component: () => import('@/views/main/Shoppingbag.vue'),
        meta: {
          pageTitle: '购物包页',
          keepAlive: false
        }
      },

      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/main/Profile.vue'),
        meta: {
          pageTitle: '用户页',
          keepAlive: false
        }
      }

    ]
  },

  {
    path: '/detail/:pid',
    name: 'Detail',
    component: () => import('@/views/detail/Detail.vue'),
    meta: {
      pageTitle: '详情页',
      keepAlive: false
    }
  },

  {
    path: '/pay',
    name: 'Pay',
    component: () => import('@/views/order/Pay.vue'),
    meta: {
      pageTitle: '支付页',
      keepAlive: false
    }
  },

  {
    path: '/order',
    name: 'Order',
    component: () => import('@/views/order/Order.vue')
  },

  {
    path: '/newAddress',
    name: 'NewAddress',
    component: () => import('@/views/address/NewAddress.vue')
  },

  {
    path: '/address',
    name: 'Address',
    component: () => import('@/views/address/Address.vue')
  },

  {
    path: '/person',
    name: 'Person',
    component: () => import('@/views/user/Person.vue')
  },

  {
    path: '/secure',
    name: 'Secure',
    component: () => import('@/views/user/Secure.vue')
  },

  {
    path: '/like',
    name: 'Like',
    component: () => import('@/views/like/Like.vue')
  },

  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/search/Search.vue')
  },

  {
    path: '/coupon',
    name: 'Coupon',
    component: () => import('@/views/coupon/Coupon.vue')
  },

  {
    path: '/coffeewallet',
    name: 'Coffeewallet',
    component: () => import('@/views/coupon/Coffeewallet.vue'),
    meta: {
      pageTitle: '钱包页',
      keepAlive: false
    }
  }

]

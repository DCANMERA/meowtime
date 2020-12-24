<template>
  <div class="M-home">

    <!-- 顶部搜索栏 -->
    <div class="M-header"
         ref="header">
      <form action="/">
        <van-search show-action
                    placeholder="请输入搜索关键词"
                    @focus="$goPage('Search')">
          <van-icon :name="require('@/assets/images/logo.png')"
                    slot="left" />
          <template #right-icon>
            <van-icon name="scan" />
          </template>
          <template #action>
            <div @click="$goPage('Search')">搜索</div>
          </template>
        </van-search>
      </form>
    </div>

    <van-pull-refresh v-model="pullDownToRefresh"
                      success-text="刷新成功"
                      @refresh="$onRefresh(pullDownToRefresh)">

      <!-- 首页广告栏 -->
      <div class="M-banner"
           ref="banner">
        <van-swipe @change="changeCurrentIndex"
                   :autoplay="5000"
                   loop>
          <van-swipe-item v-for="(item, index) in bannerData"
                          :key="index">
            <img :src="item.bannerImg"
                 :title="item.name"
                 @click="$goDetail(item.pid)" />
            <div class="M-description"
                 :class="{ M_description_act: currentIndex == index }">
              {{item.name}}
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>

      <!-- 主功能栏 -->
      <div class="M-sectorization"
           ref="sectorization">

        <!-- 地址与用户区域 -->
        <van-nav-bar class="M-nav">
          <template #left>
            <div class="M-homeAddress"
                 @click="getShop">
              <div class="M-icon">
                <van-icon name="map-marked" />
              </div>
              <div class="M-address_detail">
                <div class="M-shop">
                  <span>{{nowAddress}}</span>
                  <span class="M-distance M-distance_ml">></span>
                </div>
                <div class="M-distance">{{shop}}</div>
              </div>
            </div>
            <van-popup v-model="isShow"
                       get-container="#app"
                       class="M-select_shop">
              <van-area title="选择门店"
                        :area-list="areaList"
                        :columns-placeholder="['请选择', '请选择', '请选择']"
                        @cancel="cancelShow"
                        @confirm="confirmAddress" />
            </van-popup>
          </template>

          <div class="M-user"
               slot="right"
               @click="linkUser">
            <div class="M-home_userName">
              Hi, {{userInfo.nickName}}
            </div>
            <div class="M-hello">咖啡会让人脑洞大开哟</div>
          </div>
        </van-nav-bar>

        <!-- 功能指引区域 -->
        <van-grid class="M-guide"
                  clickable
                  :border="false">
          <van-grid-item v-for="(item,index) in guideData"
                         :key="index"
                         replace
                         @click="jumpJudgment(item)">
            <van-icon class="M-guide_icon"
                      slot="icon"
                      :name="item.iconName" />
            <span slot="text"
                  class="M-guide_text">{{item.title}}</span>
          </van-grid-item>
        </van-grid>
      </div>

      <!-- 首页商品栏 -->
      <div class="M-product">
        <van-list v-model="loading"
                  :finished="finished"
                  offset="40"
                  @load="loadData">
          <div slot="finished">已加载完</div>
          <div class="M-home_goods"
               ref="goods"
               v-for="(item,i) in goodsData"
               :key="i">
            <h3 class="M-goods_tip">{{item.title}}</h3>
            <div class="M-goods_content">
              <goods-item v-for="(value,j) in item.result"
                          :key="j"
                          :item="value"
                          @add="openPupop">
                <van-icon slot="hot"
                          :name="item.key == 'isHot' ? 'hot-sale' : 'new-arrival'" />
                <van-tag slot="discount"
                         type="danger">
                  {{item.key == 'isHot' ? '满减' : '促销'}}
                </van-tag>
                <div slot="sell">已售{{(i*j+1)*1732}}+</div>
              </goods-item>
            </div>
          </div>
        </van-list>
      </div>

    </van-pull-refresh>

    <!-- 商品规格弹出区弹窗挂载到 #app 节点下 -->
    <van-popup v-model="isShowPopup"
               get-container="#app"
               position="bottom"
               closeable
               close-icon="close">
      <select-rule :productItemData="goodsItem"
                   @closePupop="closePupop"></select-rule>
    </van-popup>
  </div>
</template>

<script>
  import '@/assets/scss/home.scss';
  import areaList from '@/assets/js/areaList';

  export default {
    name: 'Home',

    components: {
      GoodsItem: () => import('@/components/GoodsItem.vue'),
      SelectRule: () => import('@/components/SelectRule.vue')
    },

    data() {
      return {

        // 用户信息
        userInfo: '',

        // 下拉刷新bool
        pullDownToRefresh: false,

        // 当前轮播图片索引
        currentIndex: 0,

        // 轮播数据
        bannerData: [],

        // 地址
        nowAddress: '广州 天河区',

        // 地址编码
        shop: '440106',

        // 门店地址弹出
        isShow: false,

        // 门店地址数据
        areaList: areaList,

        // 快速指引栏数据
        guideData: [{
            title: '咖啡钱包',
            iconName: 'after-sale',
            url: 'Coffeewallet'
          },
          {
            title: '送TA礼物',
            iconName: 'point-gift-o',
            url: 'Menu'
          },
          {
            title: '优惠活动',
            iconName: 'coupon-o',
            url: 'Coupon'
          },
          {
            title: '我的喜爱',
            iconName: 'goods-collect-o',
            url: 'Like'
          }
        ],

        // 触发加载
        loading: true,

        //是否全部加载完成数据
        finished: false,

        //每次触底懒加载截取1条数据
        dataCount: 1,

        // 开始截取数据位置
        startIndex: 0,

        // 商品数据
        goodsData: [],

        // 所有商品数据
        goodsAllData: [{
            title: '爆款热销',
            value: 1,
            key: 'isHot'
          },
          {
            title: '咖啡周边',
            value: 'coffee',
            key: 'type'
          },
          {
            title: '冲调零食',
            value: 'latte',
            key: 'type'
          },
          {
            title: '舒适办公',
            value: 'rena_ice',
            key: 'type'
          }
        ],

        // 商品点击的数据
        goodsItem: [],

        // 商品规格弹出
        isShowPopup: false

      }
    },

    created() {

      // 赋值给banner栏轮播数据
      this.getBannerData();

      // 赋值给热卖产品数据
      this.accessToGoods();

      // 用户名调用
      this.getUserInfo();
    },

    watch: {
      '$store.state.userInfo'(payload) {
        this.userInfo = payload
      }
    },

    methods: {

      // 获取用户名
      getUserInfo() {
        this.$store.commit('changeInfo', this.$getUserInfo());
      },

      // 根据store的信息跳转指定页
      linkUser() {
        this.userInfo.isLogin ?
          this.$goPage('Profile') :
          this.$goPage('Login');
      },

      //修改轮播图片索引
      changeCurrentIndex(index) {
        this.currentIndex = index;
      },

      // 显示门店
      getShop() {
        this.isShow = true;
      },

      // 关闭门店
      cancelShow() {
        this.isShow = false;
      },

      // 获取门店
      confirmAddress(data) {
        this.cancelShow();
        this.nowAddress = data[1].name + ' ' + data[2].name;
        this.shop = data[2].code;
      },

      // 跳转指定页
      jumpJudgment(item) {

        // 调用判断用户的token
        if (this.$judgeToken(localStorage.getItem('__tk'))) return;
        this.$getUserInfo();
        this.$goPage(item.url);
      },

      // 获取轮播栏的处理逻辑
      getBannerData() {

        // 服务端未响应完成显示弹出
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0
        });

        // 请求轮播数据
        this.axios({
          method: "GET",
          url: "/banner",
          params: {
            appkey: this.appkey
          }
        }).then(res => {
          this.$toast.clear();
          if (res.data.code == 300) {
            this.bannerData = res.data.result;
            this.isLoading = false;
          }
        });
      },

      // 获取产品数据
      accessToGoods() {

        // 服务端未响应完成显示弹出
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0,
        });

        // 请求商品数据
        this.goodsAllData.map(item => {
          this.axios({
              method: "GET",
              url: "/typeProducts",
              params: {
                appkey: this.appkey,
                key: item.key,
                value: item.value
              }
            })
            .then(res => {
              if (res.data.code == 500) {
                item.result = res.data.result;
                item.result.map((value, index) => {
                  this.axios({
                      method: "GET",
                      url: "/productDetail",
                      params: {
                        appkey: this.appkey,
                        pid: value.pid
                      }
                    })
                    .then(result => {
                      let data = this.$formattingGoodsDetail(result.data.result[0]);
                      item.result[index].count = data.count;
                      item.result[index].rules = data.rules;
                      item.result[index].rule = data.rule;
                    });
                });
              }
            });
        });

        // 根据开始截取位置和截取数据数量设置购物袋显示的数据
        this.goodsData = this.goodsAllData.slice(
          this.startIndex,
          this.startIndex + this.dataCount
        );
        this.startIndex += this.dataCount;

        // 未加载
        this.loading = false;
      },

      // 懒加载购物袋数据
      loadData() {
        setTimeout(() => {

          // 在goodsAllData截取数据
          let data = this.goodsAllData.slice(
            this.startIndex,
            this.startIndex + this.dataCount
          );

          this.startIndex += this.dataCount;
          this.goodsData.push(...data);

          // 如果当前截取数据不足1条数据，下次不可能截取的数据
          if (data.length < this.dataCount) {

            // 没有数据可加载时， 需要finished修改为true， 这样可以不再onload事件
            this.finished = true;
          } else {

            // 每次触发onload事件都需要将loading修改为false
            this.loading = false;
          }
        }, 1500);
      },

      // 打开商品规格弹窗
      openPupop(value) {
        this.goodsItem = value.item;
        this.isShowPopup = value.show;
      },

      // 关闭商品规格弹窗并判断加购
      closePupop(value) {
        this.$addPurchase(this.goodsItem);
        this.isShowPopup = value;
      }

    }

  }

</script>

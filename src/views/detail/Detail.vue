<template>
  <div class="M-detail">
    <van-pull-refresh v-model="pullDownToRefresh"
                      success-text="刷新成功"
                      @refresh="$onRefresh(pullDownToRefresh)">
      <!-- 商品顶部栏 -->
      <van-tabs v-model="currentIndex"
                scrollspy
                sticky
                class="M-detail_nav"
                :class="{tabActive: isFixed}"
                @scroll="navScroll">

        <!-- 顶部返回箭头 -->
        <van-icon name="arrow-left"
                  class="M-detail_left"
                  slot="nav-left"
                  @click="$goBack()" />

        <!-- 顶部分享按钮 -->
        <van-icon name="share"
                  class="M-detail_right"
                  slot="nav-right"
                  @click="shareIt" />

        <!-- 商品栏 -->
        <van-tab title="商品">
          <!-- 商品轮播栏 -->
          <van-swipe class="M-detail_banner"
                     :loop="false"
                     @change="onChange">
            <van-swipe-item v-for="(item, index) in detailData"
                            :key="index">
              <img :src="item"
                   @click="swipeShow = true" />
            </van-swipe-item>
            <template #indicator>
              <div class="custom-indicator">
                {{ active + 1 }} / {{detailData.length}}
              </div>
            </template>
          </van-swipe>
          <van-image-preview v-model="swipeShow"
                             :images="detailData"
                             @change="onChange">
            <template v-slot:active>
              {{ active + 1 }} / {{detailData.length}}
            </template>
          </van-image-preview>

          <!-- 商品价格栏 -->
          <div class="M-detail_top">
            <div class="M-detail_pricee">
              <span class="M-detail_pricee_now">
                {{productData.price | formattingPrice}}
              </span>
              <span class="M-detail_pricee_pass">
                {{(productData.price-0)+ 43 | formattingPrice}}
              </span>
            </div>
            <div class="M-detail_tit">{{productData.name}}</div>
            <div class="M-detail_sell M-detail_tip">已售{{(productData.price-0)*100}}+件</div>
          </div>

          <!-- 优惠及折扣栏 -->
          <div class="M-detail_discount M-detail_common"
               @click="showDiscount">
            <span class="M-detail_tip">优惠</span>
            <van-tag class="M-giveaway"
                     type="danger"
                     mark>赠品</van-tag>
            <span class="M-giveaway_desc">满178赠价值75.9元挂耳</span>
            <van-icon class="M-giveaway_arrow"
                      name="arrow" />
          </div>

          <!-- 商品规格选择栏 -->
          <div class="M-detail_common">
            <div class="M-detail_select"
                 @click="specificationsShow">
              <div class="M-select_con">
                <div class="M-detail_tip">选择</div>
                <div>{{productData.name}}×{{productData.count}}</div>
              </div>
              <van-icon class="M-detail_select_arrow"
                        name="arrow" />
            </div>
            <div class="M-detail_shipping">
              <span class="M-detail_tip">运费</span>
              <span>免运费</span>
            </div>
          </div>
        </van-tab>

        <!-- 商品详情栏 -->
        <van-tab title="详情">
          <div class="M-productDetails M-detail_common"
               ref="scroll">
            <div class="M-productDetails_tip">商品详情</div>
            <div class="M-productDetails_content">
              <div class="M-productDetails_content_tip">
                {{productData.name}} / {{productData.enname}}
              </div>
              <div class="M-productDetails_content_desc"
                   v-for="(item,index) in productData.desc"
                   :key="index">
                <p style="padding: 10px 0;">{{index+1}}、{{item}}</p>
                <img :src="productData.small_img" />
                <img :src="productData.large_img" />
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </van-pull-refresh>

    <!-- 弹窗挂载到 #app 节点下 -->
    <van-popup v-model="isShow"
               get-container="#app"
               position="bottom"
               closeable
               close-icon="close">

      <!-- 分享弹出区 -->
      <van-grid class="M-share_popUp"
                v-show="isShareIt">
        <van-grid-item v-for="(item,index) in sharItData"
                       :key="index"
                       :icon="item.imgSrc"
                       :text="item.title"
                       @click="share(index)">
        </van-grid-item>
      </van-grid>

      <!-- 优惠及折扣弹出区 -->
      <div class="M-discount_popUp"
           v-show="isShowDiscount">
        <div class="M-discount_p_tip"><span>当前优惠</span></div>
        <div class="M-discount_p_aleat">立即下单可享优惠</div>
        <div class="M-discount_p_content">
          <div class="M-discount_ctn_item">
            <div class="M-discount_ctn_item_t">
              【喵时光潮牌】抢先购
            </div>
            <div class="M-discount_ctn_item_c">
              <div>
                <van-tag class="M-discount_ctn_item_icon"
                         mark
                         type="primary">赠品</van-tag>
              </div>
              <div class="M-discount_ctn_item_con">
                <div>
                  <span>满178赠</span>
                  <span class="M-discount_end">(赠完即止)</span>
                  <div class="M-discount_time">{{$discountCountdown()}}</div>
                </div>

                <!-- 因没有商家进一步接口所以跳回首页 -->
                <div class="M-discount_ctn_item_b"
                     @click="$goPage('Coffeewallet')">
                  <div class="M-discount_ctn_item_img">
                    <img :src="productData.small_img" />
                  </div>
                  <div>
                    <div class="M-discount_name">价值75.9挂耳</div>
                    <div class="M-discount_adreename">原产地系列B</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 商品规格弹出区 -->
      <select-rule :productItemData="productData"
                   v-show="isSpecifications">
        <van-goods-action slot="ruleAffirm">
          <van-goods-action-button text="加入购物袋"
                                   type="warning"
                                   @click="closePopup" />
          <van-goods-action-button text="立即购买"
                                   type="danger"
                                   @click="$addPurchase(productData,true)" />
        </van-goods-action>
      </select-rule>
    </van-popup>

    <!-- 商品结算栏 -->
    <van-goods-action class="M-goods_action">
      <van-goods-action-icon icon="bag-o"
                             class="M-addBag"
                             text="购物袋"
                             @click="$goPage('Shoppingbag')"
                             :class="{active: bagCount > 0}"
                             :badge="bagCount == 0 ? '' : bagCount" />
      <van-goods-action-icon icon="star"
                             text="收藏"
                             :class="{active: isLike}"
                             @click="toggleLikeProduct" />
      <van-goods-action-button type="warning"
                               text="加入购物袋"
                               @click="specificationsShow" />
      <van-goods-action-button type="danger"
                               text="立即购买"
                               @click="$addPurchase(productData,true)" />
    </van-goods-action>

  </div>
</template>

<script>
  import '@/assets/scss/detail.scss';
  import {
    ImagePreview
  } from 'vant';

  export default {

    name: 'Detail',

    components: {
      SelectRule: () => import('@/components/SelectRule.vue'),
      [ImagePreview.Component.name]: ImagePreview.Component
    },

    data() {
      return {

        // 下拉刷新bool
        pullDownToRefresh: false,

        // 触发加载
        loading: true,

        // 顶部导航吸顶bool
        isFixed: false,

        // 顶部导航标题
        navTitleData: ['商品', '详情'],

        // 顶部导航标题激活状态
        currentIndex: 0,

        // 详情轮播激活状态
        active: 0,

        // 详情轮播大图状态
        swipeShow: false,

        // 弹窗bool
        isShow: false,

        // 分享bool
        isShareIt: false,

        // 折扣弹出bool
        isShowDiscount: false,

        // 商品规格弹出bool
        isSpecifications: false,

        // 分享数据
        sharItData: [{
            title: '微信',
            imgSrc: require('@/assets/images/wechart.png')
          },
          {
            title: '朋友圈',
            imgSrc: require('@/assets/images/moments.png')
          },
          {
            title: '生成美图',
            imgSrc: require('@/assets/images/pic.png')
          },
        ],

        // 商品pid
        pid: '',

        // 商品图片数据
        detailData: [],

        // 商品详情数据
        productData: [],

        // 是否已经收藏商品
        isLike: false,

        // 购物袋数量
        bagCount: 0

      };
    },

    created() {

      // 截取pid
      this.pid = this.$route.params.pid;

      // 获取商品详情数据
      this.getProductDetail();

      // 查询用户是否已经收藏该商品
      this.findLike();

      // 查询用户的购物袋数量
      this.$shopBagCount();
    },

    methods: {

      // 顶部栏滚动
      navScroll(item) {
        this.isFixed = item.isFixed;
      },

      // 详情轮播
      onChange(index) {
        this.active = index;
      },

      // 获取商品详情数据
      getProductDetail() {
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0,
        });
        this.axios({
            method: "GET",
            url: "/productDetail",
            params: {
              appkey: this.appkey,
              pid: this.pid
            },
          })
          .then(res => {
            this.$toast.clear();
            if (res.data.code == 600) {
              let data = this.$formattingGoodsDetail(res.data.result[0]);
              this.productData = data;
              this.detailData = data.imgData;
              return;
            }
            this.$toast(res.data.msg);
          });
      },

      // 弹窗分享逻辑
      shareIt() {
        this.isShowDiscount = false;
        this.isSpecifications = false;
        this.isShow = true;
        this.isShareIt = true;
      },

      // 点击分享的逻辑
      share(index) {
        switch (true) {
          case index == 0:
            this.$toast('链接已生成\n快去微信好友分享吧');
            break;
          case index == 1:
            this.$toast('链接已生成\n快去微信朋友圈分享吧');
            break;

          case index == 2:
            this.$toast('已保存至相册');
            break;
        }

        // 关闭弹窗
        this.isShowDiscount = false;
        this.isSpecifications = false;
        this.isShow = false;
        this.isShareIt = false;
      },

      // 点击优惠与折扣
      showDiscount() {
        this.isShareIt = false;
        this.isSpecifications = false;
        this.isShow = true;
        this.isShowDiscount = true;
      },

      // 商品规格弹出
      specificationsShow() {
        this.isShareIt = false;
        this.isShowDiscount = false;
        this.isShow = true;
        this.isSpecifications = true;
      },

      // 切换商品规格
      toggleRule(item, i) {
        if (item.ruleIndex == i) {
          return;
        }
        item.ruleIndex = i;
      },

      // 关闭弹窗并加购
      closePopup() {
        this.isSpecifications = false;
        this.isShow = false;
        this.$addPurchase(this.productData);
      },

      // 查询用户是否收藏该商品
      findLike() {

        // 获取token
        let tokenString = localStorage.getItem('__tk');

        // 调用判断用户的token
        if (this.$judgeToken(tokenString)) return;

        // 发起查询收藏商品请求
        this.axios({
          method: 'GET',
          url: '/findlike',
          params: {
            appkey: this.appkey,
            pid: this.pid,
            tokenString
          }
        }).then(res => {
          this.$toast.clear();

          // 收藏商品成功
          if (res.data.code == 1000 && res.data.result.length > 0)
            this.isLike = true;
        });
      },

      // 收藏商品
      toggleLikeProduct() {

        // 获取token
        let tokenString = localStorage.getItem('__tk');

        // 调用判断用户的token
        if (this.$judgeToken(tokenString)) return;

        // 发起收藏商品请求
        this.axios({
            method: 'POST',
            url: this.isLike ? '/notlike' : '/like',
            data: {
              appkey: this.appkey,
              pid: this.pid,
              tokenString
            }
          })
          .then(res => {
            this.$toast.clear();
            if (res.data.code == 700) {

              // token检验无效,则跳到登录页面
              this.$goPage('Login');
            } else if (res.data.code == 800) {
              this.isLike = true; // 收藏商品成功
            } else if (res.data.code == 900) {
              this.isLike = false; // 取消收藏商品
            }
            this.$toast(res.data.msg);
          });
      }

    }

  }

</script>

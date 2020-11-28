<template>
  <div class="M-menu">

    <!-- 菜单页顶部栏 -->
    <div class="M-header">
      <form action="/">
        <van-search show-action
                    placeholder="请输入搜索关键词"
                    @focus="$goPage('Search')">
          <van-icon :name="require('@/assets/images/logo.png')"
                    slot="left" />
          <template #action>
            <div @click="$goPage('Search')">搜索</div>
          </template>
        </van-search>
      </form>
    </div>

    <div class="M-menu_goods">
      <van-tabs class="M-menu_goodsTabs"
                v-model="productActive"
                @change="topSellingItemData">
        <van-tab v-for="(item,index) in productTitle"
                 :key="index"
                 :title="item.title">
          <van-pull-refresh v-model="pullDownToRefresh"
                            success-text="刷新成功"
                            @refresh="$onRefresh(pullDownToRefresh)">
            <!-- 菜单页商品栏 -->
            <div class="M-goods">
              <goods-item v-for="(value,i) in product"
                          :key="i"
                          :item="value"
                          @add="openPupop">
                <van-icon slot="hot"
                          :name="item.key == 'isHot' ? 'hot-sale' : 'new-arrival'" />
                <div slot="discount"
                     class="M-discount_text">
                  <van-tag mark
                           type="primary">
                    {{item.key == 'isHot' ? '促销' : '满减'}}
                  </van-tag>
                </div>
                <div slot="sell">已售{{(index+1)*1732}}+</div>
              </goods-item>
            </div>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </div>

    <!-- 商品规格弹出区弹窗挂载到 #app 节点下 -->
    <van-popup v-model="isShowPopup"
               get-container="#app"
               position="bottom"
               closeable
               close-icon="close">
      <select-rule :productItemData="productItem"
                   @closePupop="closePupop"></select-rule>
    </van-popup>
  </div>
</template>

<script>
  import '@/assets/scss/menu.scss';

  export default {
    name: 'Menu',

    components: {
      GoodsItem: () => import('@/components/GoodsItem.vue'),
      SelectRule: () => import('@/components/SelectRule')
    },

    data() {
      return {

        // 下拉刷新bool
        pullDownToRefresh: false,

        // 触发加载
        loading: true,

        // 商品默认激活索引
        productActive: 0,

        // 商品标题数据
        productTitle: [{
            title: '推荐',
            value: 1,
            key: 'isHot'
          },
          {
            title: '拿铁',
            value: 'coffee',
            key: 'type'
          },
          {
            title: '咖啡',
            value: 'latte',
            key: 'type'
          },
          {
            title: '瑞纳冰',
            value: 'rena_ice',
            key: 'type'
          }
        ],

        // 商品数据
        product: [],

        // 商品点击的数据
        productItem: [],

        // 商品规格弹出bool
        isShowPopup: false
      }
    },

    created() {

      // 赋值给热卖产品数据
      this.topSellingItemData(this.productActive);
    },

    methods: {

      // 打开商品规格弹窗
      openPupop(value) {
        this.productItem = value.item;
        this.isShowPopup = value.show;
      },

      // 关闭商品规格弹窗并判断加购
      closePupop(value) {
        this.$addPurchase(this.productItem);
        this.isShowPopup = value;
      },

      // 获取产品数据
      topSellingItemData(active) {

        // 服务端未响应完成显示弹出
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0,
        });

        // 请求商品数据
        this.axios({
            method: "GET",
            url: "/typeProducts",
            params: {
              appkey: this.appkey,
              key: this.productTitle[active].key,
              value: this.productTitle[active].value
            }
          })
          .then(res => {
            this.$toast.clear();
            if (res.data.code == 500) {
              this.product = res.data.result;
              this.product.map((item, index) => {
                this.axios({
                    method: "GET",
                    url: "/productDetail",
                    params: {
                      appkey: this.appkey,
                      pid: item.pid
                    }
                  })
                  .then(res => {
                    let data = this.$formattingGoodsDetail(res.data.result[0]);
                    this.product[index].count = 1;
                    this.product[index].rules = data.rules;
                    this.product[index].rule = data.rule;
                    this.isLoading = false;
                  });
              });
            }
          });
      },

    },

  }

</script>

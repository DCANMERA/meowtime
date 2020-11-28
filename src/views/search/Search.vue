<template>
  <div class="M-search"
       :class="{active: goodsAllData.length==0}">

    <!-- 搜索栏 -->
    <div class="M-header"
         ref="header">
      <form action="/">
        <van-search v-model="searchValue"
                    show-action
                    ref="search"
                    placeholder="请输入搜索关键词"
                    @focus="isSearchHistory = true"
                    @search="search(searchValue)">
          <template #left>
            <van-icon name="arrow-left"
                      class="M-searchBack"
                      @click="$goBack()" />
          </template>
          <template #action>
            <div @click="search(searchValue)">搜索</div>
          </template>
        </van-search>
      </form>
      <div class="M-history"
           v-show="isSearchHistory">
        <span class="M-hisItem"
              v-for="(item,index) in historyData"
              :key="index"
              @click.stop="selectValue(item.value)">{{item.value}}</span>
        <div class="M-his-del"
             @click.stop="clearHistory"
             v-if="historyData.length > 0">清空历史</div>
      </div>
    </div>

    <!-- 商品栏 -->
    <div class="M-product">
      <goods-item v-for="(item, index) in goodsAllData"
                  :key="index"
                  :item="item"
                  @add="openPupop">
        <van-icon slot="hot"
                  :name="item.isHot == 0 ? 'hot-sale' : 'new-arrival'" />
        <van-tag slot="discount"
                 type="danger">
          {{item.isHot == 0 ? '满减' : '促销'}}
        </van-tag>
        <div slot="sell">已售{{(index+1)*673}}+</div>
      </goods-item>
    </div>

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
  export default {
    name: "Search",

    components: {
      GoodsItem: () => import('@/components/GoodsItem.vue'),
      SelectRule: () => import('@/components/SelectRule.vue'),
    },

    data() {
      return {

        // 搜索商品关键字
        searchValue: '',

        // 显示搜索历史bool
        isSearchHistory: true,

        // 搜索历史数据
        historyData: [],

        // 搜索商品数据
        goodsAllData: [],

        // 商品数据
        goodsData: [],

        // 商品规格弹出
        isShowPopup: false,

        // 商品点击的数据
        goodsItem: {}

      };
    },

    created() {
      this.$nextTick(() => {

        //获取搜索框
        let searchIpt = this.$refs.search.querySelector('[type="search"]');

        //获取焦点
        searchIpt.focus();

        if (JSON.parse(localStorage.getItem('_sh'))) {
          this.historyData = JSON.parse(localStorage.getItem('_sh'));
        }
      });
    },

    methods: {

      // 搜索
      search(value) {
        this.isSearchHistory = false;
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0,
        });
        if (value == '') {
          this.$toast('输入不能为空');
          return;
        }
        this.axios({
            method: "GET",
            url: "/search",
            params: {
              appkey: this.appkey,
              name: value,
            },
          })
          .then(res => {
            this.$toast.clear();
            if (
              res.data.code == "Q001" &&
              res.data.result.length > 0
            ) {
              this.goodsAllData = [];
              res.data.result.map(item => this.$getDetail(item.pid));
              if (
                this.historyData.filter(item => item.value == value).length == 0
              ) {
                this.historyData.unshift({
                  "value": value
                });
                localStorage.removeItem('_sh');
                localStorage.setItem('_sh', JSON.stringify(this.historyData));
              }
            } else {
              this.$toast('未找到相关商品');
            }
          });
      },

      selectValue(item) {
        if (this.searchValue != item) {
          this.searchValue = item;
          this.search(item);
        }
      },

      // 清除历史
      clearHistory() {
        if (localStorage.getItem('_sh')) {
          localStorage.removeItem('_sh');
          this.historyData = [];
        }
      },

      // 打开商品规格弹窗
      openPupop(value) {
        this.pid = value.item.pid;
        this.goodsItem = value.item;
        this.isShowPopup = value.show;
      },

      // 关闭商品规格弹窗并判断加购
      closePupop(value) {
        this.$addPurchase(this.goodsItem);
        this.isShowPopup = value;
      }

    },

  };

</script>

<style lang="scss">
  .M-search {
    box-sizing: border-box;
    height: 100%;
    padding-top: 45px;
    background-color: $assistBg;
  }

  .M-history {
    border-top: 1px solid transparent;
    width: 100%;
    position: absolute;
    left: 0;
    top: 46px;
    background-color: $mainBg;
    overflow: hidden;
  }

  .M-hisItem {
    display: inline-block;
    margin: $assistMargin;
    font-size: 14px;
    color: $inActiveColor;
  }

  .M-his-del {
    text-align: center;
    font-size: 14px;
    margin: $margin auto $margin * 1.5;
    color: $inActiveColor;
  }

  .M-search.active {
    background-color: $mainBg;
  }

  .M-search.active .M-product {
    padding: 0;
  }

  .M-search .M-searchBack {
    font-size: 16px;
    margin-right: $margin;
  }

  .M-search .M-product {
    padding: $margin;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    background-color: $assistBg;
  }

  .M-search .M-goods_hot {
    font-size: 26px;
  }

</style>

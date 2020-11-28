<template>
  <div class="M-like">
    <van-nav-bar title="我的收藏"
                 left-text="返回"
                 left-arrow
                 fixed
                 @click-left="$goBack()" />

    <layout-bg :class="{active: likeProduct.length == 0}">
      <div class="M-likeLsit"
           v-if="likeProduct.length > 0">
        <goods-item v-for="(item, index) in likeProduct"
                    :key="index"
                    :item="item">
          <van-icon slot="cart"
                    class="M-goodsLike"
                    name="like" />
          <div slot="sell">已售{{index*234+3245}}+</div>
          <van-icon slot="hot"
                    class="M-deleteLike"
                    name="clear"
                    @click.stop="removeLikeProduct(item.pid, index)" />
        </goods-item>
      </div>
      <van-empty description="没有收藏商品"
                 :image="require('@/assets/images/noorder.png')"
                 v-else>
        <van-button round
                    class="M-empty_btn"
                    @click="$goPage('Menu')">
          去喝一杯
        </van-button>
      </van-empty>
    </layout-bg>
  </div>
</template>

<script>
  import "@/assets/scss/like.scss";

  export default {
    name: "Like",

    components: {
      LayoutBg: () => import('@/components/LayoutBg.vue'),
      GoodsItem: () => import('@/components/GoodsItem.vue')
    },

    data() {
      return {

        // 收藏数据
        likeProduct: []
      }
    },

    created() {

      // 获取收藏商品
      this.getLikeProduct();
    },

    methods: {

      // 获取收藏商品
      getLikeProduct() {

        // 获取token
        let tokenString = localStorage.getItem('__tk');

        // 调用判断用户的token
        if (this.$judgeToken(tokenString)) return;

        this.axios({
            method: "GET",
            url: "/findAllLike",
            params: {
              appkey: this.appkey,
              tokenString,
            },
          })
          .then(res => {
            this.$toast.clear();
            if (res.data.code == 700) {

              // token检验无效,则跳到登录页面
              this.$router.push({
                name: "Login"
              });
            }
            if (res.data.code == 2000) {
              this.likeProduct = res.data.result;
            }
          });
      },

      // 删除收藏商品
      removeLikeProduct(pid, index) {

        // 获取token
        let tokenString = localStorage.getItem('__tk');

        // 调用判断用户的token
        if (this.$judgeToken(tokenString)) return;

        // 发起收藏商品请求
        this.axios({
            method: 'POST',
            url: '/notlike',
            data: {
              appkey: this.appkey,
              pid,
              tokenString
            }
          })
          .then(res => {
            this.$toast.clear();
            if (res.data.code == 700) {

              // token检验无效,则跳到登录页面
              this.$router.push({
                name: 'Login'
              });
            } else if (res.data.code == 900) {
              this.$toast('删除成功');
              this.likeProduct.splice(index, 1);
            } else {
              this.$toast('删除失败');
            }
          });
      }
    },
  };

</script>

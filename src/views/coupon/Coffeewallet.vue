<template>
  <div class="M-coffeewallet">

    <!-- 顶部栏 -->
    <van-nav-bar class="M-header"
                 title="咖啡钱包"
                 left-text="返回"
                 right-text="更多优惠"
                 left-arrow
                 fixed
                 @click-left="$goBack()"
                 @click-right="$goPage('Coupon')" />

    <!-- 优惠券栏 -->
    <div class="M-walletItem"
         v-for="(item, index) in wallet"
         :key="index">
      <div class="M-walletPrice">
        {{item.price | formattingPrice}}
      </div>
      <div class="M-couponAmount">拥有 <span>{{item.available}}</span> 张</div>
      <div class="M-walletTip">
        减￥{{item.valueDesc+item.unitDesc}} <br />
        <span>{{item.name}}</span>
      </div>
      <div class="M-walletCount">
        <van-checkbox v-model="item.checked"
                      @click="discountCheck" />
      </div>
    </div>

    <!-- 提交栏 -->
    <van-submit-bar :price="getTotalPrice"
                    button-text="提交订单"
                    @submit="onSubmit">
      <van-checkbox v-model="isCheckAll"
                    @click="checkAll">全选</van-checkbox>
    </van-submit-bar>
  </div>
</template>

<script>
  import '@/assets/scss/coffeewallet.scss';


  export default {
    name: 'Coffeewallet',

    data() {
      return {

        // 是否全选bool
        isCheckAll: false,

        // 优惠数据
        wallet: []
      };
    },

    // 每次进入刷新状态
    beforeRouteEnter(to, from, next) {
      to.meta.keepAlive = false;
      next();
    },

    // 设置返回与进入刷新状态
    beforeRouteLeave(to, from, next) {
      to.meta.keepAlive = true;
      next();
    },

    created() {
      this.wallet = JSON.parse(localStorage.getItem('__$'));

      if (this.wallet === null || this.wallet === undefined) {
        this.wallet = this.$store.state.wallet;
      }
    },

    methods: {

      // 全选
      checkAll() {
        this.wallet.map(item => item.checked = this.isCheckAll);
      },

      // 单选
      discountCheck() {
        this.isCheckAll = this.wallet.filter(item => item.checked).length == this.wallet.length;
      },

      // 提交订单
      onSubmit() {
        let price = (this.getTotalPrice / 100).toFixed(2) + '元';
        if (this.wallet.filter(item => item.checked).length == 0) {
          this.$toast('未选择代金券');
          return;
        };
        this.$dialog.confirm({
            title: '支付界面',
            message: '是否支付 ' + price,
          })
          .then(() => {

            // on confirm
            this.$toast.clear();
            this.$store.commit('changeWallet', this.wallet);
            this.$toast('支付成功');
          })
          .catch(() => {

            // on cancel
          });
      }
    },

    computed: {

      // 计算总价
      getTotalPrice() {
        return this.wallet
          .filter(item => item.checked)
          .reduce((p, n) => p + (n.price * n.count), 0) * 100;
      }
    }
  }

</script>

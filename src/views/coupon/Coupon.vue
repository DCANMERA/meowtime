<template>
  <div class="M-coupon">
    <van-nav-bar class="M-header"
                 title="领券中心"
                 left-text="返回"
                 right-text="全部优惠"
                 left-arrow
                 fixed
                 @click-left="$goBack()"
                 @click-right="$goPage('Coffeewallet')" />

    <div class="M-couponMain">
      <div class="M-coupon_item"
           v-for="(item,index) in coupon"
           :key="index"
           @click="goCaffeeWallet">
        <div class="M-couponImg"
             :style="{backgroundImage: 'url('+item.img+')'}">
        </div>
        <div class="M-couponCon">
          <div class="M-couponTip">
            <div class="M-couponMainTip">
              {{item.tip}}
            </div>
            <div class="M-couponSubTip">
              {{item.subTip}}
            </div>
          </div>
          <div class="M-couponTime">
            {{item.time}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import '@/assets/scss/coupon.scss';

  export default {
    name: 'Coupon',

    data() {
      return {

        coupon: [{
          tip: '充5赠3 充10赠7',
          subTip: '全国门店均可使用',
          img: require('@/assets/images/coupon.jpg'),
          time: '2020.11.04 - 2021.08.31'
        }]
      };
    },

    methods: {

      goCaffeeWallet() {

        // 获取token
        let tokenString = localStorage.getItem('__tk');

        // 调用判断用户的token
        if (this.$judgeToken(tokenString)) return;

        this.$goPage('Coffeewallet');
        this.$toast.clear();
      }
    }
  }

</script>

<template>
  <div class="M-address"
       :class="{active: list.length == 0}">
    <van-nav-bar title="地址列表"
                 left-text="返回"
                 left-arrow
                 fixed
                 @click-left="$goBack()" />
    <layout-bg :class="{active: list.length == 0}">
      <van-address-list :list="list"
                        default-tag-text="默认"
                        :switchable="false"
                        @add="$goPage('NewAddress')"
                        @edit="edit" />
      <van-empty description="暂无收货地址"
                 :image="require('@/assets/images/deliveryAddress.png')"
                 v-if="list.length == 0">
      </van-empty>
    </layout-bg>
  </div>
</template>

<script>
  export default {
    name: 'Address',

    components: {
      LayoutBg: () => import('@/components/LayoutBg.vue')
    },

    data() {
      return {

        // 地址列表
        list: []
      };
    },

    created() {

      // 获取地址列表数据
      this.getAddressData();
    },

    methods: {

      // 获取地址列表数据
      getAddressData() {

        // 获取token
        let tokenString = localStorage.getItem('__tk');

        // 调用判断用户的token
        if (this.$judgeToken(tokenString)) return;

        this.axios({
            method: 'GET',
            url: '/findAddress',
            params: {
              appkey: this.appkey,
              tokenString
            }
          })
          .then(res => {
            this.$toast.clear();
            if (res.data.code == 700) {
              this.$goPage('Login'); // token检验无效,则跳到登录页面
            }

            if (res.data.code == 20000) {
              res.data.result.map(v => {
                v.isDefault = Boolean(v.isDefault);
                v.id = v.aid;
                v.address = v.province + v.city + v.county + v.addressDetail;
              });

              this.list = res.data.result;
            }
          });
      },

      // 编辑地址
      edit(item) {

        // item.aid: 地址aid
        this.$router.push({
          name: 'NewAddress',
          query: {
            aid: item.aid
          }
        });
      }
    }
  }

</script>

<style lang="scss">
  .M-address {
    height: 100%;
    background-color: $assistBg;

    .van-tag--danger {
      background-color: $mainColor;
    }

    .van-address-item .van-radio__icon--checked .van-icon {
      background-color: $mainColor;
      border-color: $mainColor;
    }

    .van-address-list {
      padding: 0;
    }

    .van-address-item {
      border-bottom: 1px solid $assistBg;
    }

    .van-address-item:last-of-type {
      border-bottom: none;
    }

    .van-button--danger {
      background-color: $mainColor;
      border-color: $mainColor;
    }

    .van-address-list__bottom {
      bottom: 20px;
      background-color: unset;
    }
  }

  .active {
    background-color: $mainBg;
  }

</style>

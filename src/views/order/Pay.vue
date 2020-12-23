<template>
  <div class="M-pay">
    <van-nav-bar class="M-pay_head"
                 title="确认订单"
                 left-text="返回"
                 left-arrow
                 fixed
                 @click-left="$goBack()" />
    <div class="M-pay_main">

      <!-- 收货地址栏 -->
      <div class="M-select_address"
           @click="showSelectAddressList">
        <van-icon class="M-address_arrow"
                  name="arrow" />
        <div class="M-address_tip">
          <van-icon name="location" />
          <span>选择地址</span>
        </div>
        <div class="M-user_con">
          <div class="M-user_info">
            <div class="M-user_name">
              <div>{{currentAddress.name}}</div>
              <div class="M-default_address"
                   v-if="currentAddress.isDefault">默认</div>
            </div>
            <div class="M-user_phone">{{currentAddress.tel}}</div>

          </div>
          <div class="M-detail_address">{{currentAddress.address}}</div>
        </div>
      </div>

      <!-- 订单信息栏 -->
      <div class="M-order_info">
        <OrderList info-title-left="订单信息"
                   :count="productInfo.count"
                   :total="productInfo.total"
                   :date="productInfo.date | formatDate">
          <OrderItem v-for="(item, index) in products"
                     :key="index"
                     :item="item">
            <div slot="rules">{{item.rule}}</div>
            <div slot="count">×{{item.count}}</div>
          </OrderItem>

          <!-- 优惠券单元格 -->
          <van-coupon-cell :coupons="coupons"
                           :chosen-coupon="chosenCoupon"
                           @click="showList = true"
                           class="M-couponCell" />

          <!-- 优惠券列表 -->
          <van-popup v-model="showList"
                     round
                     position="bottom"
                     class="M-payCoupon">
            <van-coupon-list :coupons="coupons"
                             :chosen-coupon="chosenCoupon"
                             :disabled-coupons="disabledCoupons"
                             :show-exchange-bar="false"
                             @change="onChange" />
          </van-popup>
        </OrderList>
      </div>
    </div>



    <!-- 支付按钮栏 -->
    <div class="M-pay_submit">
      <van-button block
                  round
                  @click="payRemind">提交订单</van-button>
    </div>

    <!-- 地址选择栏 -->
    <van-popup is-link
               position="bottom"
               closeable
               v-model="isOpen"
               class="M-select_adress">
      <div class="M-address_title">选择地址</div>
      <van-address-list v-model="chosenAddressId"
                        :list="list"
                        default-tag-text="默认"
                        @add="$goPage('NewAddress')"
                        @select="selectAddress"
                        @edit="edit" />
    </van-popup>
  </div>
</template>

<script>
  import "@/assets/scss/pay.scss";

  export default {
    name: "Pay",

    components: {
      OrderItem: () => import('@/components/OrderItem.vue'),
      OrderList: () => import('@/components/OrderList.vue')
    },

    data() {
      return {

        // 优惠弹窗bool
        showList: false,

        // 优惠选择下标
        chosenCoupon: -1,

        // 优惠的数据
        coupons: [],

        // 不可用数据
        disabledCoupons: [],

        // 开启地址弹窗bool
        isOpen: false,

        // 选择地址的id
        chosenAddressId: "",

        // 地址列表
        list: [],

        // 选择当前地址
        currentAddress: {},

        // 购物袋的sid
        sids: [],

        // 需要购买的商品数据
        products: [],

        // 商品数量、订单总价及订单时间
        productInfo: {
          count: 0,
          total: 0,
          date: ''
        },

        // 未使用优惠前的总价
        total: 0,

        // 所有券的数组
        couponData: []

      };
    },

    created() {

      // 订单时间
      this.productInfo.date = new Date();

      // 截取查询参数
      this.sids = this.$route.query.sids.split('-');

      // 获取所有的优惠券
      if (JSON.parse(localStorage.getItem('__$'))) {
        this.couponData = JSON.parse(localStorage.getItem('__$'));
      } else {
        this.couponData = this.$store.state.wallet;
      }

      // 根据sids获取购物袋数据
      this.getShopbagBySids();

      // 获取地址列表数据
      this.getAddressData();

    },

    methods: {

      // 优惠切换并减去优惠价格
      onChange(index) {
        this.showList = false;

        // 选中后减掉优惠价并判断下标不能相同
        if (index >= 0 && this.chosenCoupon != index) {
          this.productInfo.total = this.total;
          if (this.total >= this.coupons[index].astrict) {
            this.productInfo.total -= this.coupons[index].valueDesc;
          }
        }

        // 不用优惠券时总价变为之前的总价
        if (index == -1) {
          this.productInfo.total = this.total;
        }
        this.chosenCoupon = index;
      },

      // 选择地址
      selectAddress(item, index) {
        this.isOpen = false;
        this.currentAddress = item;
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
      },

      // 展示选择地址列表
      showSelectAddressList() {
        this.isOpen = true;
      },

      // 获取地址列表数据
      getAddressData() {

        // 获取token
        let tokenString = localStorage.getItem('__tk');

        // 调用判断用户的token
        if (this.$judgeToken(tokenString)) return;

        this.axios({
            method: "GET",
            url: "/findAddress",
            params: {
              appkey: this.appkey,
              tokenString,
            },
          })
          .then(res => {
            this.$toast.clear();
            if (res.data.code == 700) {

              // token检验无效,则跳到登录页面
              this.$goPage('Login');
            }

            if (res.data.code == 20000) {
              res.data.result.map(v => {
                v.isDefault = Boolean(v.isDefault);
                v.id = v.aid;
                v.address = v.province + v.city + v.county + v.addressDetail;

                // 选择默认地址
                if (v.isDefault) {
                  this.chosenAddressId = v.aid;
                  this.currentAddress = v;
                }
              });

              this.list = res.data.result;
            }
          });
      },

      // 根据sids获取购物袋数据
      getShopbagBySids() {

        // 获取token
        let tokenString = localStorage.getItem('__tk');

        // 调用判断用户的token
        if (this.$judgeToken(tokenString)) return;

        this.axios({
            method: "GET",
            url: "/commitShopcart",
            params: {
              appkey: this.appkey,
              tokenString,
              sids: JSON.stringify(this.sids)
            },
          })
          .then(res => {
            this.$toast.clear();
            if (res.data.code == 700) {

              // token检验无效,则跳到登录页面
              this.$goPage('Login');
            } else if (res.data.code == 50000) {
              if (res.data.result.length == 0) {

                // 如果没有商品可购买，则跳转到购物袋页面
                return this.$goPage('Home');
              }

              res.data.result.map(v => {
                this.productInfo.count += v.count;
                this.productInfo.total += v.count * v.price;
              });
              this.products = res.data.result;

              // 记录总价以便优惠时的计算
              this.total = this.productInfo.total;

              // 获取可用的优惠券
              this.coupons = this.couponData.filter(item => item.available > 0 && this.total >= item.astrict);

              // 获取不可用的优惠券
              this.disabledCoupons = this.couponData.filter(item => item.available == 0 || this.total < item.astrict);
              this.disabledCoupons.map(item => {
                switch (true) {
                  case item.available == 0:
                    item.reason = "未拥有该代金券";
                    break
                  case this.total < item.astrict:
                    item.reason = "未达到优惠额度";
                    break
                }
              });
            } else {
              this.$toast(res.data.msg);
            }
          });
      },

      // 结算订单
      pay() {

        // 获取token
        let tokenString = localStorage.getItem('__tk');

        // 调用判断用户的token
        if (this.$judgeToken(tokenString)) return;

        this.axios({
            method: "POST",
            url: "/pay",
            data: {
              appkey: this.appkey,
              tokenString,
              sids: JSON.stringify(this.sids),
              phone: this.currentAddress.tel,
              address: this.currentAddress.address,
              receiver: this.currentAddress.name
            },
          })
          .then(res => {
            this.$toast.clear();
            if (res.data.code == 700) {

              // token检验无效,则跳到登录页面
              this.$goPage('Login');
            } else {
              this.$toast(res.data.msg);
              setTimeout(() => {

                // 跳转到订单页面
                this.$goPage('Order');
              }, 100);
            }
          });
      },

      // 结算提示
      payRemind() {

        // 收货地址不能为空
        if (!this.currentAddress.address) {
          this.$toast('地址栏不能为空');
          return
        };

        this.$dialog.confirm({
            title: '确认订单',
            message: '是否支付' + this.productInfo.total + '元'
          })
          .then(() => {
            if (this.chosenCoupon >= 0) {
              this.coupons[this.chosenCoupon].available--;
            }
            this.coupons.push(...this.disabledCoupons);
            localStorage.removeItem('__$');
            localStorage.setItem('__$', JSON.stringify(this.coupons))
            this.pay();
          })
          .catch((err) => {
            this.$toast.clear();
          });
      }

    },
  };

</script>

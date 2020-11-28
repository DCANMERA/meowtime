<template>
  <div class="M-order"
       :class="{active: orderData.length==0}">
    <van-nav-bar title="我的订单"
                 left-text="返回"
                 left-arrow
                 fixed
                 @click-left="$goBack()" />
    <layout-bg>
      <van-tabs v-model="tabIndex"
                v-if="isHas"
                sticky
                :offset-top="46"
                @change="changeTab">
        <van-tab :title="item.title"
                 v-for="(item, index) in tabData"
                 :key="index">
          <div class="M-order_content"
               v-if="orderData.length > 0">
            <div class="M-order_cntItem"
                 v-for="(v, k) in orderData"
                 :key="v.oid">
              <order-list :info-title-left="v.oid"
                          :date="v.date | formatDate"
                          :count="v.count"
                          :total="v.total"
                          :is-right="true"
                          @confirm-receive="confirmReceive(v, k)"
                          @remove="removeOrder(v.oid, k)"
                          :is-receive="v.status == 2">
                <order-item v-for="(value, idx) in v.data"
                            :item="value"
                            :key="idx">
                  <div slot="rules">{{value.rule}}</div>
                  <div slot="count">×{{value.count}}</div>
                </order-item>
              </order-list>
            </div>
          </div>
          <van-empty description="没有订单数据"
                     :image="require('@/assets/images/noorder.png')"
                     v-else>
            <van-button round
                        class="M-empty_btn"
                        @click="$goPage('Menu')">
              去喝一杯
            </van-button>
          </van-empty>
        </van-tab>
      </van-tabs>
      <van-empty description="没有订单数据"
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
  import "@/assets/scss/order.scss";

  export default {
    name: "Order",

    components: {
      LayoutBg: () => import('@/components/LayoutBg.vue'),
      OrderList: () => import('@/components/OrderList.vue'),
      OrderItem: () => import('@/components/OrderItem.vue')
    },

    data() {
      return {

        //激活tab标签的下标
        tabIndex: 0,

        tabData: [{
            title: "全部"
          },
          {
            title: "配送中"
          },
          {
            title: "已完成"
          }
        ],

        // 订单商品数据
        orderData: [],

        // 全部没有订单数据
        isHas: true
      };
    },

    created() {

      // 根据订单状态获取订单数据
      this.getOrderDataByStatus();
    },

    methods: {

      // 切换订单状态 0: 全部, 1: 配送中, 2: 已完成
      changeTab(name, title) {

        // 根据订单状态获取订单数据
        this.getOrderDataByStatus();
      },

      //根据订单状态获取订单数据
      getOrderDataByStatus() {

        // 获取token
        let tokenString = localStorage.getItem('__tk');

        // 调用判断用户的token
        if (this.$judgeToken(tokenString)) return;

        this.axios({
            method: "GET",
            url: "/findOrder",
            params: {
              tokenString,
              appkey: this.appkey,
              status: this.tabIndex,
            },
          })
          .then(res => {
            this.$toast.clear();
            if (res.data.code == 700) {

              // token检验无效,则跳到登录页面
              this.$router.push({
                name: "Login"
              });
            } else if (res.data.code == 70000) {

              // 如果全部没有订单数据，则移除tab
              if (this.tabIndex == 0 && res.data.result.length == 0) {
                // this.isHas = false;
                return;
              }

              // 按照订单编号oid进行分类
              let orderDatas = [];
              res.data.result.map(v => {

                // 查找orderDatas的订单数据，如果找到，则将该商品存放在当前订单里面，累加当前订单的商品数量和当前订单的总金额
                for (let i = 0; i < orderDatas.length; i++) {
                  if (orderDatas[i].oid == v.oid) {
                    orderDatas[i].data.push(v);
                    orderDatas[i].count += v.count;
                    orderDatas[i].total += v.count * v.price;
                    return;
                  }
                }

                // 如果找不到当前订单数据，则初始化当前订单数据
                let o = {};
                o.oid = v.oid;
                o.count = v.count;
                o.total = v.count * v.price;
                o.status = v.status;
                o.date = v.createdAt;
                o.data = [v];
                orderDatas.push(o);
              });

              this.orderData = orderDatas;
              this.orderData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            }
          });
      },

      // 确认收货
      confirmReceive(item, index) {

        // 获取token
        let tokenString = localStorage.getItem('__tk');

        // 调用判断用户的token
        if (this.$judgeToken(tokenString)) return;

        this.axios({
            method: "POST",
            url: "/receive",
            data: {
              tokenString,
              appkey: this.appkey,
              oid: item.oid
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

            if (res.data.code == 80000) {
              if (this.tabIndex == 1) {
                this.orderData.splice(index, 1);
              }
              item.status = 2;
            }

            this.$toast(res.data.msg);
          });
      },

      //删除订单
      removeOrder(oid, index) {

        // 获取token
        let tokenString = localStorage.getItem('__tk');

        // 调用判断用户的token
        if (this.$judgeToken(tokenString)) return;

        this.axios({
            method: "POST",
            url: "/removeOrder",
            data: {
              tokenString,
              oid,
              appkey: this.appkey
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

            if (res.data.code == 90000) {
              this.orderData.splice(index, 1);
            }

            this.$toast(res.data.msg);
          });
      },

    }
  };

</script>

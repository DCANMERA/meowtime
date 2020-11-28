<template>
  <div class="M-shoppingbag">

    <!-- 购物袋顶部栏 -->
    <van-sticky>
      <van-nav-bar class="M-shoppingbag_nav"
                   :left-text="'购物袋('+shoppingbagData.length+')'"
                   fixed
                   @click-right="isEdit = !isEdit">
        <template #right>
          <div v-if="shoppingbagData.length > 0">{{isEdit ? '完成' : '管理'}}</div>
        </template>
      </van-nav-bar>
    </van-sticky>

    <van-pull-refresh v-model="pullDownToRefresh"
                      success-text="刷新成功"
                      @refresh="$onRefresh(pullDownToRefresh)">

      <!-- 订单栏没有数据区域 -->
      <van-empty class="M-shoppingbar_desc"
                 :image="require('@/assets/images/noorder.png')"
                 description="购物袋空空如也，去逛一逛!"
                 v-if="shoppingbagData.length == 0">
        <van-button round
                    class="M-empty_btn"
                    @click="$goPage('Menu')">
          去喝一杯
        </van-button>
      </van-empty>

      <!-- 订单有数据区域 -->
      <div class="M-shoppingbag_main"
           v-if="shoppingbagData.length > 0">
        <div class="M-shoppingbag_advertising"
             @click="$goPage('Coupon')"></div>

        <!-- 懒加载组件 -->
        <van-list v-model="loading"
                  :finished="finished"
                  offset="20"
                  @load="loadData">
          <div slot="finished">
            <van-button round
                        class="M-empty_btn"
                        @click="$goPage('Menu')">
              去喝一杯
            </van-button>
          </div>
          <div class="M-shoppingbag_product">
            <div class="M-product_item"
                 v-for="(item, index) in shoppingbagData"
                 :key="item.sid">
              <van-swipe-cell>
                <div class="M-product_cell_item">
                  <div class="M-product_check">
                    <van-checkbox @change.self="simpleSelect"
                                  v-model="item.isChecked" />
                  </div>

                  <order-item :item="item">
                    <template #rules>
                      <div class="M-rules_name"
                           @click.stop="showRules(index)">
                        <span v-if="item.rule !='undefined'">
                          {{item.rule}}
                        </span>
                        <span v-else
                              v-for="(value,j) in item.rules"
                              :key="j">
                          {{
                           j == item.rules.length - 1 ?
                           value.rule[value.ruleIndex].title :
                           value.rule[value.ruleIndex].title+'/'
                          }}
                        </span>
                      </div>
                      <van-icon class="M-product_rules_arrow"
                                name="arrow-down" />
                    </template>
                    <van-stepper slot="count"
                                 v-model="item.count"
                                 theme="round"
                                 button-size="20"
                                 integer
                                 @focus.stop="changeCount(item)"
                                 @blur.stop="changeCount(item)"
                                 @plus="changeCount(item)"
                                 @minus="changeCount(item)" />
                  </order-item>
                </div>
                <template #right>
                  <van-button square
                              type="danger"
                              text="删除"
                              @click="removeOne(index, item.sid)" />
                </template>
              </van-swipe-cell>
            </div>
          </div>
        </van-list>
      </div>

    </van-pull-refresh>

    <div v-if="shoppingbagData.length > 0">

      <!-- 订单提交栏 -->
      <van-submit-bar class="M-submitorder"
                      v-show="!isEdit"
                      :price="total"
                      :button-text="'结算('+checkOrderNum+')'"
                      @submit="commit">
        <van-checkbox v-model="isAllChecked"
                      @click="allSelect">全选</van-checkbox>
      </van-submit-bar>

      <!-- 订单删除栏 -->
      <van-submit-bar class="M-submitorder M-delorder"
                      v-show="isEdit"
                      :price="total"
                      button-text="删除"
                      @submit="removeSelected">
        <van-checkbox v-model="isAllChecked"
                      @click="allSelect">全选</van-checkbox>
      </van-submit-bar>
    </div>

    <!-- 商品规格弹出区弹窗挂载到 #app 节点下 -->
    <van-popup v-model="isShowPopup"
               get-container="#app"
               position="bottom"
               closeable
               close-icon="close">
      <select-rule :productItemData="productItemData"
                   :popup="isShowPopup"
                   @closePupop="closePopup">
      </select-rule>
    </van-popup>
  </div>
</template>

<script>
  import "@/assets/scss/shoppingbag.scss";

  export default {
    name: "Shoppingbar",

    components: {
      SelectRule: () => import('@/components/SelectRule.vue'),
      OrderItem: () => import('@/components/OrderItem.vue')
    },

    data() {
      return {

        // 商品规格弹出bool
        isShowPopup: false,

        // 单选
        isCheck: false,

        // 全选
        isAllChecked: false,

        //是否处于编辑状态
        isEdit: false,

        // 下拉刷新bool
        pullDownToRefresh: false,

        // 触发加载
        loading: true,

        //是否全部加载完成数据
        finished: false,

        //所有购物袋数据
        allshoppingbagData: [],

        // 单个商品数据
        productItemData: [],

        //每次触底懒加载截取8条数据
        dataCount: 8,

        //开始截取购物袋数据位置
        startIndex: 0,

        //购物袋数据
        shoppingbagData: [],

        //订单总金额
        total: 0,

        // 勾选的订单数
        checkOrderNum: 0,
      };
    },

    created() {

      // 获取购物袋数据
      this.getshoppingbagData();
    },

    // 每次进入刷新状态
    beforeRouteEnter(to, from, next) {
      to.meta.keepAlive = false;
      next();
    },

    methods: {

      // 关闭商品规格弹窗
      closePopup(value) {
        this.isShowPopup = value;
      },

      // 获取购物袋数据
      getshoppingbagData() {

        // 获取token
        let tokenString = localStorage.getItem('__tk');

        // 调用判断用户的token
        if (this.$judgeToken(tokenString)) return;

        // 发起获取购物袋数据请求
        this.axios({
            method: "GET",
            url: "/findAllShopcart",
            params: {
              appkey: this.appkey,
              tokenString,
            },
          })
          .then(res => {
            this.$toast.clear();
            if (res.data.code == 700) {
              this.$goPage('Login'); // token检验无效,则跳到登录页面
            }

            if (res.data.code == 5000) {

              // 请求商品的详情数据并添加商品规格详情
              for (let i = 0; i < res.data.result.length; i++) {
                this.axios({
                  method: "GET",
                  url: "/productDetail",
                  params: {
                    appkey: this.appkey,
                    pid: res.data.result[i].pid
                  }
                }).then(result => {
                  if (result.data.code == 600) {
                    let data = this.$formattingGoodsDetail(result.data.result[0]);
                    res.data.result[i].rules = data.rules;
                  }
                });
              }

              res.data.result.map(v => v.isChecked = false);
              this.allshoppingbagData = res.data.result;

              // 根据开始截取位置和截取数据数量设置购物袋显示的数据
              this.shoppingbagData = this.allshoppingbagData.slice(
                this.startIndex,
                this.startIndex + this.dataCount
              );
              this.startIndex += this.dataCount;

              // 未加载
              this.loading = false;

            }
          });
      },

      // 懒加载购物袋数据
      loadData() {

        setTimeout(() => {

          // 在allshoppingbagData截取数据
          let data = this.allshoppingbagData.slice(
            this.startIndex,
            this.startIndex + this.dataCount
          );

          this.startIndex += this.dataCount;
          this.shoppingbagData.push(...data);
          this.isAllChecked = false;
          this.simpleSelect();

          // 如果当前截取数据不足8条数据，下次不可能截取的数据
          if (data.length < this.dataCount) {

            // 没有数据可加载时，需要finished修改为true，这样可以不再onload事件
            this.finished = true;
          } else {

            // 每次触发onload事件都需要将loading修改为false
            this.loading = false;
          }
        }, 1500);
      },

      // 弹出商品规格选择
      showRules(index) {
        this.isShowPopup = true;

        // 规格弹窗后根据rule选择激活索引
        this.shoppingbagData[index].rule.split('/').map(item => {
          this.shoppingbagData[index].rules.map((value, i) => {
            value.rule.map((v, j) => v.title == item ? value.ruleIndex = j : j);
          });
        });

        // 点击后赋值给单个商品数据用于传值与SelectRule组件
        this.productItemData = this.shoppingbagData[index];
      },

      // 全选
      allSelect() {
        this.shoppingbagData.map(v => v.isChecked = this.isAllChecked);
        this.sum();
      },

      // 单选
      simpleSelect() {
        this.sum();
        for (let i = 0; i < this.shoppingbagData.length; i++) {
          if (!this.shoppingbagData[i].isChecked) {
            this.isAllChecked = false;
            return;
          }
        }
        this.isAllChecked = true;
      },

      // 单个删除
      removeOne(index, sid) {

        // 获取token
        let tokenString = localStorage.getItem('__tk');

        // 调用判断用户的token
        if (this.$judgeToken(tokenString)) return;

        this.axios({
            method: "POST",
            url: "/deleteShopcart",
            data: {
              appkey: this.appkey,
              tokenString,
              sids: JSON.stringify([sid])
            },
          })
          .then(res => {
            this.$toast.clear();
            if (res.data.code == 700) {
              this.$goPage('login'); // token检验无效,则跳到登录页面
            }

            if (res.data.code == 7000) {

              // 如果删除成功, 则移除页面的商品，重新计算订单总金额
              this.shoppingbagData.splice(index, 1);
              this.sum();
            }

            this.$toast(res.data.msg);
          })
      },

      // 判断是否勾选商品
      isSelectProduct(msg) {
        for (let i = 0; i < this.shoppingbagData.length; i++) {
          if (this.shoppingbagData[i].isChecked) {

            // 如果存在勾选商品
            return true
          }
        }
        return false;
      },

      // 删除选择
      removeSelected() {
        let isHas = this.isSelectProduct();
        if (!isHas) {
          this.$toast('请选择删除的商品');
          return;
        }

        // sids: 勾选商品的购物袋sid集合
        let sids = [];
        this.shoppingbagData.map(v => v.isChecked && sids.push(v.sid));

        // 获取token
        let tokenString = localStorage.getItem('__tk');

        // 调用判断用户的token
        if (this.$judgeToken(tokenString)) return;

        this.axios({
            method: "POST",
            url: "/deleteShopcart",
            data: {
              appkey: this.appkey,
              tokenString,
              sids: JSON.stringify(sids)
            },
          })
          .then(res => {
            this.$toast.clear();
            if (res.data.code == 700) {
              this.$goPage('login'); // token检验无效,则跳到登录页面
            }

            if (res.data.code == 7000) {

              //移除页面的数据
              for (let i = 0; i < this.shoppingbagData.length; i++) {
                if (this.shoppingbagData[i].isChecked) {
                  this.shoppingbagData.splice(i, 1);
                  i--;
                }
              }

              // 如果删除成功, 则移除页面的商品，重新计算订单总金额
              this.sum();
            }
            this.$toast(res.data.msg);
          });
      },

      // 修改数量
      changeCount(item) {
        event.stopPropagation();

        // 获取token
        let tokenString = localStorage.getItem('__tk');

        // 调用判断用户的token
        if (this.$judgeToken(tokenString)) return;

        this.axios({
            method: "POST",
            url: "/modifyShopcartCount",
            data: {
              appkey: this.appkey,
              tokenString,
              sid: item.sid,
              count: item.count
            },
          })
          .then(res => {
            this.$toast.clear();
            switch (true) {
              case res.data.code == 700:
                this.$goPage('Login'); // token检验无效,则跳到登录页面

                break;
              case res.data.code == 6000:
                if (item.isChecked) {
                  this.sum();
                }

                break;

              default:
                this.$toast(res.data.msg);
            }
          });
      },

      // 计算订单总金额及选中的订单数
      sum() {
        this.total = 0;
        this.checkOrderNum = this.shoppingbagData.filter(item => {
          if (item.isChecked) {
            this.total += item.price * item.count;
            return item;
          }
        }).length;
        this.total *= 100;
      },

      // 提交订单，跳转到订单页面
      commit() {
        let isHas = this.isSelectProduct();
        if (!isHas) {
          this.$toast('请选择购买的商品');
          return;
        }

        // sids: 勾选商品的购物袋sid集合
        let sids = [];
        this.shoppingbagData.map(v => v.isChecked && sids.push(v.sid));

        // 跳转到结算页面且携带sids查询参数
        this.$router.push({
          name: 'Pay',
          query: {
            sids: sids.join('-')
          }
        });
      },

    },



  };

</script>

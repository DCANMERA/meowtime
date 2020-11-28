<template>
  <div class="M-order_list">
    <div class="M-orderlist_item">
      <div class="M-info_content">
        <div class="M-info_title">{{infoTitleLeft}}</div>
        <div class="M-info_tip_con"
             v-if="isRight"
             @click="confirmReceive">
          <div v-if="!isReceive">确认收货</div>
          <div class="M-complete"
               v-else>
            <span>已完成</span>
            <van-icon class="M-delete"
                      size="19"
                      name="delete"
                      @click="remove" />
          </div>
        </div>
      </div>

      <div>
        <!-- 商品信息 -->
        <div class="M-cell_list">
          <slot></slot>
        </div>

        <div class="M-bottom_info">
          <div class="M-circle">
            <div class="M-circle_left"></div>
            <div class="M-circle_right"></div>
          </div>
          <div class="M-order_date"
               v-if=" date != '' ">{{date | formatDate}}</div>
          <div class="M-order_tol">
            <div>共计 {{count}} 件商品</div>
            <div class="M-total">合计 <span>{{total | formattingPrice}}</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "OrderList",

    components: {
      OrderItem: () => import('../components/OrderItem'),
    },

    props: {

      // 左边的标题
      infoTitleLeft: {
        type: String,
        default: '左边标题'
      },

      // 是否显示右边信息
      isRight: {
        type: Boolean,
        default: false
      },

      // 订单时间
      date: {
        default () {
          return new Date().getTime();
        }
      },

      // 商品数量
      count: {
        type: Number,
        default: 0
      },

      // 订单总金额
      total: {
        type: Number,
        default: 0
      },

      //确认收货
      isReceive: {
        type: Boolean,
        default: false
      }

    },

    methods: {

      // 确认收货
      confirmReceive() {
        this.$emit('confirm-receive');
      },

      // 删除
      remove() {
        this.$emit('remove');
      }
    }
  };

</script>

<style lang="scss">
  .M-orderlist_item {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    background-color: $mainBg;
    padding: $margin;
  }

  .M-info_content {
    display: flex;
    justify-content: space-between;
    align-content: center;
  }

  .M-info_title {
    font-size: 16px;
    color: $mainColor;
    font-weight: 600;
    transform: scale(.9);
  }

  .M-info_tip_con {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    transform: scale(.99);
    color: $mainColor;
    cursor: pointer;
  }

  .M-complete {
    display: flex;
    align-items: center;
    justify-content: center;
  }


  .M-cell_list {
    padding: 20px 0;
    border-bottom: 1px dashed rgba($color: $inActiveColor, $alpha: .8);
  }

  .M-cell_list .M-product_info {
    margin-bottom: 20px;
  }

  .M-cell_list .M-product_info:last-of-type {
    margin-bottom: 0;
  }

  .M-bottom_info {
    padding-top: 20px;
    font-size: 14px;
    position: relative;
  }

  .M-total {
    color: $goodsPriceColor;
  }

  .M-total>span {
    font-size: 20px;
  }

  .M-circle {
    position: absolute;
    left: 0;
    top: -10px;
    width: 100%;
    height: 20px;
  }

  .M-circle_left,
  .M-circle_right {
    width: 20px;
    height: 20px;
    background-color: $assistBg;
    border-radius: 50%;
    position: absolute;
  }

  .M-circle_left {
    left: -20px;
  }

  .M-circle_right {
    right: -20px;
  }

  .M-order_tol {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 700;
  }

  .M-delete {
    width: 19px;
    height: 19px;
    margin-left: 5px;
    color: $inActiveColor;
  }

  .M-order_date {
    margin-bottom: 10px;
    font-size: 12px;
    color: $inActiveColor;
  }

</style>

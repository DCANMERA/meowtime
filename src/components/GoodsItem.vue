<template>
  <div class="M-goods_item"
       @click.stop="$goDetail(item.pid)">

    <!-- 商品图片 -->
    <div class="M-goods_img">
      <img :src="item.smallImg || item.small_img" />
    </div>

    <!-- 商品信息 -->
    <div class="M-goods_info">

      <!-- 商品标题 -->
      <div class="M-goods_title"
           :title="item.name">
        {{item.desc}}
      </div>

      <!-- 商品价格 -->
      <div class="M-goods_price">
        <div class="M-goods_now_price">
          {{item.price | formattingPrice}}
        </div>
        <div class="M-goods_passed_price">
          {{item.price * 1.5 | formattingPrice}}
        </div>
      </div>

      <!-- 商品折扣 -->
      <div class="M-discount">
        <slot name="discount"></slot>
      </div>

      <!-- 商品销售情况 -->
      <div class="M-goods_bot">
        <div class="M-goods_sell">
          <slot name="sell"></slot>
        </div>
        <div class="M-goods_gocart"
             @click.stop="addshoppCart">
          <slot name="cart">
            <van-icon name="shopping-cart" />
          </slot>
        </div>
      </div>
    </div>

    <!-- 商品是否热卖 -->
    <div class="M-goods_hot">
      <slot name="hot"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'GoodsItem',

    props: {
      item: {
        type: Object,
        default () {
          return {
            createdAt: "--",
            desc: "----",
            enname: "----",
            id: 4,
            isHot: 1,
            largeImg: require('../assets/images/nullpic.png'),
            name: "--",
            pid: "--",
            price: "",
            smallImg: require('../assets/images/nullpic.png'),
            type: "coffee",
            typeDesc: "咖啡",
            updatedAt: "--",
            rules: [{}]
          };
        }
      }
    },

    components: {
      SelectRule: () => import('../components/SelectRule.vue')
    },

    methods: {
      addshoppCart() {
        this.$emit('add', {
          show: true,
          item: this.item
        });
      }
    },

  }

</script>

<style lang="scss">
  .M-goods_item {
    width: calc(50% - 5px);
    border-radius: 5px;
    margin-bottom: $margin;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    box-shadow: 0 2px 16px 0 rgba(31, 35, 41, .05);
    background-color: $mainBg;
  }

  .M-goods_info {
    padding: $margin;
    background-color: $mainBg;
  }

  .M-goods_title {
    font-size: 14px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-weight: 700;
    margin-bottom: $margin;
  }

  .M-goods_price {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }

  .M-goods_now_price {
    color: $goodsPriceColor;
    font-weight: 700;
    font-size: 16px;
  }

  .M-goods_passed_price {
    margin-left: 5px;
    color: $inActiveColor;
    text-decoration: line-through;
    font-size: 8px;
    text-align: left;
    transform: scale(.9);
  }

  .M-discount .van-tag--danger,
  .M-discount .van-tag--detault {
    color: $activeColor;
    background-color: $discountColor;
  }

  .M-goods_bot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 5px;
  }

  .M-goods_sell {
    color: $inActiveColor;
    font-size: 8px;
  }

  .M-goods_gocart {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid $mainColor;
    background-color: $mainBg;
    color: $mainColor;
    display: flex;
    align-items: center;
    justify-content: center;

  }

  .M-goods_hot {
    position: absolute;
    right: 5px;
    top: 0;
    color: $mainColor;
  }

</style>

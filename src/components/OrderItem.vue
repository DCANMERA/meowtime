<template>
  <div class="M-product_info"
       @click.stop="$goDetail(item.pid)">
    <div class="M-product_infoImg">
      <img :src="item.small_img || item.smallImg" />
    </div>
    <div class="M-product_infoConent">
      <div class="M-product_name">
        {{item.name}} / {{item.enname}}
      </div>

      <div class="M-product_rules">
        <slot name="rules"></slot>
      </div>

      <div class="M-product_priceWrap">
        <div class="M-product_price">
          {{item.price | formattingPrice}}
        </div>
        <div class="M-product_count">
          <slot name="count"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'OrderItem',

    props: {
      item: {
        type: Object,
        default () {
          return {
            small_img: require('../assets/images/nullpic.png'),
            name: '----',
            enname: '----',
            price: '----'
          };
        }
      }
    },
  }

</script>

<style lang="scss">
  .M-product_info {
    display: flex;
    overflow: hidden;
    position: relative;
    width: 100%;
    background-color: $mainBg;
  }

  .M-product_infoImg {
    width: 120px;
    border-radius: 5px;
    overflow: hidden;
    margin-right: $margin;
  }

  .M-product_infoImg>img {
    height: 100%;
  }

  .M-product_infoConent {
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }

  .M-product_name {
    color: $defaultColor;
    font-size: 14px;
    white-space: nowrap;
    margin-bottom: 13px;
    overflow: hidden;
    font-weight: 500;
    padding: 1px 0;
  }

  .M-product_rules {
    letter-spacing: 2px;
    color: $inActiveColor;
    font-size: 13px;
    border-radius: 3px;
    position: relative;
  }


  .M-product_priceWrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: $margin;
  }

  .M-product_price {
    font-size: 16px;
    color: $goodsPriceColor;
    font-weight: 700;
  }

  .M-product_count {
    font-size: 14px;
    color: $inActiveColor;
  }

</style>

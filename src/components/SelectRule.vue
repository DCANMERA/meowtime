<template>
  <div class="M-specification">
    <div class="M-specification_con">
      <div class="M-specification_img">
        <img :src="productItemData.small_img || productItemData.smallImg" />
      </div>
      <div>
        <div class="M-rule_price">
          {{productItemData.price | formattingPrice}}
        </div>
        <div class="M-rule_select">
          <span>已选：</span>
          <span v-for="(item,index) in productItemData.rules"
                :key="index">
            {{item.rule[item.ruleIndex].title}}
          </span>
        </div>
      </div>
    </div>
    <div class="M-rule_items"
         v-for="(item, i) in productItemData.rules"
         :key="i">
      <div class="M-rule_title">
        {{item.title}}
      </div>
      <div class="M-rule_item_con">
        <div class="M-rule_item_main"
             v-for="(v, j) in item.rule"
             :key="j"
             :class="{active: item.ruleIndex == j, 'large-text': v.title.length >= 4}"
             @click="toggleRule(item, j, i)">
          {{v.title}}
        </div>
      </div>
    </div>
    <div class="M-select_wrapper">
      <div class="M-select_count">选择数量</div>
      <div class="M-product_count">
        <van-stepper v-model="productItemData.count"
                     theme="round"
                     button-size="20"
                     integer />
      </div>
    </div>
    <slot name="ruleAffirm">
      <van-button class="M-affirm"
                  slot="ruleAffirm"
                  round
                  type="info"
                  @click.stop="affirmRule">确认</van-button>
    </slot>
  </div>
</template>

<script>
  export default {
    name: 'SelectRule',

    props: {
      productItemData: {
        type: Object,
        default () {
          return {
            count: 1,
            price: '28.9',
            rules: [{
              rule: [{
                title: "冷"
              }, {
                title: "热"
              }],
              ruleIndex: 0,
              title: "温度"
            }],
            small_img: require('../assets/images/nullpic.png'),
          };
        }
      }
    },

    methods: {

      // 关闭弹窗
      affirmRule() {
        this.$emit('closePupop', false);

      },

      // 切换单个商品规格
      toggleRule(item, j, i) {
        if (item.ruleIndex == j) {
          return;
        }
        item.ruleIndex = j;
        let rule = [];
        this.productItemData.rules.map(v => rule.push(v.rule[v.ruleIndex].title));
        this.productItemData.rule = rule.join('/');
        this.$set(
          this.productItemData.rules,
          i,
          this.productItemData.rules[i]
        );
        this.$forceUpdate();
      },

    },
  }

</script>

<style lang="scss">
  #app .van-popup {
    height: unset;
  }

  .M-specification {
    padding: $margin $assistMargin $margin * 2;
    margin-top: 6px;
    position: relative;
  }

  .M-specification_con {
    display: flex;
    align-items: center;
  }

  .M-specification_img {
    width: 100px;
    height: 100px;
    border-radius: 5px;
    overflow: hidden;
    margin-right: $margin;
  }

  .M-rule_price {
    font-size: 22px;
    color: $goodsPriceColor;
    font-weight: 700;
    margin-bottom: $margin;
  }

  .M-rule_select {
    font-size: 14px;
    color: $defaultColor;

  }

  .M-rule_select {
    letter-spacing: 2px;
  }

  .M-rule_items {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 20px;
    padding: $margin;
  }

  .M-rule_title {
    width: 15%;
    font-size: 14px;
    color: $defaultColor;
    font-weight: 700;
  }

  .M-rule_item_con {
    display: flex;
    justify-content: space-between;
  }

  .M-rule_item_main {
    font-size: 14px;
    padding: 8px 20px;
    background-color: rgba($color: $inActiveColor, $alpha: .5);
    color: $mainBg;
    margin: 0 $margin;
    border-radius: 7px;
  }

  .M-rule_item_main:first-of-type {
    margin-left: 0;
  }

  .M-rule_item_main:last-of-type {
    margin-right: 0;
  }

  .M-rule_item_main.active {
    background: linear-gradient(to right, #ffd01e, #ff8917);
  }

  .M-select_wrapper {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: $margin * 3;
  }

  .M-select_count {
    font-size: 14px;
    font-weight: 700;
    color: $defaultColor;
  }

  .M-affirm {
    width: 100%;
    color: $mainBg;
    background: linear-gradient(to right, #ff6034, #ee0a24);
    border: none;
    margin-top: 70px;
  }

  .M-specification .van-goods-action {
    width: calc(100% - $margin);
    position: static;
    margin-top: 70px;
  }

</style>

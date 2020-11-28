<template>
  <div class="M-new_address">
    <van-nav-bar :title="aid ? '编辑地址' : '新增地址'"
                 left-text="返回"
                 left-arrow
                 fixed
                 @click-left="$goBack()" />
    <van-address-edit show-postal
                      show-set-default
                      :show-delete="!!aid"
                      :area-columns-placeholder="['选择省', '选择市', '选择区']"
                      :area-list="areaList"
                      save-button-text="保存地址"
                      :address-info="addressInfo"
                      @save="save"
                      @delete="removeAddress" />
  </div>
</template>

<script>
  import areaList from "@/assets/js/areaList";

  export default {

    name: "NewAddress",

    data() {
      return {

        // 城市代码
        areaList,

        // 地址初始值
        addressInfo: {},

        // 地址aid
        aid: ''
      };
    },

    created() {

      // 截取查询参数 aid: 如果存在，则表示编辑地址, 否则新增地址
      this.aid = this.$route.query.aid;

      if (this.aid) {

        // 根据地址aid查询地址数据
        this.getAddressDataByAid();
      }
    },

    methods: {

      //保存地址
      save(content) {

        // 获取token
        let tokenString = localStorage.getItem('__tk');

        // 调用判断用户的token
        if (this.$judgeToken(tokenString)) return;

        // 复制content
        let addressInfo = Object.assign({}, content);

        // 删除country
        delete addressInfo.country;

        addressInfo.tokenString = tokenString;
        addressInfo.appkey = this.appkey;
        addressInfo.isDefault = Number(addressInfo.isDefault);

        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0,
        });

        if (!this.aid) {

          // 新增地址
          this.address(addressInfo, '/addAddress');
        } else {

          // 编辑地址
          // 如果是编辑地址，则需要验证用户是否修改过地址数据
          let isModify = false;
          for (let key in this.addressInfo) {
            if (content[key] != this.addressInfo[key]) {
              isModify = true;
            }
          }
          if (isModify) {

            // 发起请求 编辑地址
            this.address(addressInfo, '/editAddress');
            return;
          }
          return this.$toast('请修改地址信息');
        }
      },

      // 新增地址 或者 编辑地址
      address(addressInfo, url) {
        this.axios({
            url,
            method: "POST",
            data: addressInfo,
          })
          .then(res => {
            this.$toast.clear();
            if (res.data.code == 700) {
              this.$goPage('Login'); // token检验无效,则跳到登录页面
            }

            if (res.data.code == 9000 || res.data.code == 30000) {
              setTimeout(this.$goPage('Address'), 800);
            }
            this.$toast(res.data.msg);
          });
      },

      // 根据地址aid查询地址数据
      getAddressDataByAid() {

        // 获取token
        let tokenString = localStorage.getItem('__tk');

        // 调用判断用户的token
        if (this.$judgeToken(tokenString)) return;

        this.axios({
            method: "GET",
            url: "/findAddressByAid",
            params: {
              appkey: this.appkey,
              tokenString,
              aid: this.aid
            }
          })
          .then(res => {
            this.$toast.clear();
            if (res.data.code == 700) {
              this.$goPage('Login'); // token检验无效,则跳到登录页面
            }

            if (res.data.code == 40000) {
              let data = res.data.result[0];
              if (!data) {
                data = {};
              }
              data.isDefault = Boolean(data.isDefault);
              this.addressInfo = data;
            }
          });
      },

      //删除地址
      removeAddress() {

        // 获取token
        let tokenString = localStorage.getItem('__tk');

        // 调用判断用户的token
        if (this.$judgeToken(tokenString)) return;

        this.axios({
            method: "POST",
            url: "/deleteAddress",
            data: {
              appkey: this.appkey,
              tokenString,
              aid: this.aid
            }
          })
          .then(res => {
            this.$toast.clear();
            if (res.data.code == 700) {
              this.$goPage('Login'); // token检验无效,则跳到登录页面
            }

            if (res.data.code == 10000) {
              setTimeout(this.$goPage('Address'), 800);
            }
            this.$toast(res.data.msg);
          });
      }
    },
  };

</script>

<style lang="scss">
  .M-new_address {
    padding-top: 60px;
    color: $defaultColor;
    height: 100%;
    position: relative;
    box-sizing: border-box;

    .van-button--danger {
      background-color: $mainColor;
      border-color: $mainColor;
    }

    .van-switch--on {
      background-color: $mainColor;
    }

    .van-address-edit__buttons {
      padding: 80px $margin 0;
    }
  }

</style>

<template>
  <div class="M-secure">
    <van-nav-bar title="安全中心"
                 left-text="返回"
                 left-arrow
                 fixed
                 @click-left="$goBack()" />
    <van-notice-bar class="M-notive"
                    left-icon="volume-o"
                    mode="closeable"
                    text="客服在线时间 9:00 - 17:30  客服联系方式 400-600-243" />
    <layout-bg>
      <div class="M-cell">
        <van-cell title="修改密码"
                  is-link
                  :center="true"
                  @click="openPasswordBox" />
        <van-cell title="注销账号"
                  is-link
                  :center="true"
                  @click="destroyAccount" />
      </div>
    </layout-bg>

    <div class="M-logout">
      <van-button block
                  round
                  @click="logout">退出登录</van-button>
    </div>

    <van-popup is-link
               position="bottom"
               closeable
               v-model="isOpen">
      <div class="M-form">
        <div class="M-formTitle">修改密码</div>
        <van-form>
          <van-field v-model="password.oldPassword"
                     :type="isPassword ? 'password' : 'text'"
                     name="旧密码"
                     label="旧密码"
                     placeholder="旧密码(首字符必须为字母)"
                     :right-icon="isPassword ? 'closed-eye' : 'eye-o'"
                     autocomplete="off"
                     @click-right-icon="toggleType" />

          <van-field v-model="password.newPassword"
                     :type="isPassword ? 'password' : 'text'"
                     name="新密码"
                     label="新密码"
                     placeholder="新密码(首字符必须为字母)"
                     :right-icon="isPassword ? 'closed-eye' : 'eye-o'"
                     autocomplete="off"
                     @click-right-icon="toggleType" />

          <div class="M-commit_btn">
            <van-button round
                        block
                        @click="commit">提交</van-button>
          </div>
        </van-form>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import "@/assets/scss/secure.scss";
  import {
    validateForm
  } from "@/assets/js/validateForm";

  export default {
    name: "Secure",

    components: {
      LayoutBg: () => import('@/components/LayoutBg.vue')
    },

    data() {
      return {

        // 修改密码框bool
        isOpen: false,

        // 密码状态bool
        isPassword: true,

        // 新旧密码
        password: {
          oldPassword: '',
          newPassword: '',
        },
      };
    },

    methods: {

      // 密码的状态切换
      toggleType() {
        this.isPassword = !this.isPassword;
      },

      // 打开修改密码框
      openPasswordBox() {

        // 关闭修改密码后清空输入值
        this.password.oldPassword = '';
        this.password.newPassword = '';
        this.isOpen = true;
      },

      // 注销账号
      destroyAccount() {
        this.$dialog
          .confirm({
            title: "注销账号",
            message: "是否确定注销账号，一旦注销无法恢复！",
          })
          .then(() => {

            // 获取token
            let tokenString = localStorage.getItem('__tk');

            // 调用判断用户的token
            if (this.$judgeToken(tokenString)) return;

            // 执行账号注销
            this.axios({
                method: "POST",
                url: "/destroyAccount",
                data: {
                  appkey: this.appkey,
                  tokenString,
                },
              })
              .then(res => {
                this.$toast.clear();
                if (res.data.code == 700) {

                  // token检验无效,则跳到登录页面
                  this.$goPage(Login);
                }
                if (res.data.code == "G001") {
                  setTimeout(() => {

                    // 清除登录状态
                    localStorage.removeItem("__tk");

                    // 清除钱包信息
                    localStorage.removeItem('__$');
                    this.$goPage('Login');
                  }, 800);
                }
                this.$toast(res.data.msg);
              });
          });
      },

      // 退出登录
      logout() {
        this.$dialog
          .confirm({
            title: "退出登录",
            message: "是否确定退出登录！",
          })
          .then(() => {

            // 执行退出登录
            // 清除登录状态
            this.$toast.loading({
              message: "加载中...",
              forbidClick: true,
              duration: 0,
            });
            setTimeout(() => {
              this.$toast.clear();
              localStorage.removeItem("__tk");

              // 设置钱包信息
              let data = this.$store.state.wallet;
              localStorage.setItem('__$', JSON.stringify(data));
              this.$goPage('Login');
            }, 800);
          });
      },

      // 提交修改密码
      commit() {

        // 构造表单验证信息
        let formData = {
          oldPassword: {
            value: this.password.oldPassword,
            errorMsg: "旧密码由数字字母下划线组合(6-16字符)",
            reg: /^[A-Za-z]\w{5,15}$/,
          },
          newPassword: {
            value: this.password.newPassword,
            errorMsg: "新密码由数字字母下划线组合(6-16字符)",
            reg: /^[A-Za-z]\w{5,15}$/,
          },
        };

        // 如果表单验证通过
        if (validateForm.validate(formData)) {
          if (this.password.newPassword == this.password.oldPassword) {
            this.$toast("新密码和旧密码不能相同");
            return;
          }

          //发起修改密码请求
          let tokenString = localStorage.getItem('__tk');

          // 调用判断用户的token
          if (this.$judgeToken(tokenString)) return;

          this.axios({
              method: "POST",
              url: "/updatePassword",
              data: {
                tokenString,
                appkey: this.appkey,
                password: this.password.newPassword,
                oldPassword: this.password.oldPassword,
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
              if (res.data.code == "E001") {
                setTimeout(() => {
                  localStorage.removeItem("__tk"); // 清除登录状态
                  this.$router.push({
                    name: "Login"
                  });
                }, 800);
              }
              this.$toast(res.data.msg);
            });
        }
      },
    },
  };

</script>

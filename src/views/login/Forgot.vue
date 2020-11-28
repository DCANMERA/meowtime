<template>
  <div class="M-login">

    <!-- 忘记顶部栏 -->
    <div class="M-header">
      <van-nav-bar>
        <template #left>
          <h1 class="M-logo"
              @click="$goPage('Home')">
            <img src="@/assets/images/logo.png" />
          </h1>
          <div class="M-logo_name">喵时光</div>
        </template>
        <template #right>
          <div class="M-link_home"
               @click="$goPage('Home')">逛逛喵时光</div>
        </template>
      </van-nav-bar>
    </div>


    <div class="M-faceLanguage">
      <div class="M-interface_ch">找回密码!</div>
      <div class="M-interface_en">Find Back The Password</div>
    </div>

    <!-- 忘记密码界面栏 -->
    <div class="M-userInterface">
      <van-form v-if="!isNext">
        <van-field v-model="userInfo.email"
                   name="邮箱"
                   label="邮箱"
                   placeholder="邮箱"
                   autocomplete="off" />
        <van-field v-model="userInfo.code"
                   name="验证码"
                   label="验证码"
                   placeholder="验证码(6个字符)"
                   autocomplete="off"
                   maxlength="6">
          <template #button>
            <van-button size="small"
                        :disabled="isSend"
                        class="M-getCode"
                        @click="getValidCode">{{text}}</van-button>
          </template>
        </van-field>
        <div class="M-forget">
          <span @click="$goPage('Login')">已有账号，立即登录</span>
        </div>
        <div class="M-interface_btn">
          <van-button round
                      block
                      @click="next">
            下一步
          </van-button>
        </div>
      </van-form>

      <van-form v-else>
        <van-field v-model="userInfo.phone"
                   name="手机号"
                   label="手机号"
                   placeholder="手机号"
                   autocomplete="off" />
        <van-field v-model="userInfo.password"
                   :type="isRegisterPassword ? 'password' : 'text'"
                   name="密码"
                   label="密码"
                   placeholder="密码必须为字母开头"
                   :right-icon="isRegisterPassword ? 'closed-eye' : 'eye-o'"
                   autocomplete="off"
                   @click-right-icon="toggleRegsiterPasswordType" />
        <div class="M-forget">
          <span @click="$goPage('Login')">已有账号，立即登录</span>
        </div>

        <div class="M-interface_btn">
          <van-button round
                      block
                      @click="commit">
            提交
          </van-button>
          <div class="M-register_btn M-inactive">
            <span @click="back">返回</span>
          </div>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
  import '@/assets/scss/login.scss'
  import {
    validateForm
  } from '@/assets/js/validateForm'

  export default {
    name: 'Forgot',

    data() {

      return {

        // 用户信息
        userInfo: {
          phone: '',
          password: '',
          email: '',
          code: ''
        },

        // 切换注册密码框的类型
        isRegisterPassword: true,

        // 是否下一步
        isNext: false,

        // 是否发送
        isSend: false,

        // 发送按钮文本
        text: '发送验证码'
      };
    },

    methods: {

      // 返回上一步
      back() {
        this.isNext = false;
      },

      // 切换注册框
      toggleRegisterBox() {
        this.isShow = true;
      },

      // 切换注册密码框的类型
      toggleRegsiterPasswordType() {
        this.isRegisterPassword = !this.isRegisterPassword;
      },

      // 下一步
      next() {

        // 构造表单验证信息
        let formData = {
          email: {
            value: this.userInfo.email,
            errorMsg: '邮箱格式不正确',
            reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
          },
          code: {
            value: this.userInfo.code,
            errorMsg: '验证码格式不正确',
            reg: /^[A-Za-z\d]{6}$/
          }
        };

        // 前端处理验证表单，通过走以下逻辑
        if (validateForm.validate(formData)) {

          // 发起验证并获取验证码请求
          this.$toast.loading({
            message: '加载中...',
            forbidClick: true,
            duration: 0
          });

          this.axios({
            method: 'POST',
            url: '/checkValidCode',
            data: {
              appkey: this.appkey,
              validCode: this.userInfo.code
            }

          }).then(res => {
            this.$toast.clear();
            this.$toast(res.data.msg);
            if (res.data.code == 'K001') {
              this.isNext = true;
            }
          });
        }
      },

      // 获取邮箱验证码
      getValidCode() {

        // 构造表单验证信息
        let formData = {
          email: {
            value: this.userInfo.email,
            errorMsg: '邮箱格式不正确',
            reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
          }
        };

        if (!validateForm.validate(formData)) return;

        let time = 60;

        this.isSend = true;
        this.text = time + '秒后重新发送';

        let timer = setInterval(() => {
          if (time <= 0) {
            clearInterval(timer);
            timer = null;
            time = 60;
            this.isSend = false;
            this.text = '重新发送验证码';
          } else {
            time--;
            this.text = time + '秒后重新发送';
          }
        }, 1000)

        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0
        });

        this.axios({
            method: 'POST',
            url: '/emailValidCode',
            data: {
              appkey: this.appkey,
              email: this.userInfo.email
            }
          })
          .then(res => {
            this.$toast.clear();
            this.$toast(res.data.msg);
          });
      },

      // 提交
      commit() {

        // 构造表单验证信息
        let formData = {
          phone: {
            value: this.userInfo.phone,
            errorMsg: '手机号格式不正确',
            reg: /^1[3-9]\d{9}$/
          },
          password: {
            value: this.userInfo.password,
            errorMsg: '新密码由数字字母下划线组合(6-16字符)',
            reg: /^[A-Za-z]\w{5,15}$/
          }
        };

        if (validateForm.validate(formData)) {
          this.$toast.loading({
            message: '加载中...',
            forbidClick: true,
            duration: 0
          });

          // 发起找回密码请求
          this.axios({
              method: 'POST',
              url: '/retrievePassword',
              data: {
                appkey: this.appkey,
                phone: this.userInfo.phone,
                password: this.userInfo.password
              }
            })
            .then(res => {
              this.$toast.clear();
              this.$toast(res.data.msg)
              if (res.data.code == 'L001') {
                setTimeout(() => {
                  this.$goPage('Login');
                }, 800)
              }
            });
        }
      },

    }
  }

</script>

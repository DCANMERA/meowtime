<template>
  <div class="M-login">

    <!-- 登录顶部栏 -->
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

    <!-- 登录结语栏 -->
    <div class="M-faceLanguage">
      <div class="M-interface_ch">欢迎回来，尽享喵时光</div>
      <div class="M-interface_en">Welcome back and enjoy Meow time</div>
    </div>

    <!-- 登录界面栏 -->
    <div class="M-userInterface">
      <van-form>
        <van-field name="用户名"
                   label="用户名"
                   placeholder="手机号"
                   autocomplete="off"
                   v-model="LoginData.phone" />
        <van-field :type=" inputTypeBool ? 'text' : 'password' "
                   name="密码"
                   label="密码"
                   :right-icon=" inputTypeBool ? 'eye-o' : 'closed-eye' "
                   placeholder="密码"
                   autocomplete="off"
                   v-model="LoginData.password"
                   @click-right-icon="toggleIpnutType" />
        <div class="M-forget">
          <span @click="$goPage('Forgot')">忘记密码？</span>
        </div>
        <div class="M-interface_btn">
          <van-button round
                      block
                      @click="submitLoginData">
            登录
          </van-button>
          <div class="M-register_btn M-inactive">
            <span @click="toggleRegister">注册</span>
          </div>
        </div>
      </van-form>
    </div>

    <!-- 注册界面栏 -->
    <van-popup position="bottom"
               closeable
               v-model="isShow">
      <div class="M-register">
        <h3 class="M-register_title">
          注册
        </h3>
        <van-form>
          <van-field name="昵称"
                     label="昵称"
                     placeholder="字母数字_汉字组合(1-10位)"
                     autocomplete="off"
                     v-model="registerData.nickName" />
          <van-field name="手机号"
                     label="手机号"
                     placeholder="11位手机号"
                     autocomplete="off"
                     v-model="registerData.phone" />
          <van-field :type=" inputTypeBool ? 'text' : 'password' "
                     name="密码"
                     label="密码"
                     placeholder="字母数字_组合且字母开头(6-16位)"
                     :right-icon=" inputTypeBool ? 'eye-o' : 'closed-eye' "
                     autocomplete="off"
                     v-model="registerData.password"
                     @click-right-icon="toggleIpnutType" />
          <van-button class="M-register_btn"
                      round
                      block
                      @click="submitRegister">
            注册
          </van-button>
        </van-form>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import '@/assets/scss/login.scss';
  import {
    validateForm
  } from '@/assets/js/validateForm';
  import {
    wallet
  } from '@/assets/js/wallet';

  export default {
    name: 'Login',

    data() {
      return {

        // 按钮颜色
        color: '#BF5710',

        // 是否显示注册栏
        isShow: false,

        // 切换密码框的状态
        inputTypeBool: false,

        // 用户登录数据
        LoginData: {
          phone: '',
          password: ''
        },

        // 用户注册数据
        registerData: {
          nickName: '',
          phone: '',
          password: ''
        }

      };
    },
    methods: {

      // 切换密码框状态处理逻辑
      toggleIpnutType() {
        this.inputTypeBool = !this.inputTypeBool;
      },

      // 切换注册页
      toggleRegister() {
        this.isShow = true;
        this.inputTypeBool = false;
      },

      // 发送登录信息给服务端出来逻辑
      submitLoginData() {

        //构造表单验证信息
        let formData = {
          password: {
            value: this.LoginData.password,
            errorMsg: '密码格式不正确',
            reg: /^[A-Za-z]\w{5,15}$/
          },
          phone: {
            value: Number(this.LoginData.phone),
            errorMsg: '手机号格式不正确',
            reg: /^1[3-9]\d{9}$/
          }
        };

        // 前端处理验证表单，通过走以下逻辑
        if (validateForm.validate(formData)) {

          // 拷贝用户登录逻辑，不能直接等与用户数据，因该类型是引用数据类型
          let userInfo = Object.assign({}, this.LoginData);

          // 拷贝用户的appkey,appkey是用与验证用户和服务端的唯一标识
          userInfo.appkey = this.appkey;

          // 加载服务端请求未完成出现弹出
          this.$toast.loading({
            message: '加载中...',
            forbidClick: true,
            duration: 0
          });

          // 请求登录接口
          this.axios({
            method: 'POST',
            url: '/login',
            data: userInfo
          }).then(res => {
            this.$toast.clear();
            if (res.data.code == 200) {
              this.$toast(res.data.msg);
              this.isShow = false;
              this.LoginData.phone = '';
              this.LoginData.password = '';
              localStorage.setItem('__tk', res.data.token);
              this.$store.commit('changeInfo', this.$getUserInfo());
              let __$ = localStorage.getItem('__$');
              if (!localStorage.getItem('__$')) {
                localStorage.setItem('__$', JSON.stringify(wallet));
              }
              setTimeout(this.$goPage('Home'), 1500);
            }
          });
        }

      },

      // 发送注册信息给服务端出来逻辑
      submitRegister() {

        //构造表单验证信息
        let formData = {
          phone: {
            value: this.registerData.phone,
            errorMsg: '手机号格式不正确',
            reg: /^1[3-9][0-9]{9}$/
          },
          password: {
            value: this.registerData.password,
            errorMsg: '密码格式不正确',
            reg: /^[A-Za-z]\w{5,15}$/
          },
          nickName: {
            value: this.registerData.nickName,
            errorMsg: '昵称格式不正确',
            reg: /^[\w\u4e00-\u9fa5]{1,10}$/
          }
        };

        // 同上与登录接口的处理逻辑
        if (validateForm.validate(formData)) {
          let userInfo = Object.assign({}, this.registerData);
          userInfo.appkey = this.appkey;

          this.$toast.loading({
            message: '加载中...',
            forbidClick: true,
            duration: 0
          });

          this.axios({
            method: 'POST',
            url: '/register',
            data: userInfo
          }).then(res => {

            this.$toast.clear();

            if (res.data.code == 100) {
              this.$toast(res.data.msg);
              this.isShow = false;
              this.registerData.nickName = '';
              this.registerData.phone = '';
              this.registerData.password = '';
            }
          });
        }

      },

    }
  }

</script>

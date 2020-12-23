<template>
  <div class="M-profile">

    <van-notice-bar class="M-notive"
                    left-icon="volume-o"
                    mode="closeable"
                    text="客服在线时间 9:00 - 17:30  客服联系方式 400-600-243" />

    <div class="M-profileBg"
         :style="{backgroundImage: 'url('+userInfo.userBg+')'}">
      <van-uploader class="M-upload"
                    :after-read="uploadBg" />
    </div>

    <div class="M-profile_info">
      <div class="M-infoMain">
        <div class="M-userImg"
             :style="{backgroundImage: 'url('+userInfo.userImg+')'}">
        </div>
        <div class="M-profileUserInfo">
          <div class="M-userName">{{userInfo.nickName}}</div>
          <div class="M-userDesc">
            {{userInfo.desc == '' ? '简介：暂无介绍' : userInfo.desc}}
          </div>
        </div>
      </div>

      <div class="M-profile_list">
        <van-cell v-for="(item, index) in listData"
                  :key="index"
                  :title="item.title"
                  :icon="item.icon"
                  is-link
                  @click.stop="$goPage(item.name)" />
      </div>
    </div>
  </div>
</template>

<script>
  import '@/assets/scss/profile.scss';

  export default {
    name: 'Profile',

    data() {
      return {

        listData: [{
            title: '个人资料',
            name: 'Person',
            icon: 'manager'
          }, {
            title: '咖啡钱包',
            name: 'Coffeewallet',
            icon: 'gold-coin'
          },
          {
            title: '我的订单',
            name: 'Order',
            icon: 'column'
          },
          {
            title: '收藏夹',
            name: 'Like',
            icon: 'like'
          },
          {
            title: '地址栏',
            name: 'Address',
            icon: 'location'
          },
          {
            title: '安全中心',
            name: 'Secure',
            icon: 'umbrella-circle'
          }
        ],

        // 用户信息
        userInfo: {}
      };
    },

    created() {

      // 获取用户信息
      this.getUserInfo();
    },

    methods: {

      // 获取用户信息
      getUserInfo() {

        // 获取token
        let tokenString = localStorage.getItem('__tk');

        // 调用判断用户的token
        if (this.$judgeToken(tokenString)) return;

        this.axios({
            method: "GET",
            url: "/findMy",
            params: {
              appkey: this.appkey,
              tokenString
            },
          })
          .then(res => {
            this.$toast.clear();
            if (res.data.code == 700) {
              this.$goPage('Login'); // token检验无效,则跳到登录页面
            }

            if (res.data.code == 'A001') {
              this.userInfo = res.data.result[0];
            }
          });
      },

      // 上传背景
      uploadBg(file) {

        // 允许文件类型
        let type = ['gif', 'png', 'jpg', 'jpeg'];

        // 允许最大文件大小 1MB
        let size = 1;

        // 判断文件类型
        let fileType = file.file.type.split('/')[1];
        if (type.indexOf(fileType) === -1) {
          this.$toast('文件类型只支持' + (type.join(',')));
          return;
        }

        // 判断文件大小 B, 1024B = 1KB, 1024KB = 1MB
        let fileSize = file.file.size / 1024 / 1024;
        if (fileSize > size) {
          this.$toast('文件允许最大不能超过' + size + 'MB');
          return;
        }

        // 处理base64的标记data:image/jpeg;base64,
        let base64 = file.content.replace(/^data:image\/[A-Za-z]+;base64,/, '');

        // 获取token
        let tokenString = localStorage.getItem('__tk');

        // 调用判断用户的token
        if (this.$judgeToken(tokenString)) return;

        this.axios({
            method: "POST",
            url: "/updateUserBg",
            data: {
              appkey: this.appkey,
              tokenString,
              imgType: fileType,
              serverBase64Img: base64
            },
          })
          .then(res => {
            this.$toast.clear();
            if (res.data.code == 700) {
              this.$goPage('Login'); // token检验无效,则跳到登录页面
            }

            if (res.data.code == 'I001') {
              this.userInfo.userBg = res.data.userBg;
            }

            this.$toast(res.data.msg);
          });

      },

    },

  }

</script>

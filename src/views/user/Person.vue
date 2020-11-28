<template>
  <div class="M-person">
    <van-nav-bar class="M-header"
                 title="个人资料"
                 left-text="返回"
                 left-arrow
                 fixed
                 @click-left="$goBack()" />
    <layout-bg>
      <van-cell title="头像"
                :center="true">
        <div class="M-userImg"
             :style="{backgroundImage: 'url('+personalInfo.userImg+')'}">
          <van-uploader class="M-upload"
                        :after-read="uploadUserImg" />
        </div>
      </van-cell>
      <van-cell title="用户id"
                :center="true">{{personalInfo.userId}}</van-cell>
      <van-cell title="手机号"
                :center="true">{{personalInfo.phone}}</van-cell>
      <van-cell title="昵称"
                input-align="right"
                :center="true">
        <van-field v-model="personalInfo.nickName"
                   class="M-field"
                   placeholder="输入昵称"
                   input-align="right"
                   maxlength="12"
                   @blur="updateNickName"
                   @change="updateNickName" />
      </van-cell>
      <div class="M-userDesc">
        <div class="M-desc_content">
          <van-field v-model="personalInfo.desc"
                     rows="2"
                     autosize
                     label="简介"
                     type="textarea"
                     maxlength="30"
                     placeholder="输入简介"
                     show-word-limit
                     input-align="right"
                     @change="updateDesc" />
        </div>
      </div>
    </layout-bg>
  </div>
</template>

<script>
  import "@/assets/scss/person.scss";

  export default {
    name: "Person",

    components: {
      LayoutBg: () => import('@/components/LayoutBg.vue')
    },

    data() {
      return {

        personalInfo: {
          nickName: '',
          desc: '',
          phone: '',
          userId: '',
          desc: ''
        },
      };
    },

    created() {

      // 获取个人资料
      this.getPersonalInfo();
    },

    methods: {

      // 获取个人资料
      getPersonalInfo() {

        // 获取token
        let tokenString = localStorage.getItem('__tk');

        // 调用判断用户的token
        if (this.$judgeToken(tokenString)) return;

        this.axios({
            method: "GET",
            url: "/findAccountInfo",
            params: {
              appkey: this.appkey,
              tokenString,
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
            if (res.data.code == "B001") {
              let data = res.data.result[0];
              if (data.desc == '') {
                data.desc = '暂无简介'
              }
              this.personalInfo = data;
              this.changeInfo();
            }
          });
      },

      // 上传用户头像
      uploadUserImg(file) {

        //允许文件类型
        let type = ['gif', 'png', 'jpg', 'jpeg'];

        // 允许最大文件大小 1MB
        let size = 1;

        // 判断文件类型
        let fileType = file.file.type.split('/')[1];
        if (type.indexOf(fileType) === -1) {
          this.$toast('文件类型只支持' + type.join(','));
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
            url: "/updateAvatar",
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

            if (res.data.code == 'H001') {
              this.personalInfo.userImg = res.data.userImg;
              this.changeInfo();
            }
            this.$toast(res.data.msg);
          });
      },

      // 修改昵称
      updateNickName() {
        if (this.personalInfo.nickName == '') {
          this.$toast('昵称不能为空');
          this.personalInfo.nickName = this.personalInfo.userId;
          return;
        }

        // 获取token
        let tokenString = localStorage.getItem('__tk');

        // 调用判断用户的token
        if (this.$judgeToken(tokenString)) return;

        this.axios({
            method: "POST",
            url: "/updateNickName",
            data: {
              appkey: this.appkey,
              tokenString,
              nickName: this.personalInfo.nickName
            },
          })
          .then(res => {
            this.$toast.clear();
            if (res.data.code == 700) {
              this.$goPage('Login'); // token检验无效,则跳到登录页面
            } else {
              this.$toast(res.data.msg);
              this.changeInfo();
            }
          });
      },

      // 修改简介
      updateDesc() {
        if (this.personalInfo.desc == '') {
          this.$toast('简介不能为空');
          this.personalInfo.desc = '暂无简介';
          return;
        }

        // 获取token
        let tokenString = localStorage.getItem('__tk');

        // 调用判断用户的token
        if (this.$judgeToken(tokenString)) return;

        this.axios({
            method: "POST",
            url: "/updateDesc",
            data: {
              appkey: this.appkey,
              tokenString,
              desc: this.personalInfo.desc
            },
          })
          .then(res => {
            this.$toast.clear();
            if (res.data.code == 700) {
              this.$goPage('Login'); // token检验无效,则跳到登录页面
            } else {
              this.$toast(res.data.msg);
              this.changeInfo();
            }
          });
      },

      // 修改store的state中userInfo数据
      changeInfo() {
        this.$store.commit('changeInfo', this.personalInfo)
      }

    }

  };

</script>

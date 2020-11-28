export default {

  install(Vue, options) {

    // 返回上一级
    Vue.prototype.$goBack = function () {
      this.$router.go(-1);
    }

    // 去往指定页
    Vue.prototype.$goPage = function (name) {
      this.$router.push({
        name
      });
    }

    //查看商品详情页面
    Vue.prototype.$goDetail = function (pid) {
      this.$router.push({
        name: 'Detail',
        params: {
          pid
        }
      });
    }

    // 判断是否存在token
    Vue.prototype.$judgeToken = function (tokenString) {

      if (!tokenString) {

        // 跳回登录页面
        this.$toast("请先登录");
        setTimeout(() => {
          this.$router.push({
            name: "Login"
          });
        }, 500);

        return true;
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
    }

    // 活动时间范围
    Vue.prototype.$discountCountdown = function () {
      let nowDay = new Date().toLocaleDateString();
      let endDay = new Date();
      endDay.setDate(endDay.getDate() + 3);

      return (nowDay + ' 至 ' + endDay.toLocaleDateString()).replace(/\//g, '-');
    }

    // 格式化商品详情数据
    Vue.prototype.$formattingGoodsDetail = function (option) {
      let imgData = [];
      let rules = [];
      let rule = [];
      let ruleData = ['tem', 'sugar', 'milk', 'cream'];
      let data = Object.assign({}, option);
      if (data.desc) {
        data.desc = data.desc.split(/\n/);
      }
      ruleData.map(item => {
        let obj = {};
        obj.title = data[item + '_desc'];
        obj.ruleIndex = 0; // 激活下标
        obj.rule = []; // 每项规格
        if (data[item]) {
          let ruleString = data[item].split('/'); // 获取规格字符串
          ruleString.map(value => {
            if (value != "")
              obj.rule.push({
                title: value
              });
          });
          if (obj.rule.length > 0) rules.push(obj);
        }
      });
      data.rules = rules;
      data.rules.map(v => rule.push(v.rule[v.ruleIndex].title));
      data.rule = rule.join('/');
      data.count = 1;
      imgData.push(data.large_img, data.small_img);
      data.imgData = imgData;

      return data;
    }

    // 获取商品详情
    Vue.prototype.$getDetail = function (pid) {
      let data = {};
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      this.axios({
        method: "GET",
        url: "/productDetail",
        params: {
          appkey: this.appkey,
          pid: pid
        }
      })
        .then(result => {
          this.$toast.clear();
          this.goodsAllData.push(this.$formattingGoodsDetail(result.data.result[0]));
        });

      return data;
    }

    // 加入购物车
    Vue.prototype.$addPurchase = function (productData, isPay) {

      // 获取tokenString
      let tokenString = localStorage.getItem('__tk');

      // 调用判断用户的token
      if (this.$judgeToken(tokenString)) return;

      // 请求参数
      let data = {
        tokenString,
        appkey: this.appkey,
        count: productData.count,
        pid: productData.pid,
        rule: productData.rule
      };

      this.axios({
        method: 'POST',
        url: '/addShopcart',
        data
      })
        .then(res => {
          this.$toast.clear();
          if (res.data.code == 700) {

            // token检验无效,则跳到登录页面
            this.$router.push({
              name: 'Login'
            });
          } else if (res.data.code == 3000) {
            if (!isPay) {

              // 调用查询购物车数量功能
              this.$shopBagCount();
            } else {
              this.$router.push({ name: 'Pay', query: { sids: res.data.sid } });
            }
          }

          this.$toast(res.data.msg);
        });
    }

    //查询用户的购物袋数量
    Vue.prototype.$shopBagCount = function () {

      // 获取token
      let tokenString = localStorage.getItem('__tk');

      // 调用判断用户的token
      if (this.$judgeToken(tokenString)) return;

      this.axios({
        method: 'GET',
        url: '/shopcartRows',
        params: {
          appkey: this.appkey,
          tokenString
        }
      }).then(res => {
        this.$toast.clear();
        if (res.data.code == 8000) {
          this.bagCount = res.data.result;
        }
      });
    }

    // 购买商品
    Vue.prototype.$buy = function (sid) {
      this.$router.push({
        name: 'Pay',
        query: {
          sid
        }
      });
    }

    // 下拉刷新
    Vue.prototype.$onRefresh = function (flag) {
      setTimeout(() => {
        this.$router.go(0);
        flag = false;
      }, 1500);
    }

    // 获取个人资料
    Vue.prototype.$getUserInfo = function () {
      let userInfo = {};

      // 获取token
      let tokenString = localStorage.getItem('__tk');
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
            res.data.nickName = '请先登录！';
            res.data.isLogin = false;
            Object.assign(userInfo, res.data);
          }

          if (res.data.code == "B001") {
            let data = res.data.result[0];
            data.isLogin = true;
            if (data.desc == '') {
              data.desc = '暂无简介'
            }
            Object.assign(userInfo, data);
          }
        });
      return userInfo;
    }

  }
}

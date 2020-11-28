export default {

  // 修改用户信息
  changeInfo(state, data) {
    this.state.userInfo = data;
  },

  // 修改钱包信息
  changeWallet(state, data) {
    data.map(item => {
      if (item.checked) {
        item.available++;
        item.checked = false;
      }
    });
    this.state.wallet = data;
    localStorage.removeItem('__$');
    localStorage.setItem('__$', JSON.stringify(data));
  }
}

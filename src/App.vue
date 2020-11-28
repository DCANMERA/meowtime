<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>


<style lang="scss">
  @import './assets/scss/common.scss';
  @import './assets/scss/reset.scss';

</style>

<template>
  <div class="M-layout">
    <div class="M-layout_bg"></div>
    <div class="M-layout_content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'LayoutBg'
  }

</script>

<style lang="scss">
  .M-layout {
    width: 100%;
    padding-top: 46px;
    box-sizing: border-box;


    .M-layout_bg {
      height: 128px;
      background-color: $mainColor;
    }

    .M-layout_content {
      margin: 0 $margin;
      position: relative;
      top: -50px;
      background-color: $mainBg;
      border-radius: 8px;
      padding: $margin;
    }
  }

  .active .M-layout_content {
    padding: 0;
  }

</style>

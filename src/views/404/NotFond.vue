<template>
    <div class="container"></div>
</template>

<script>
export default {
  created () {
    this.$http.get('http://ttapi.research.itcast.cn/mp/v1_0/user/profile').then((res) => {
      console.log(res)
    })
  }
}
</script>

 <style scoped lang="less">
.container {
    position:absolute;
    left: 0;
    top: 0;
    width:100%;
    height: 100%;
    background:url(../../assets/images/404.png) no-repeat center/cover
}
</style>

<template>
  <div id="app">
    <div id="router">
    <span>Page Select - </span>
    <!-- routing link -->
    <router-link class="routes" to="/">홈</router-link> 
    <router-link class="routes" to="leafletview">실시간 이동차량</router-link> 
    <router-link class="routes" to="nodelinkview">노드링크 조회</router-link>
    <router-link class="routes" to="leaf50000view">50000대</router-link>
    <router-link class="routes" to="marketview">거래게시판</router-link>
    <router-link class="routes" to="lifecycleview">라이프사이클</router-link>

    </div>
    <!-- component route location-->
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  }
}
</script>

<style>
  #router{
    font-size: 20px;
    font-weight: bold;
    float: right;
  }
  .routes{
    margin: 10px;
  }
</style>

<template>
  <div class="home">
    <h2>home(首页)</h2>
    <br>
    <router-link to="/">home(首页)</router-link> <span>****</span>
    <router-link to="/aa">aa(自定义表单)</router-link><span>****</span>
    <router-link to="/bb">bbb(自定义表单***清爽版)</router-link><span>****</span>
    <hr>
    <br>
    <router-view></router-view>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "home",
  components: {
    // HelloWorld
  }
};
</script>

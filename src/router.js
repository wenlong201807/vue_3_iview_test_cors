import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import aa from "./views/aa.vue";
import bb from "./views/bb.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/aa",
      name: "aa",
      component: aa
    },
    {
      path: "/bb",
      name: "bb",
      component: bb
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    }
  ]
});

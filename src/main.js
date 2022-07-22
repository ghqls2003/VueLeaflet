import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import LeafletView from './components/LeafletView.vue'
import NodeLinkView from './components/NodeLinkView.vue'
import Leaf50000View from './components/Leaf50000View.vue'
import Main from './components/Main.vue'

Vue.config.productionTip = false

// 플러그인 형태의 VueRouter 등록
Vue.use(VueRouter)

// router 객체 생성
const router = new VueRouter({
  routes: [
    {path: '/'},
    {path: '/leafletview', component: LeafletView},
    {path: '/nodelinkview', component: NodeLinkView},
    {path: '/leaf50000view', component: Leaf50000View},
    {path: '/virtualmain', component: Main},
  ]
})

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
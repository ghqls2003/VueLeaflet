import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeTest from '@/components/HomeTest.vue'
import LeafletView from '@/components/LeafletView.vue'
import NodeLinkView from '@/components/NodeLinkView.vue'
import Leaf50000View from '@/components/Leaf50000View.vue'
import MarketView from '@/components/MarketView.vue'
import LifeCycleView from '@/components/LifeCycleView.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: HomeTest
    },
    {
      path: '/leafletview',
      component: LeafletView
    },
    {
      path: '/nodelinkview',
      component: NodeLinkView
    },
    {
      path: '/leaf50000view',
      component: Leaf50000View
    },
    {
      path: '/marketview',
      component: MarketView
    },
    {
      path: '/lifecycleview',
      component: LifeCycleView
    },
  ]
})

export default router
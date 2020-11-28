import Vue from 'vue'
import VueRouter from 'vue-router'
import { routes } from './routes'


const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

Vue.use(VueRouter)

const router = new VueRouter({
  routes
})

export default router

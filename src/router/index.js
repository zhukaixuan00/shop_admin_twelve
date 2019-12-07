import Vue from 'vue'
import Router from 'vue-router'

// 引入Login.vue组件
// import Login from '@/components/Login'
const Login = () => import(/* webpackChunkName: 'login' */ '@/components/Login')

// 引入Home组件
// import Home from '@/components/Home'
const Home = () => import(/* webpackChunkName: 'home' */ '@/components/Home')

// 引入Users组件
// import Users from '@/components/users/Users'
const Users = () => import(/* webpackChunkName: 'users' */ '@/components/users/Users')

// 引入Rights组件
// import Rights from '@/components/rights/Rights'
const Rights = () => import(/* webpackChunkName: 'rights' */ '@/components/rights/Rights')

// 引入Roles组件
// import Roles from '@/components/rights/Roles'
const Roles = () => import(/* webpackChunkName: 'roles' */ '@/components/rights/Roles')

// 引入Categories组件-商品分类
// import Categories from '@/components/product/Categories'
const Categories = () => import(/* webpackChunkName: 'categories' */ '@/components/product/Categories')

// 引入商品列表组件
// import Goods from '@/components/product/Goods'
const Goods = () => import(/* webpackChunkName: 'goods' */ '@/components/product/Goods')

// 导入商品添加组件
// import GoodAdd from '@/components/product/Add'
const GoodAdd = () => import(/* webpackChunkName: 'goods' */ '@/components/product/Add')

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/users'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [
        {
          path: '/users',
          name: 'users',
          component: Users
        },
        {
          path: '/rights',
          name: 'rights',
          component: Rights
        },
        {
          path: '/roles',
          name: 'roles',
          component: Roles
        },
        {
          path: '/categories',
          name: 'categories',
          component: Categories
        },
        {
          path: '/goods',
          name: 'goods',
          component: Goods
        },
        {
          path: '/goods/add',
          name: 'goods/add',
          component: GoodAdd,
          meta: {
            // 开启组件缓存
            keepAlive: true
          }
        }
      ]
    }
  ]
})

// 给router配置导航守卫
// to: 去哪儿
// from: 从哪来
// next() : 放行 next('/login') -- 去login组件
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('myToken')

  if (!token && to.path !== '/login') next('/login')
  next()
})

export default router

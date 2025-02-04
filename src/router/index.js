// 設置路由
import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/homePage/login.vue'
import Index from '../views/homePage/index.vue'
import Register from '../views/homePage/register.vue'
import Admin from '../views/homePage/admin.vue'
import UserEdit from '../views/admin/UserEdit.vue'
import HouseEdit from '../views/admin/landlords/houseEdit.vue'
import Houses from '../views/homePage/houses.vue'
import Contract from '../views/house/contract.vue'
import RentOrder from '../views/admin/tenants/RentOrder.vue'
import ConfirmPay from '../views/confirmPay.vue'
import PaymentInfo from '../views/admin/tenants/paymentInfo.vue'
import Rent from '../views/house/rent.vue'
import HouseRented from '../views/admin/landlords/houseRented.vue'
import RentedInfo from '../views/admin/landlords/rentedInfo.vue'

// 使用vue router
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    // 首頁
    {
      path: '/index',
      name: 'Index',
      component: Index
    },
    { // 瀏覽所有租屋頁面
      path: '/houses',
      name: 'Houses',
      component: Houses
    },
    // 指定租屋頁面
    {
      path: '/house/:id',
      name: 'Rent',
      component: Rent,
      props: route => ({id: route.query.houseId})
    },
    // 合約頁面
    {
      path: '/contract/:id',
      name: 'Contract',
      component: Contract,
      props: route => ({id: route.query.rentId})
    },
    // 登入頁面
    {
      path: '/login',
      name: 'Login',
      component: Login,
      children: [{
        path: '/goRegister',
        name: 'goRegister',
        redirect: '/register'
      }
      ]
    },
    // 註冊頁面
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/confirm-pay',
      name: 'ConfirmPay',
      component: ConfirmPay
    },
    // 後台管理頁面
    {
      path: '/admin',
      name: 'Admin',
      component: Admin,
      children: [
        {
          path: '/houseRented',
          name: 'HouseRented',
          component: HouseRented
        },
        {
          path: '/rented-info/:id',
          name: 'RentedInfo',
          component: RentedInfo,
          props: route => ({id: route.query.houseId})
        },
        // 租屋管理
        {
          path: '/rent-order',
          name: 'RentOrder',
          component: RentOrder
        },
        // 租屋明細與付款資訊
        {
          path: '/pay-info/:id',
          name: 'PaymentInfo',
          component: PaymentInfo,
          props: route => ({id: route.query.rentId})
        },
        {
          path: '/houseEdit',
          name: 'HouseEdit',
          component: HouseEdit
        },
        {
          path: '/users',
          name: 'UserEdit',
          component: UserEdit,
          props: true
        }
      ]
    },
    {
      path: '/goIndex',
      name: 'goIndex',
      redirect: '/index'
    }
  ]
})

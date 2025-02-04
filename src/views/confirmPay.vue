<script>
import {checkPayment} from '../api/payment'
import Vue from 'vue'
import {getRentInfoById} from '../api/rent'

export default {
  data () {
    return {
      rentInfo: [],
      rentInfoId: '',
      confirmRequest: {
        'transactionId': '',
        'paymentId': '',
        'amount': null,
        'currency': 'TWD'
      }
    }
  },
  created () {
    this.confirmPayment()
  },
  methods: {
    confirmPayment () {
      this.rentInfoId = localStorage.getItem('rentInfoId')
      getRentInfoById(this.rentInfoId).then(res => {
        Vue.prototype.$message({message: '付款成功,結束將導向至訂單頁面', type: 'success'})
        console.log('取得租屋資訊成功', res)
        this.rentInfo = res
        this.confirmRequest.amount = res.amount
        this.confirmRequest.transactionId = res.transactionId
        this.confirmRequest.paymentId = res.paymentId
        return checkPayment(localStorage.getItem('rentId'), this.confirmRequest).then(res => {
          console.log('確認訂單成功', res)
          localStorage.removeItem('rentInfoId')
          localStorage.removeItem('rentId')
        }).catch(err => {
          Vue.prototype.$message({message: '付款失敗，請重新付款', type: 'error'})
          console.log('確認訂單失敗', err)
          this.$router.push('/rent-order')
        }).then(() => {
          this.$router.push('/rent-order').catch(err => {
            console.log('轉址失敗', err)
          }).catch(err => {
            console.log('error', err)
          })
        })
      })
    }
  }
}
</script>

<template>
  <h1>付款成功，正在確認中...結束將導向至訂單頁面</h1>
</template>

<style scoped>
</style>

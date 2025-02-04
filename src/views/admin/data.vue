<template>
  <div>
    <h2>數據</h2>
    測試會員ID:{{ id }}
  </div>
</template>

<script>
import {checkPayment} from '../../api/payment'

export default {
  created () {
    this.confirmPayment()
  },
  data () {
    return {
      name: 'Data',
      confirmRequest: {
        'paymentId': '',
        'transactionId': '',
        'amount': null,
        'currency': 'TWD'
      }
    }
  },
  methods: {
    confirmPayment () {
      this.confirmRequest.transactionId = this.route.params.id
      this.confirmRequest.paymentId = this.route.params.paymentId
      this.confirmRequest.amount = this.route.params.amount
      checkPayment(this.confirmRequest).then(response => {
        console.log('checkPayment', response)
      }).catch(error => {
        console.log('checkPayment error', error)
      })
    }
  }
}
</script>

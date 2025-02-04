<template>
  <div>
    <v-card class="card" outlined>
      <p class="text-h1">租賃契約</p>
      <v-card-title style="justify-content: center"> 租賃期間：</v-card-title>
      <v-card-text>
        <p class="text-center">自{{ rentInfo.startDate }} 起至{{ rentInfo.endDate }}止。</p>
      </v-card-text>
      <p class="text-h2">合約簽訂日期：</p>
      <p class="text-left">甲方（出租人）：</p>
      <p class="text-left">姓名：{{ owner.userName }}</p>
      <p class="text-left">聯絡電話：{{ owner.phone }}</p>
      <v-divider></v-divider>
      <p class="text-left">乙方（承租人）：</p>
      <p class="text-left">姓名：{{ user.userName }}</p>
      <p class="text-left">聯絡電話：{{ user.phone }}</p>
      <v-divider></v-divider>
      <p class="text-h2">租賃物件：</p>
      <p class="text-left">名稱：{{ houses.houseName }}</p>
      <p class="text-left">地址：{{ houses.address }}</p>
      <p class="text-left">房型：{{ getTypeText(houses.houseType) }}</p>
      <v-divider></v-divider>
      <p class="text-h2">租金及付款方式：</p>
      <p class="text-left">租金金額：每月 新台幣 {{ houses.pricePerMonth }} 元。</p>
      <p class="text-left">付款方式：乙方應於每月 10 日前支付租金予甲方。</p>
      <v-divider></v-divider>
      <p class="text-h2">押金：</p>
      <p class="text-left"> 押金金額： 新台幣 {{ houses.pricePerMonth * 2 }} 元整。</p>
      <p class="text-left"> 押金計算： 每月租金的 2 倍</p>
      <p class="text-no-wrap secondary"> 甲方應於合約終止並確認無任何損壞或欠款後，將押金退還乙方。</p>
      <v-divider></v-divider>
      <p class="text-h2">租賃物件使用及維護：</p>
      <p class="text-left">乙方應合理使用並愛護租賃物件及其設施。</p>
      <p class="text-left">租賃期間，乙方如需對租賃物件進行改裝，須事先徵得甲方同意。</p>
      <v-divider></v-divider>
      <p class="text-h2">其他事項：</p>
      <p class="text-left"> 任何一方需終止合約，應提前 1 個月書面通知對方。</p>
      <p class="text-left"> 合約期滿，若雙方同意，可續約，續約條件另行協商。</p>
    </v-card>
    <v-spacer></v-spacer>
    <v-btn color="#4CAF50" outlined @click="payDeposit" v-show="checkBtn()">我已詳閱並同意上述合約條款</v-btn>
  </div>
</template>
<script>
import {getRent} from '../../api/rent'
import {getHouse} from '../../api/house'
import {userInfo} from '../../api/user'
import {createPayment} from '../../api/payment'

export default {
  name: 'Contract',
  props: ['id'],
  data () {
    return {
      rentId: this.$route.params.id,
      rentInfoId: '',
      houses: [],
      houseId: '',
      ownerId: '',
      owner: {},
      user: {},
      rentInfo: {rentInfoList: []},
      confirmRequest: {
        'paymentId': '',
        'transactionId': '',
        'amount': null,
        'currency': 'TWD'
      },
      payRentRequest: {
        // 總金額
        'amount': null,
        'currency': 'TWD',
        'orderId': '',
        'packages': [
          {
            'id': 'package',
            'name': 'get_home',
            // 總金額
            'amount': null,
            'products': [
              {
                'id': '',
                'name': '',
                'imageUrl': '',
                'quantity': 2,
                // 單月金額
                'price': null
              }
            ]
          }
        ],
        'redirectUrls': {
          'confirmUrl': 'http://172.20.10.2:8080/confirm-pay',
          'cancelUrl': ''
        }
      }
    }
  },
  created () {
    this.getRentData()
  },
  methods: {
    checkBtn () {
      if (this.rentInfo.status === 'PENDING') {
        return true
      } else {
        return false
      }
    },
    getRentData () {
      getRent(this.$route.params.id).then(response => {
        this.rentInfo = response
        this.rentInfo.rentInfoList.houseId = response.rentInfoList[0].houseId
        this.houseId = this.rentInfo.rentInfoList.houseId
        this.userId = this.rentInfo.userId
        // 租客資訊
        userInfo(this.userId).then(response => {
          this.user = response
        })
        getHouse(this.rentInfo.rentInfoList.houseId).then(response => {
          this.houses = response
          // 房東資訊
          userInfo(response.userId).then(response => {
            this.ownerId = response.userId
            this.owner = response
          })
        })
      })
    },
    getTypeText (type) {
      const typeMap = {
        BEDSIT: '雅房',
        APARTMENT: '整層住家',
        SHAREROOMS: '分租套房',
        STUDIO: '獨立套房'
      }
      return typeMap[type] || ''
    },
    payDeposit () {
      console.log('name', this.rentInfo)
      this.payRentRequest.orderId = this.rentInfo.rentInfoList[0].paymentId
      this.payRentRequest.amount = this.rentInfo.rentInfoList[0].amount
      this.payRentRequest.packages[0].amount = this.rentInfo.rentInfoList[0].amount
      this.payRentRequest.packages[0].products[0].name = this.rentInfo.rentInfoList[0].houseName
      this.payRentRequest.packages[0].products[0].price = this.houses.pricePerMonth
      this.payRentRequest.packages[0].products[0].id = this.houses.houseId
      this.payRentRequest.packages[0].products[0].imageUrl = this.houses.imageUrl
      createPayment(this.payRentRequest).then(res => {
        this.rentInfoId = this.rentInfo.rentInfoList[0].rentInfoId
        localStorage.setItem('rentId', this.rentId)
        localStorage.setItem('rentInfoId', this.rentInfoId)
        if (localStorage.getItem('rentId') && localStorage.getItem('rentInfoId')) {
          this.confirmRequest.transactionId = res.message
          this.confirmRequest.paymentId = this.rentInfo.rentInfoList[0].paymentId
          this.confirmRequest.amount = this.rentInfo.rentInfoList[0].amount
          window.location.href = res.paymentUrl
        } else {
          console.log('資料儲存有誤')
        }
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>

.text-h1 {
  font-size: xxx-large;
  font-weight: bold;
}

.text-h2 {
  margin-left: 2em;
  text-align: left;
  font-size: large;
  font-weight: bold;
  color: #4CAF50;
  font-weight: bold;
}

.text-left {
  margin-left: 2em;
  text-align: left;
  font-size: large;
  color: #505050;
}

.text-no-wrap {
  margin-left: 2em;
  text-align: left;
  font-size: large;
  color: #505050;
}

v-card {
  background-color: #f9d9ca;
}

div {
  padding: 20px;
  font-family: "LXGW WenKai TC", cursive;
  font-style: normal;
  font-size: 20px;
}
</style>

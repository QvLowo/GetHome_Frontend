<template>
  <v-data-table
    :headers="headers"
    :items="rentData.results"
    sort-by="startDate"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar color="#353c42"
                 flat
      >
        <v-btn text color="#fbd1a7">
          <v-toolbar-title>租屋訂單</v-toolbar-title>
        </v-btn>
        <v-divider
          class="mx-4"
          inset
          color="white"
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <template>
          <v-dialog
            v-model="dialog"
            max-width="500px"
          >
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                      sm="6"
                      md="6"
                    >
                      請確認是否繼續支付？
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="red"
                  @click="close"
                  outlined
                >
                  取消
                </v-btn>
                <v-btn
                  color="green flat"
                  @click="save"
                  outlined
                >
                  確定
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">請問確定要退租嗎？</v-card-title>
            <v-card-subtitle class="text-h5">注意：若少於一個月(30天)不可退租</v-card-subtitle>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">取消</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">確定</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <template>
          <v-dialog
            v-model="ratingDialog"
            max-width="500px"
          >
            <v-card>
              <v-card-title>
                <span class="text-h5">房屋評論</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                      sm="12"
                      md="8"
                    >
                      <v-rating
                        color="warning"
                        length="5"
                        size="30"
                        style="margin-bottom:10px"
                        v-model="ratingItem.rating"
                      ></v-rating>
                      <v-textarea
                        solo
                        name="input-7-4"
                        v-model="ratingItem.comment"
                        label="請輸入評論內容"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="red"
                  @click="closeRating"
                  outlined
                >
                  取消
                </v-btn>
                <v-btn
                  color="green flat"
                  @click="submit"
                  outlined
                >
                  送出
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
      </v-toolbar>
    </template>

    <template v-slot:item.cancel="{ item }">
      <v-chip
        color="red"
        text-color="white"
        small
        @click="deleteItem(item)"
      >
        退租
      </v-chip>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn rounded color="#353c42" class="white--text" @click="toDetail(item)">付款紀錄</v-btn>
      <v-chip color="green flat" medium @click="addItem(item)">支付租金</v-chip>
      <v-chip color="yellow" @click="ratingHouse(item)" v-show="showButton">
        <v-icon small>mdi-star</v-icon>
        評論
      </v-chip>
    </template>
    <template v-slot:item.view="{ item }">
      <v-icon @click="toContract(item)">mdi-file-search</v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn
        color="primary"
        @click="getRentList"
      >
        重置
      </v-btn>
    </template>
  </v-data-table>
</template>
<script>

import {endLease, getRent, getRentOrder, payRent} from '../../../api/rent'
import {createPayment} from '../../../api/payment'
import Vue from 'vue'

export default {
  data: () => ({
    showButton: true,
    dialog: false,
    dialogDelete: false,
    ratingDialog: false,
    rentId: null,
    userId: null,
    rentInfoId: null,
    ratingItem: {
      rating: 4,
      comment: ''
    },
    queryParams: {
      userId: null,
      houseId: null,
      orderBy: '',
      orderType: '',
      limit: 5,
      offset: 0
    },
    headers: [
      {text: ' - ', align: 'start', value: 'cancel', sortable: false},
      {text: '訂單狀態', value: 'status'},
      {text: '入住日', value: 'startDate'},
      {text: '退租日', value: 'endDate'},
      {text: '租金總額', value: 'totalAmount'},
      {text: '剩餘租金', value: 'accountPayable'},
      {text: '查看', value: 'view', sortable: false},
      {text: '操作', align: 'center', value: 'actions', sortable: false}
    ],
    applyStatus: ['待審核', '已審核', '已退租'],
    rentData: [],
    rentInfoList: [],
    editedIndex: -1,
    createPayOrder: {
      'houseId': null,
      'month': 1
    },
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
              'quantity': 1,
              // 單月金額
              'price': null
            }
          ]
        }
      ]
    }
  }),
  computed: {
    formTitle () {
      return '租金支付預設為 1 個月'
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
    ratingDialog (val) {
      val || this.closeRating()
    }
  },
  created () {
    this.$store.dispatch('userInfo').then(() => {
      this.getRentList()
    })
  },
  methods: {
    toDetail (item) {
      this.rentId = item.rentId
      console.log('toDetail', item)
      this.$router.push({name: 'PaymentInfo', params: {id: this.rentId}})
    },
    getRentList () {
      this.queryParams.userId = this.$store.state.user.id
      getRentOrder(this.queryParams).then(response => {
        this.rentData = response
        this.rentData.results.forEach(item => {
          item.status = this.getStatusText(item.status)
        })
        if (this.rentData.results.length <= 0) {
          Vue.prototype.$message({message: '目前無資料', type: 'info'})
        }
      }).catch(error => {
        console.log('取得租屋訂單失敗', error)
      })
    },
    getStatusText (type) {
      const typeMap = {
        INPROGRESS: '退租待確認',
        PENDING: '待付款',
        COMPLETED: '已完成',
        CANCELLED: '已退租'
      }
      return typeMap[type]
    },
    toContract (item) {
      this.$router.push({name: 'Contract', params: {id: item.rentId}})
    },
    addItem (item) {
      if (item.status === '待付款') {
        Vue.prototype.$message({message: '您尚未支付押金，請點選查看合約繼續支付', type: 'error'})
        this.dialog = false
      } else if (item.status === '已退租' || item.status === '退租待確認') {
        Vue.prototype.$message({message: '此訂單狀態無法支付', type: 'info'})
      } else {
        console.log('addItem', item)
        this.rentId = item.rentId
        getRent(item.rentId).then(response => {
          this.createPayOrder.houseId = response.rentInfoList[0].houseId
        })
        this.dialog = true
      }
    },
    ratingHouse (item) {
      console.log('rating', item)
      this.editedIndex = this.rentData.results.indexOf(item)
      this.ratingDialog = true
    },
    showItem (item) {
      console.log('showItem', item)
      this.$router.push({name: 'PaymentInfo', params: {id: item.rentId}})
    },

    deleteItem (item) {
      console.log('deleteItem', item)
      this.editedIndex = this.rentData.results.indexOf(item)
      this.payRentRequest = Object.assign({}, item)
      this.rentId = Number(item.rentId)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      this.rentData.results.splice(this.editedIndex, 1)
      endLease(this.rentId).then(response => {
        console.log('cancel rent', response)
        this.getRentList()
      }).catch(error => {
        console.log('error', error)
        Vue.prototype.$message({message: '退租失敗', type: 'error'})
        this.getRentList()
      })
      this.closeDelete()
    },
    submit () {
      console.log('submit', this.ratingItem)
      this.rentData.results[this.editedIndex].rating = this.ratingItem.rating
      this.rentData.results[this.editedIndex].comment = this.ratingItem.comment
      this.closeRating()
    },
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.payRentRequest = Object.assign({}, this.rentData)
        this.editedIndex = -1
      })
    },
    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.payRentRequest = Object.assign({}, this.rentData)
        this.editedIndex = -1
      })
    },
    closeRating () {
      this.ratingDialog = false
      this.$nextTick(() => {
        this.payRentRequest = Object.assign({}, this.rentData)
        this.editedIndex = -1
      })
    },
    save () {
      payRent(this.rentId, this.createPayOrder).then(res => {
        this.payRentRequest.orderId = res.paymentId
        this.payRentRequest.amount = res.amount
        this.payRentRequest.packages[0].amount = res.amount
        this.payRentRequest.packages[0].products[0].name = res.houseName
        this.payRentRequest.packages[0].products[0].price = res.amount / this.month
        this.payRentRequest.packages[0].products[0].id = res.houseId
        this.payRentRequest.packages[0].products[0].imageUrl = res.imageUrl
        console.log('pay rent', res)
        this.rentInfoId = res.rentInfoId
        createPayment(this.payRentRequest).then(res => {
          console.log('create payment', res)
          console.log('create payment', res)
          this.confirmRequest.transactionId = res.message
          this.confirmRequest.paymentId = this.payRentRequest.orderId
          this.confirmRequest.amount = this.payRentRequest.packages[0].amount
          sessionStorage.setItem('rentId', this.rentId)
          sessionStorage.setItem('rentInfoId', this.rentInfoId)
          this.close()
          window.location.href = res.paymentUrl
        })
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>
<style scoped>
.elevation-1 {
  background-color: #f3f4ef;
}
</style>

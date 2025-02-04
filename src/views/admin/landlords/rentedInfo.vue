<template>
  <div>
    <v-data-table
      :headers="rentDataHeaders"
      :items="rentData.results"
      sort-by="endDate"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar color="#353c42" flat>
          <v-btn text class="white--text" @click="toHouseRented">
            <v-toolbar-title>出租列表</v-toolbar-title>
          </v-btn>
          <v-divider class="mx-4" inset vertical color="white"></v-divider>
          <v-btn text color="#fbd1a7">
            <v-toolbar-title>金流資料</v-toolbar-title>
          </v-btn>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">請問確定要允許退租嗎？</v-card-title>
            <v-card-subtitle class="text-h5">退租後，房屋狀態將會回復成「待出租」</v-card-subtitle>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">取消</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">確定</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
      <template v-slot:item.cancel="{ item }">
        <v-chip
          color="red"
          text-color="white"
          small
          @click="deleteItem(item)"
          v-show="isProgress(item)"
        >
          允許退租
        </v-chip>
      </template>
      <template v-slot:item.view="{ item }">
        <v-icon @click="toContract(item)">mdi-file-search</v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="getRent">Reset</v-btn>
      </template>
    </v-data-table>
    <v-spacer></v-spacer>
    <!--    下面的table-->
    <v-data-table
      style="margin-top: 20px"
      :headers="rentInfoHeaders"
      :items="rentInfo.results"
      sort-by="lastUpdateDate"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar color="#353c42" flat>
          <v-btn text class="white--text" @click="toHouseRented">
            <v-toolbar-title>出租列表</v-toolbar-title>
          </v-btn>
          <v-divider class="mx-4" inset vertical color="white"></v-divider>
          <v-btn text color="#fbd1a7">
            <v-toolbar-title>金流資料</v-toolbar-title>
          </v-btn>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="getRent">Reset</v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import {checkEndLease, getRentInfo, getRentOrder} from '../../../api/rent'
import {userInfo} from '../../../api/user'
import Vue from 'vue'

export default {
  data: () => ({
    dialogDelete: false,
    queryParams: {
      houseId: '',
      dialogDelete: false,
      orderBy: 'created_date',
      orderType: 'DESC',
      limit: 5,
      offset: 0
    },
    checkEndLeaseRequest: {
      rentId: '',
      houseId: ''
    },
    rentOrderQueryParams: {
      userId: '',
      rentId: '',
      orderBy: 'created_date',
      orderType: 'DESC',
      limit: 5,
      offset: 0
    },
    rentInfo: [],
    rentDataHeaders: [
      {text: '審核退租', align: 'start', value: 'cancel', sortable: false},
      {text: '租客名稱', value: 'userName'},
      {text: '租屋狀態', value: 'status'},
      {text: '入住日', value: 'startDate'},
      {text: '退租日', value: 'endDate'},
      {text: '待收租金', value: 'accountPayable'},
      {text: '租賃契約', align: 'center', value: 'view', sortable: false}
    ],
    rentInfoHeaders: [
      {text: '房屋名稱', align: 'start', value: 'houseName'},
      {text: '金額', value: 'amount'},
      {text: '支付月數', value: 'month'},
      {text: '建立時間', value: 'createDate'},
      {text: '最後更新時間', value: 'lastUpdateDate'}
    ],
    rentData: [],
    userName: '',
    editedIndex: -1
  }),
  watch: {
    dialogDelete (val) {
      val || this.closeDelete()
    }
  },
  created () {
    this.getRent()
  },
  methods: {
    isProgress (item) {
      if (item.status === '退租待確認') {
        return true
      } else {
        return false
      }
    },
    toHouseRented () {
      this.$router.push({name: 'HouseRented'})
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
    getRent () {
      this.queryParams.houseId = this.$route.params.id
      getRentInfo(this.queryParams).then(response => {
        console.log('rentInfo', response)
        this.rentInfo = response
        this.rentOrderQueryParams.rentId = response.results[0].rentId
        return getRentOrder(this.rentOrderQueryParams)
      }).then(response => {
        console.log('rentData', response)
        this.rentData = response
        this.rentData.results.forEach(item => {
          item.status = this.getStatusText(item.status)
        })
        this.userId = response.results[0].userId
        return userInfo(this.userId)
      }).then(response => {
        console.log('userName', response)
        this.rentData.results[0].userName = response.userName
        this.rentDataHeaders = [
          {text: '審核退租', align: 'start', value: 'cancel', sortable: false},
          {text: '租客名稱', value: 'userName'},
          {text: '租屋狀態', value: 'status'},
          {text: '入住日', value: 'startDate'},
          {text: '退租日', value: 'endDate'},
          {text: '待收租金', value: 'accountPayable'},
          {text: '租賃契約', align: 'center', value: 'view', sortable: false}
        ]
      }).catch(error => {
        console.log('error', error)
      })
    },
    closeDelete () {
      this.dialogDelete = false
      console.log('closeDelete', this.dialogDelete)
    },
    deleteItem (item) {
      this.editedIndex = this.rentData.results.indexOf(item)
      this.checkEndLeaseRequest.rentId = item.rentId
      this.checkEndLeaseRequest.houseId = Number(this.$route.params.id)
      this.dialogDelete = true
    },
    deleteItemConfirm () {
      this.rentData.results.splice(this.editedIndex, 1)
      checkEndLease(this.checkEndLeaseRequest).then(response => {
        console.log('checkEndLease', response)
        Vue.prototype.$message({message: '審核退租成功', type: 'success'})
        this.getRent()
      })
      this.closeDelete()
    },
    toContract (item) {
      this.$router.push({name: 'Contract', params: {id: item.rentId}})
    }
  }
}
</script>

<style scoped>
.elevation-1 {
  background-color: #f3f4ef;
}
</style>

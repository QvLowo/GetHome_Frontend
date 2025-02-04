<template>
  <v-data-table
    :headers="headers"
    :items="houses.results"
    sort-by="startDate"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar color="#353c42"
                 flat
      >
        <v-btn text color="#fbd1a7" @click="changeStatus('RENTED')">
          <v-toolbar-title>出租列表</v-toolbar-title>
        </v-btn>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
      </v-toolbar>
    </template>
    <template v-slot:item.imageUrl="{ item }">
      <v-img :src="item.imageUrl" max-width="100" contain></v-img>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn rounded color="#353c42" class="white--text" @click="toDetail(item)">金流資料</v-btn>
    </template>
    <template v-slot:no-data>
      <v-btn
        color="primary"
        @click="getHouseList"
      >
        重置
      </v-btn>
    </template>
  </v-data-table>
</template>
<script>

import Vue from 'vue'
import {houseInfo} from '../../../api/house'

export default {
  data: () => ({
    showButton: true,
    rating: 4,
    dialog: false,
    dialogDelete: false,
    ratingDialog: false,
    houseId: null,
    rentId: null,
    userId: null,
    rentInfoId: null,
    comment: '',
    houses: [],
    queryParams: {
      userId: null,
      houseType: '',
      search: '',
      status: '',
      orderBy: '',
      orderType: '',
      limit: '20',
      offset: 0
    },
    headers: [
      {text: '房屋狀態', align: 'start', value: 'status'},
      {text: '房屋名稱', value: 'houseName'},
      {text: '房屋照片', value: 'imageUrl'},
      {text: '每月租金', value: 'pricePerMonth'},
      {text: '操作', align: 'center', value: 'actions', sortable: false}
    ],
    applyStatus: ['待審核', '已審核', '已退租'],
    editedIndex: -1
  }),
  created () {
    this.$store.dispatch('userInfo').then(() => {
      this.getHouseList()
    })
  },
  methods: {
    changeStatus (status) {
      this.color = '#fbd1a7'
      this.queryParams.status = status
      houseInfo(this.queryParams).then(response => {
        this.houses = response
        if (this.houses.results.length <= 0) {
          Vue.prototype.$message({message: '目前無資料', type: 'info'})
        }
        this.houses.results.forEach(item => {
          item.houseType = this.getTypeText(item.houseType)
          item.status = this.getStatusText(item.status)
        })
      }).catch(error => {
        console.log('請求出錯', error)
      })
    },
    toDetail (item) {
      this.houseId = item.houseId
      console.log('toDetail', item)
      this.$router.push({name: 'RentedInfo', params: {id: this.houseId}})
    },
    getHouseList () {
      this.queryParams.userId = this.$store.state.user.id
      this.queryParams.status = 'RENTED'
      houseInfo(this.queryParams).then(response => {
        this.houses = response
        if (this.houses.results.length <= 0) {
          Vue.prototype.$message({message: '目前無資料', type: 'info'})
        }
        this.houses.results.forEach(item => {
          item.houseType = this.getTypeText(item.houseType)
          item.status = this.getStatusText(item.status)
        })
      }).catch(error => {
        console.log('請求出錯', error)
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
    getStatusText (type) {
      const typeMap = {
        AVAILABLE: '待出租',
        RESERVED: '預訂中',
        RENTED: '已出租'
      }
      return typeMap[type] || ''
    },
    showItem (item) {
      console.log('showItem', item)
      this.$router.push({name: 'PaymentInfo', params: {id: item.rentId}})
    }
  }
}
</script>
<style scoped>
.elevation-1 {
  background-color: #f3f4ef;
}
</style>

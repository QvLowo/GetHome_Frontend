<template>
  <v-data-table
    :headers="headers"
    :items="rentInfo"
    sort-by="startDate"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar color="#353c42"
                 flat
      >
        <v-btn text class="white--text" @click="toOrder">
          <v-toolbar-title>租屋訂單</v-toolbar-title>
        </v-btn>
        <v-btn text color="#fbd1a7">
          <v-toolbar-title>付款紀錄</v-toolbar-title>
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
      <v-icon small @click="showItem(item)">mdi-earth</v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn
        color="primary"
        @click="getRentList"
      >
        Reset
      </v-btn>
    </template>
  </v-data-table>
</template>
<script>

import {getRent} from '../../../api/rent'

export default {
  data: () => ({
    queryParams: {
      orderBy: '',
      orderType: '',
      limit: 5,
      offset: 0
    },
    headers: [
      {text: '房屋名稱', align: 'start', value: 'houseName'},
      {text: '房屋照片', value: 'imageUrl'},
      {text: '支付金額', value: 'amount'},
      {text: '支付月數', value: 'month'},
      {text: '最後更新時間', value: 'lastUpdateDate'},
      {text: '查看房屋資訊', value: 'actions', sortable: false}
    ],
    rentInfo: []
  }),
  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    }
  },

  created () {
    this.getRentList()
  },
  methods: {
    toOrder () {
      this.$router.push({name: 'RentOrder'})
    },
    getRentList () {
      getRent(this.$route.params.id).then(response => {
        this.rentInfo = response.rentInfoList
        console.log('rentInfo', response)
      }).catch(error => {
        console.log('error', error)
      })
    },
    showItem (item) {
      console.log('showItem', item)
      this.$router.push({name: 'Rent', params: {id: item.houseId}})
    }
  }
}
</script>
<style scoped>
.elevation-1 {
  background-color: #f3f4ef;
}
</style>

<template>
  <v-data-table
    :headers="headers"
    :items="houses.results"
    :search="queryParams.search"
    sort-by="type"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar color="#353c42" flat>
        <v-toolbar-title class="white--text">房屋列表</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          color="white"
          v-model="queryParams.search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="#fbd1a7" class="mb-2" v-bind="attrs" v-on="on" style="margin-right: 50px; margin-top: 10px;">
              新增房屋
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.houseName" label="房屋名稱"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-select v-model="editedItem.houseType" :items="type" label="房屋類型">
                    </v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.address" label="地址"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.imageUrl" label="照片網址"></v-text-field>
                    <input type="file"
                           @change="handleFileUpload"
                           name="file"
                           ref="file"
                           label="上傳照片"
                           prepend-icon="mdi-camera"
                           accept="jpg,png,jpeg,webp"
                           multiple>
                    <button @click="onSubmit">上傳
                      <v-progress-circular indeterminate size="20"
                                           v-show="loading" color="#d18063"></v-progress-circular>
                    </button>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.pricePerMonth" label="每月租金"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-select v-model="editedItem.status" :items="houseStatus" label="房屋狀態"></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-textarea
                      solo
                      name="input-7-4"
                      v-model="editedItem.description"
                      label="描述"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">取消</v-btn>
              <v-btn color="blue darken-1" text @click="save">儲存</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">請問確定要刪除嗎？</v-card-title>
            <v-card-subtitle>注意：刪除後不可復原</v-card-subtitle>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">取消</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">確定</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon small @click="deleteItem(item)">
        mdi-delete
      </v-icon>
      <v-icon small @click="showItem(item)">mdi-earth</v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="getHouseList">Reset</v-btn>
    </template>
  </v-data-table>
</template>

<script>
import {addHouse, deleteHouse, houseInfo, updateHouse} from '../../../api/house'
import axios from 'axios'
import Vue from 'vue'

export default {
  id: [],
  data: () => ({
    file: '',
    ownerId: null,
    loading: false,
    dialog: false,
    dialogDelete: false,
    houseStatus: [
      {text: '待出租', value: '待出租'},
      {text: '預訂中', value: '預訂中'},
      {text: '已出租', value: '已出租'}
    ],
    type: [
      {text: '整層住家', value: '整層住家'},
      {text: '分租套房', value: '分租套房'},
      {text: '獨立套房', value: '獨立套房'},
      {text: '雅房', value: '雅房'}
    ],
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
      {
        text: '房屋名稱',
        align: 'start',
        sortable: false,
        value: 'houseName'
      },
      {text: '房屋類型', value: 'houseType'},
      {text: '地址', value: 'address'},
      {text: '每月租金', value: 'pricePerMonth'},
      {text: '狀態', value: 'status'},
      {text: '操作', value: 'actions', sortable: false}
    ],
    houses: [],
    userId: null,
    editedIndex: -1,
    editedItem: {
      houseType: '',
      houseName: '',
      address: '',
      imageUrl: '',
      pricePerMonth: 0,
      status: '',
      description: ''
    },
    defaultItem: {
      houseType: '',
      houseName: '',
      address: '',
      imageUrl: '',
      pricePerMonth: 0,
      status: '',
      description: ''
    }
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '新增房屋' : '編輯房屋'
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    }
  },
  created () {
    this.$store.dispatch('userInfo').then(() => {
      this.getHouseList()
    })
  },
  methods: {
    handleFileUpload () {
      this.file = this.$refs.file.files[0]
      console.log(this.file)
      this.loading = true
    },
    onSubmit () {
      const accessToken = 'ccf3decc222a944a59dbc412f0081e62ba00520e'
      // const apiKey = 'd9ccf2474cf139b'
      let formData = new FormData()
      formData.append('image', this.file)
      formData.append('album', 'bT9XvKc')
      axios({
        method: 'POST',
        // 後端已設置，因此設定false避免CORS錯誤
        withCredentials: false,
        withXSRFToken: false,
        url: 'https://api.imgur.com/3/image',
        headers: {
          // 登入用戶
          Authorization: 'Bearer ' + accessToken
          // 匿名
          //   'Client-ID ' + apiKey
        },
        data: formData
      }).then(res => {
        console.log(JSON.stringify(res.data))
        console.log('res', res)
        this.editedItem.imageUrl = res.data.data.link
        Vue.prototype.$message({message: '上傳成功', type: 'success'})
        this.loading = false
        console.log('img', this.editedItem.imageUrl)
      }).catch(e => {
        Vue.prototype.$message({message: '上傳失敗', type: 'error'})
        console.log(e)
      })
    },
    getHouseList () {
      this.queryParams.userId = this.$store.state.user.id
      houseInfo(this.queryParams).then(response => {
        console.log('response:', response)
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
        console.log('qq', this.queryParams)
      })
    },
    // 後端資料傳前端轉中文
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
    postType (type) {
      const typeMap = {
        雅房: 'BEDSIT',
        整層住家: 'APARTMENT',
        分租套房: 'SHAREROOMS',
        獨立套房: 'STUDIO'
      }
      return typeMap[type] || ''
    },
    postStatus (type) {
      const typeMap = {
        待出租: 'AVAILABLE',
        預訂中: 'RESERVED',
        已出租: 'RENTED'
      }
      return typeMap[type] || ''
    },
    editItem (item) {
      this.editedItem = Object.assign({}, item)
      this.editedIndex = this.houses.results.indexOf(item)
      this.dialog = true
    },
    showItem (item) {
      this.editedItem = Object.assign({}, item)
      this.editedIndex = this.houses.results.indexOf(item)
      this.$router.push({name: 'Rent', params: {id: item.houseId}})
    },
    deleteItem (item) {
      this.editedIndex = this.houses.results.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      console.log('id:', this.editedItem.houseId)
      this.houses.results.splice(this.editedIndex, 1)
      this.editedItem.houseType = this.postType(this.editedItem.houseType)
      this.editedItem.status = this.postStatus(this.editedItem.status)
      deleteHouse(this.editedItem.houseId).then(response => {
        this.houses = response
        Vue.prototype.$message({message: '刪除成功', type: 'success'})
      }).catch(error => {
        console.log('刪除失敗', error)
        Vue.prototype.$message({message: '刪除失敗，該房屋狀態不可刪除', type: 'error'})
      })
      this.closeDelete()
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.getHouseList()
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.getHouseList()
        this.editedIndex = -1
      })
    },

    save () {
      const houseId = this.editedItem.houseId
      Object.assign({}, this.editedItem)
      this.editedItem.houseType = this.postType(this.editedItem.houseType)
      this.editedItem.status = this.postStatus(this.editedItem.status)
      // 更新房屋
      if (this.editedIndex > -1) {
        delete this.editedItem.houseId
        delete this.editedItem.userId
        delete this.editedItem.createdDate
        delete this.editedItem.lastUpdateDate
        console.log('test:', this.editedItem)
        updateHouse(houseId, this.editedItem).then(response => {
          this.getHouseList()
          console.log('update:', response)
        })
        Vue.prototype.$message({message: '修改成功', type: 'success'})
      } else {
        // 新增房屋
        this.userId = this.$store.state.user.id
        addHouse(this.userId, this.editedItem).then(response => {
          this.houses = response
          this.getHouseList()
        })
        this.houses.results.push(this.editedItem)
        Vue.prototype.$message({message: '新增成功', type: 'success'})
      }
      this.close()
    }
  }
}
</script>

<style scoped>
.elevation-1 {
  background-color: #f3f4ef;
}
</style>

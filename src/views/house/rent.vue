<template>
  <v-app id="inspire">
    <!-- 頂部導航欄 -->
    <nav-bar></nav-bar>

    <!-- 左側導航抽屜 -->
    <v-navigation-drawer
      v-bind:width="350"
      v-model="drawer"
      right
      app
    >
      <template>
        <v-expansion-panels accordion multiple>
          <v-expansion-panel>
            <v-expansion-panel-header>
              租屋須知
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <ul>
                <li>最短租期為 1 個月。</li>
                <li>押金：每月租金的 2 倍。</li>
              </ul>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>
              確定租屋流程
            </v-expansion-panel-header>
            <v-expansion-panel-content accordion>
              <ul>
                <li>確定租屋:即跳轉線上簽署合約頁面</li>
              </ul>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>
              簽署合約流程
            </v-expansion-panel-header>
            <v-expansion-panel-content accordion>
              <ul>
                <li>確認簽署:跳轉至LinePay支付租金頁面</li>
              </ul>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </template>
      <!--      入住日期選擇器-->
      <template>
        <v-row class="date" justify="space-around">
          <v-col cols="12">
            <v-menu
              v-model="menu1"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="rentRequest.startDate"
                  label="請選擇入住日期"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="rentRequest.startDate"
                :min="minDate"
                @input="menu1 = false"
              ></v-date-picker>
              <v-spacer></v-spacer>
            </v-menu>
          </v-col>
        </v-row>
      </template>
      <!--退租日期選擇器-->
      <template>
        <v-row class="date" justify="space-around">
          <v-col cols="12">
            <v-menu
              v-model="menu2"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="rentRequest.endDate"
                  label="請選擇退租日期"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="rentRequest.endDate"
                :min="minEndDate"
                @input="menu2 = false"
              ></v-date-picker>
              <v-spacer></v-spacer>
            </v-menu>
            <v-col class="button">
              <v-btn variant="outlined" @click="handleRent">
                確定租屋
              </v-btn>
              <v-dialog v-model="dialogCheck" max-width="500px">
                <v-card>
                  <v-card-title class="text-h5">請問確定要租這間房屋嗎？</v-card-title>
                  <v-spacer></v-spacer>
                  <v-card-subtitle>您選擇的租賃期間為：</v-card-subtitle>
                  <v-card-text>
                    <p>入住日期：{{ rentRequest.startDate }}</p>
                    <p>退租日期：{{ rentRequest.endDate }}</p>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeCheck">取消</v-btn>
                    <v-btn color="blue darken-1" text @click="checkItemConfirm">確定</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
          </v-col>
        </v-row>
      </template>
    </v-navigation-drawer>

    <!-- 主內容區域 -->
    <v-main>
      <v-container>
        <v-row>
          <v-col>
            <v-card :items="houses">
              <v-carousel height="400"
                          hide-delimiters>
                <v-img
                  referrerpolicy="no-referrer"
                  :src="houses.imageUrl"
                  class="white--text align-end"
                  gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                  height="500px" width="100%">
                  <v-card-title>
                    <h1 class="headline mb-0">房屋照片</h1>
                  </v-card-title>
                </v-img>
              </v-carousel>
              <p class="text-left">
                <v-card-text>
                  <h2>狀態：{{ getStatusText(houses.status) }}</h2>
                  <h2>每月租金：{{ houses.pricePerMonth }}</h2>
                  <h2>房型：{{ getTypeText(houses.houseType) }}</h2>
                  <h2>地址：{{ houses.address }}</h2>
                  <h2>其他資訊：</h2>
                  <h2>{{ houses.description }}</h2>
                  <p></p>
                  <h2>刊登日期：{{ houses.createdDate }}</h2>
                  <h2>最後更新：{{ houses.lastUpdateDate }}</h2>
                </v-card-text>
              </p>
              <v-col align="center">
                <v-card>
                  <v-card-title>
                    <h2>屋主資訊</h2>
                  </v-card-title>
                  <v-img height="200px" width="200px"
                         src="https://images.pexels.com/photos/6982643/pexels-photo-6982643.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  >
                  </v-img>
                  <v-card-text>
                    <v-divider></v-divider>
                    <h3>姓名：{{ owner.userName }}</h3>
                    <h3>性別：{{ getGenderText(owner.gender) }}</h3>
                    <h3>
                      <v-icon>mdi-phone</v-icon>
                      {{ owner.phone }}
                    </h3>
                    <h3>
                      <v-icon>mdi-email</v-icon>
                      {{ owner.email }}
                    </h3>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>

import navBar from '../../components/navBar.vue'
import {getHouse} from '../../api/house'
import {createRent} from '../../api/rent'
import {userInfo} from '../../api/user'
import Vue from 'vue'

export default {
  components: {navBar},
  data: () => ({
    dialogCheck: false,
    rentRequest: {
      rentItemList: [{
        houseId: null,
        // 押金預設為2個月租金
        month: 2
      }],
      startDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      endDate: (() => {
        const endDate = new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)
        endDate.setMonth(endDate.getMonth() + 1)
        return endDate.toISOString().substr(0, 10)
      })()
    },
    minDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    minEndDate: (() => {
      const endDate = new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)
      endDate.setMonth(endDate.getMonth() + 1)
      return endDate.toISOString().substr(0, 10)
    })(),
    menu1: false,
    menu2: false,
    drawer: null,
    houses: [],
    owner: [],
    ownerId: null
  }),
  created () {
    this.getHouseInfo()
  },
  methods: {
    getHouseInfo () {
      getHouse(this.$route.params.id).then(response => {
        this.houses = response
        this.ownerId = response.userId
        this.rentRequest.rentItemList[0].houseId = this.houses.houseId
        userInfo(this.ownerId).then(response => {
          this.owner = response
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
    getGenderText (gender) {
      const typeMap = {
        MALE: '男',
        FEMALE: '女'
      }
      return typeMap[gender] || ''
    },
    getStatusText (type) {
      const typeMap = {
        AVAILABLE: '待出租',
        RESERVED: '預訂中',
        RENTED: '已出租'
      }
      return typeMap[type] || ''
    },
    checkItemConfirm () {
      createRent(this.$store.state.user.id, this.rentRequest).then(response => {
        this.rentId = response.rentId
        console.log('req', this.rentRequest)
        this.dialogCheck = true
        this.$router.push({name: 'Contract', params: {id: this.rentId}})
      }).catch(error => {
        if (error.response.status === 403) {
          Vue.prototype.$message({message: '請確認日期是否正確', type: 'error'})
        } else {
          console.log(error)
        }
      })
    },
    closeCheck () {
      this.dialogCheck = false
    },
    handleRent () {
      if (this.$store.state.user.id === null || this.$store.state.user.id === '') {
        this.dialogCheck = false
        Vue.prototype.$message({message: '請先登入', type: 'error'})
        this.$router.push({name: 'Login'})
      } else if (this.$store.state.user.auth === 'ROLE_LANDLORD') {
        Vue.prototype.$message({message: '權限不足，禁止進行此操作', type: 'error'})
        this.dialogCheck = false
      } else {
        this.dialogCheck = true
      }
    }
  }
}
</script>

<style>
.button {
  margin-top: 30px;
}

.date {
  margin-top: 100px;
}

h2 {
  font-size: 20px;
  font-weight: bold;
}

h3 {
  padding-top: 10px;
  font-size: 20px;
}

</style>

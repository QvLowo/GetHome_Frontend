<template>
  <v-app>
    <!-- navBar -->
    <v-app-bar :color="navColor" @click="scrollToTop" app fixed>
      <v-toolbar-title>
        <v-icon large
                color="#d18063">mdi-home-roof
        </v-icon>
        <v-divider class="mx-1" inset vertical></v-divider>
        <v-icon color="#d18063" v-show="isLogin">mdi-account</v-icon>
        {{ userName }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <router-link :to="{name:'Houses'}">
        <v-btn text @click="scrollToHouse">
          <v-icon>mdi-home-group</v-icon>
          租房
        </v-btn>
      </router-link>
      <v-btn text @click="toHouseEdit">
        <v-icon>mdi-home-circle</v-icon>
        出租
      </v-btn>
      <v-btn text @click="toAdmin">
        <v-icon>mdi-cog-box</v-icon>
        管理
      </v-btn>
      <v-btn text v-show="isLogin" @click="handleLogout">
        <v-icon>mdi-logout-variant</v-icon>
        登出
      </v-btn>
      <router-link :to="{name:'Login'}">
        <v-btn text v-show="!isLogin">
          <v-icon>mdi-login</v-icon>
          登入
        </v-btn>
      </router-link>
      <router-link :to="{name:'Register'}">
        <v-btn text v-show="!isLogin">
          <v-icon>mdi-account-plus</v-icon>
          註冊
        </v-btn>
      </router-link>
    </v-app-bar>
    <!-- Hero Section -->
    <v-parallax height="650" class="hero_section"
                src="https://images.pexels.com/photos/461755/pexels-photo-461755.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                dark>
      <v-container fill-height fluid class="parallax-content">
        <v-row align="center" justify="center">
          <v-col cols="12" md="8" class="text-center">
            <h1 class="display-1">抵家租屋</h1>
            <p class="subtitle-1">來抵家輕鬆找到理想的家</p>
            <v-container>
              <!-- Search -->
              <v-row align="center" justify="center" class="search">
                <v-col cols=" 12
              " md="4">
                  <v-select
                    v-model="selectedCity"
                    :items="cities"
                    label="城市"
                    outlined
                    @change="updateArea"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="queryParams.search"
                    :items="areas[selectedCity] || []"
                    label="區域"
                    outlined
                  ></v-select>
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="queryParams.houseType"
                    :items="houseTypes"
                    label="房屋類型"
                    outlined
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="address" label="搜尋地址" placeholder="請輸入地址" outlined
                                @click="handleReset"></v-text-field>
                </v-col>
                <v-col cols="12" md="3">
                  <v-btn text @click="handleSubmit">搜尋
                  </v-btn>
                </v-col>
                <v-col cols="12" md="4">
                  <v-btn text @click="handleReset">重置</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
    </v-parallax>

    <!--    房屋展示-->
    <v-container>
      <v-row>
        <template>
          <v-col
            v-for="houseData in houses"
            :key="houseData.houseId"
            cols="12" sm="6" md="4"
          >
            <router-link class="link" :to="{name:'Rent', params: {id: houseData.houseId}}">
              <v-card :item="houses.results">
                <v-img
                  referrerpolicy="no-referrer"
                  :src="houseData.imageUrl"
                  class="white--text align-end"
                  gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                  height="200px">
                  <v-card-title v-text="houseData.houseName">
                  </v-card-title>
                </v-img>
                <v-card-text v-model="houseData.houseType">房屋類型：{{ getTypeText(houseData.houseType) }}</v-card-text>
                <v-card-text v-model="houseData.pricePerMonth">每月租金：{{ houseData.pricePerMonth }}</v-card-text>
                <v-card-text v-model="houseData.address">地址：{{ houseData.address }}</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn icon>
                    <v-icon>mdi-heart</v-icon>
                  </v-btn>
                  <v-btn icon>
                    <v-icon>mdi-bookmark</v-icon>
                  </v-btn>
                  <v-btn icon>
                    <v-icon>mdi-share-variant</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </router-link>
          </v-col>
          <v-col cols="12">
            <p>&copy; 2024 QvL</p>
          </v-col>
        </template>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>

import {houseInfo} from '../../api/house'
import Vue from 'vue'
import Cookies from 'js-cookie'

export default {
  data () {
    return {
      houses: [],
      address: '',
      queryParams: {
        houseName: '',
        houseType: '',
        search: '',
        status: 'AVAILABLE',
        orderBy: 'price_per_month',
        orderType: 'asc',
        limit: 3,
        offset: 0
      },
      houseData: {
        houseName: '',
        imageUrl: '',
        pricePerMonth: '',
        lastUpdateDate: '',
        houseType: '',
        description: ''
      },
      tab: null,
      navColor: 'transparent',
      cities: ['台北市', '新北市'],
      areas: {
        '台北市':
          ['大安區', '中山區', '信義區', '內湖區', '士林區', '北投區', '文山區', '松山區', '中正區', '大同區', '南港區', '萬華區'],
        '新北市':
          ['板橋區', '三重區', '中和區', '永和區', '新莊區', '新店區', '土城區', '蘆洲區', '樹林區', '汐止區', '鶯歌區', '三峽區',
            '淡水區', '瑞芳區', '五股區', '泰山區', '林口區', '深坑區', '石碇區', '坪林區', '三芝區', '石門區', '八里區', '平溪區', '雙溪區',
            '貢寮區', '金山區', '萬里區', '烏來區']
      },
      houseTypes: [{text: '整層住家', value: 'APARTMENT'}, {text: '分租套房', value: 'SHAREROOMS'},
        {text: '獨立套房', value: 'STUDIO'}, {text: '雅房', value: 'BEDSIT'}],
      selectedCity:
        '',
      selectedArea:
        '',
      searchQuery:
        '',
      houseIndex: -1
    }
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
    this.userInfo()
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  created () {
    this.getHouseList()
    console.log(this.houseData)
  },
  computed: {
    userName () {
      return this.$store.state.user.name || Cookies.get('name')
    },
    isLogin () {
      if (this.$store.state.user.name !== '') {
        return true
      } else if (Cookies.get('name')) {
        return true
      }
    }
  },
  methods: {
    toHouseEdit () {
      if (this.$store.state.user.auth === 'ROLE_LANDLORD') {
        this.$router.push({name: 'HouseEdit'})
      } else {
        Vue.prototype.$message({message: '您沒有權限，禁止訪問此頁面', type: 'error'})
      }
    },
    toAdmin () {
      if (this.$store.state.user.auth !== '') {
        this.$router.push({name: 'Admin'})
      } else {
        Vue.prototype.$message({message: '請先登入', type: 'error'})
        setTimeout(() => {
          this.$router.push({name: 'Login'})
        }, 500)
      }
    },
    userInfo () {
      this.$store.dispatch('userInfo')
    },
    handleLogout () {
      if (this.$store.state.user.name) {
        this.$store.dispatch('logout')
        Vue.prototype.$message({message: '登出成功', type: 'success'})
      }
    },
    scrollToPosition (position) {
      window.scrollTo({
        top: position,
        behavior: 'auto'
      })
    },
    handleSubmit () {
      if (this.address !== '') {
        this.queryParams.search = this.address
        this.getHouseList(this.queryParams)
      } else {
        this.getHouseList()
        setTimeout(() => {
          this.scrollToPosition(550)
        }, 300)
      }
    },
    getHouseList () {
      houseInfo(this.queryParams).then(response => {
        this.houses = response.results
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
    updateArea () {
      this.queryParams.search = this.selectedCity
    },
    handleReset () {
      Object.assign(this.queryParams, this.$options.data().queryParams)
      this.selectedCity = this.$options.data().selectedCity
      this.address = this.$options.data().address
      this.getHouseList()
    },
    handleScroll () {
      if (window.scrollY > 50) {
        this.navColor = '#f0e4d4'
      } else {
        this.navColor = 'rgba(255, 255, 255, 0.6)'
      }
    },
    scrollToTop () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth' // 平滑滾動效果
      })
    },
    scrollToHouse () {
      setTimeout(() => {
        this.$router.push({name: 'Houses', params: this.queryParams})
        this.scrollToPosition(550)
      }, 300)
    }
  }
}
</script>

<style>
.parallax-content {
  margin-top: 100px;
  margin-bottom: 80px;
  background-color: rgba(255, 255, 255, 0.6);
}

.display-1, .subtitle-1 {
  color: #333;
}

.link {
  text-decoration: none;
}

</style>

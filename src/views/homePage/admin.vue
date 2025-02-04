<template>
  <v-app id="admin">
    <!-- 頂部導航欄 -->
    <nav-bar class="nav" :color="navColor,btnColor,textColor,homeColor">
    </nav-bar>

    <!-- 左側導航抽屜 -->
    <v-navigation-drawer color="#353C42"
                         v-model="drawer"
                         app
    >
      <v-list>
        <v-list-item style="color: #fff;"
                     v-for="(item, index) in menuItems"
                     :key="index"
                     @click="navigate(item.route)"
                     v-show="authShow(item)"
        >
          <v-list-item-icon>
            <v-icon color="#fbd1a7">{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- 主內容區域 -->
    <v-main class="main">
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
import navBar from '../../components/navBar.vue'

export default {
  components: {navBar},
  data: () => ({
    drawer: null,
    navColor: 'rgba(37,38,33,0.8)',
    btnColor: '#fff',
    textColor: '#fff',
    homeColor: '#fff',
    roles: '',
    menuItems: [
      {title: '房屋管理', route: '/houseEdit', icon: 'mdi-account', roles: ['ROLE_LANDLORD']},
      {title: '金流管理', route: '/houseRented', icon: 'mdi-cash', roles: ['ROLE_LANDLORD']},
      {title: '租屋相關', route: '/rent-order', icon: 'mdi-cash', roles: ['ROLE_TENANT']},
      {title: '會員資料', route: '/users', icon: 'mdi-cog', roles: ['']}
    ]
  }),
  methods: {
    navigate (route) {
      this.$router.push(route)
    },
    authShow (item) {
      const userRoles = this.$store.state.user.auth
      return item.roles.includes(userRoles)
    }
  }
}
</script>
<style>
#admin {
  font-family: "cwTeXYen";
  font-style: normal;
  font-weight: 500;
}

.main {
  font-family: "cwTeXYen";
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  background-color: #607178;
}
</style>

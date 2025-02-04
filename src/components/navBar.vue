<template>
  <!-- navBar -->
  <v-app-bar :color="color" app fixed>
    <v-toolbar-title @click="toIndex">
      <v-icon large
              color="#d18063">mdi-home-roof
      </v-icon>
      <h4 :style="{color: homeColor}" class="home-title">home</h4>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <div :style="{color: textColor}" v-show="showLogout">
      <v-icon color="#fbd1a7">mdi-account</v-icon>
      {{ userName }}
      <v-btn text :color="btnColor" class="logout-btn" right icon depressed @click="handleLogout"
             style="margin-right:5px">
        <v-icon color="#fbd1a7">mdi-logout-variant</v-icon>
        登出
      </v-btn>
    </div>
  </v-app-bar>
</template>
<script>

import Cookies from 'js-cookie'

export default {
  props: {
    color: {
      type: String,
      default: 'rgba(255, 255, 255, 0.6)'
    },
    btnColor: {
      type: String,
      default: '#000'
    },
    textColor: {
      type: String,
      default: '#000'
    },
    homeColor: {
      type: String,
      default: '#000'
    }
  },
  data () {
    return {
      navColor: 'transparent'
    }
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  computed: {
    userName () {
      return this.$store.state.user.name || Cookies.get('name')
    },
    showLogout () {
      return this.$store.state.user.name !== '' || Cookies.get('name') !== ''
    }
  },
  created () {
    this.userInfo()
  },
  methods: {
    userInfo () {
      this.$store.dispatch('userInfo')
      this.$store.dispatch('getAuth')
    },
    handleScroll () {
      if (window.scrollY > 30) {
        this.navColor = '#f0e4d4'
      } else {
        this.navColor = 'rgba(255, 255, 255, 0.6)'
      }
    },
    handleLogout () {
      if (this.$store.state.user.name) {
        this.$store.dispatch('logout')
        this.$router.push({name: 'Index'})
      }
    },
    toIndex () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth' // 平滑滾動效果
      })
      this.$router.push({name: 'Index'})
    }
  }
}
</script>
<style scoped>
.login-user {
  margin-right: 15px;
}

.home-title {
  font-family: "Ubuntu", sans-serif;
}

v-app-bar {
  transition: background-color 0.3s ease;
}

.logout-btn {
  color: #fbd1a7;
}

</style>

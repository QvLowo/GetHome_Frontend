<template>
  <div id="app">
    <!--    <router-link to="/">首頁</router-link>-->
    <!--    <router-link to="/users/login">登入頁</router-link>-->
    <!--    顯示路由元件-->
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App',
  mounted () {
    window.addEventListener('unload', this.saveState)
  },
  methods: {
    saveState () {
      window.sessionStorage.setItem('state', JSON.stringify(this.$store.state.user))
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #D18063;
  margin-top: 0px;
}
</style>

<template>
  <v-app>
    <v-container fluid fill-height class="page">
      <v-row align="center" justify="center">
        <v-row class="title" align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <h1 class="text-md-h3 text-decoration-overline">Welcome</h1>
            <h1 class="text-md-h3 ">Back</h1>
          </v-col>
        </v-row>
        <!-- 登入框 -->
        <v-col class="form" cols="12" sm="8" md="4">
          <v-card class="d-flex justify-center mb-6 bg-surface-variant">
            <v-card-text>
              <v-form lazy-validation>
                <v-alert
                  v-show="loginError"
                  type="error"
                  class="mb-4"
                  data-test="loginAlert"
                >
                  登入失敗，請確認電話或密碼是否正確
                </v-alert>
                <!-- 登入按鈕和註冊按鈕 -->
                <v-col>
                  <v-btn color="primary" @click="googleSignIn">
                    <v-icon color="white">mdi-google</v-icon>
                    使用Google登入
                  </v-btn>
                </v-col>
                <v-row class="switch" align="center" justify="center">
                  <v-col cols="auto">
                    <v-btn variant="outlined"
                           dark
                    >
                      Login
                    </v-btn>
                    <v-btn variant="outlined"
                           @click="handleSignUpClick"
                    >
                      Sign Up
                    </v-btn>
                  </v-col>
                </v-row>
                <!-- 帳號 -->
                <v-text-field
                  v-model="loginForm.phone"
                  label="Phone"
                  placeholder="請輸入手機號碼"
                  outlined
                  dense
                  :rules="formRules.phone"
                  required
                ></v-text-field>
                <!-- 密碼 -->
                <v-text-field
                  v-model="loginForm.password"
                  label="Password"
                  placeholder="請輸入密碼"
                  outlined
                  dense
                  :rules="formRules.password"
                  required
                  @keyup.enter="handleLogin"
                ></v-text-field>
                <v-col>
                  <v-text-field
                    solo
                    v-model="loginForm.code"
                    label="VerifyCode"
                    placeholder="請輸入驗證碼計算結果"
                    prepend-inner-icon="mid-check-circle-outline"
                    outlined
                    style="width:100%"
                    dense
                    required>
                  </v-text-field>
                  <img :src="codeUrl" @click="getCode" class="login-code-img"/>
                </v-col>
                <v-btn style="width:100%;" @click="handleLogin"
                       rounded
                       color="#f9d9ca">登入
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import {getCodeImg, getGoogleToken, getGoogleUser, googleAuth} from '../../api/login'
import Cookies from 'js-cookie'
import NavBar from '../../components/navBar.vue'

export default {
  name: 'Login',
  components: {NavBar},
  data () {
    return {
      codeUrl: '',
      googleCode: {
        code: ''
      },
      lineCode: {
        code: ''
      },
      googleToken: '',
      lineToken: '',
      loginError: false,
      formRules: {
        phone: [v => !!v || '手機號碼為必填'],
        password:
          [v => !!v || '密碼為必填']
      },
      loginForm: {
        phone: '',
        password: '',
        code: '',
        uuid: ''
      }
    }
  },
  mounted () {
    this.googleCode.code = this.$route.query.code
    if (this.googleCode !== undefined && this.googleCode !== null && this.googleCode !== '') {
      getGoogleToken(this.googleCode).then(res => {
        this.googleToken = res.access_token
        getGoogleUser(this.googleToken).then(res => {
          Cookies.set('id', res.id)
          Cookies.set('name', res.name)
          Cookies.set('email', res.email)
          // 抵家登入邏輯
          console.log('登入成功', res)
          this.$router.push({name: 'UserEdit'})
        })
      })
    }
  },
  created () {
    this.getCode()
  },
  methods: {
    getCode () {
      getCodeImg().then(res => {
        console.log('img', res)
        this.codeUrl = 'data:image/gif;base64,' + res.img
        this.loginForm.uuid = res.uuid
      }).catch(error => {
        console.log(error)
      })
    },
    googleSignIn () {
      googleAuth().then(res => {
        window.location.href = res
      })
    },
    handleSignUpClick () {
      this.$router.push('/goRegister') // 導航到註冊頁面
    },
    handleLogin () {
      this.$store.dispatch('Login', this.loginForm).then(() => {
        this.$store.dispatch('userInfo')
        this.$store.dispatch('getAuth')
        this.$router.push({path: this.redirect || '/index'}).catch(() => {
        })
      }).catch(error => {
        this.loginError = true
        console.log('請求出錯', error)
        console.log('from', this.loginForm)
      })
    }
  }
}

</script>

<style>
.form {
  padding-right: 20px;
}

.page {
  background-image: url('https://images.pexels.com/photos/2088205/pexels-photo-2088205.jpeg');
  background-size: cover;
  background-position: center;
}

.switch {
  margin-bottom: 5px;
}
</style>

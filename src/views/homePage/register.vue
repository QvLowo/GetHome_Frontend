<template>
  <v-app>
    <v-container fluid fill-height class="page">
      <v-row align="center" justify="center">
        <v-row class="title" align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <h1 class="text-md-h3 text-decoration-overline">Welcome</h1>
            <h1 class="text-md-h3">Get Home</h1>
          </v-col>
        </v-row>
        <!-- 登入框 -->
        <v-col class="form" cols="12" sm="8" md="4">
          <v-card class="d-flex justify-center mb-6 bg-surface-variant">
            <v-card-text>
              <v-form lazy-validation>
                <!-- 登入按鈕和註冊按鈕 -->
                <v-row class="switch" align="center" justify="center">
                  <v-col cols="auto">
                    <v-btn variant="outlined"
                           @click="toLoginPage"
                    >
                      Login
                    </v-btn>
                    <v-btn variant="outlined"
                           dark
                    >
                      Sign Up
                    </v-btn>
                  </v-col>
                </v-row>
                <v-radio-group label="性別：" v-model="registerData.gender" row dense required :rules="formRules.gender">
                  <v-radio
                    label="男"
                    value='MALE'
                  ></v-radio>
                  <v-radio
                    label="女"
                    value='FEMALE'
                  ></v-radio>
                </v-radio-group>
                <v-radio-group label="我想當：" v-model="roleId" row dense required :rules="formRules.roleId">
                  <v-radio
                    label="房東"
                    value='1'
                  ></v-radio>
                  <v-radio
                    label="租客"
                    value='2'
                  ></v-radio>
                </v-radio-group>
                <!-- 帳號 -->
                <v-text-field
                  v-model="registerData.phone"
                  label="Phone"
                  placeholder="請輸入手機號碼"
                  outlined
                  :rules="formRules.phone"
                  dense
                  required
                ></v-text-field>
                <v-text-field
                  v-model="registerData.email"
                  label="Email"
                  placeholder="請輸入電子信箱"
                  :rules="formRules.email"
                  outlined
                  dense
                  required
                ></v-text-field>
                <v-text-field
                  v-model="registerData.username"
                  label="姓名"
                  :rules="formRules.username"
                  placeholder="請輸入真實姓名"
                  outlined
                  dense
                  required
                >
                </v-text-field>
                <!-- 密碼 -->
                <v-text-field
                  v-model="registerData.password"
                  label="Password"
                  placeholder="請輸入密碼"
                  type="password"
                  :rules="formRules.password"
                  outlined
                  dense
                  required
                ></v-text-field>
                <v-text-field
                  v-model="confirmPassword"
                  label="Confirm Password"
                  placeholder="請再次輸入密碼"
                  :rules="formRules.confirmPassword"
                  type="password"
                  outlined
                  dense
                  required
                ></v-text-field>
                <v-btn rounded block
                       color="#f9d9ca" @click="handleSignUp">
                  註冊
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
import navBar from '../../components/navBar.vue'
import {signUp} from '../../api/user'

export default {
  components: {navBar},
  data () {
    return {
      roleId: null,
      formRules: {
        phone: [
          v => !!v || '請輸入手機號碼',
          v => /^09\d{8}$/.test(v) || '手機號碼格式錯誤'
        ],
        email: [
          v => !!v || '請輸入電子信箱',
          v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || '電子信箱格式錯誤'
        ],
        username: [
          v => !!v || '請輸入姓名',
          v => /^[\u4e00-\u9fa5a-zA-Z0-9]+$/.test(v) || '姓名格式錯誤'
        ],
        password: [
          v => !!v || '請輸入密碼'
        ],
        confirmPassword: [
          v => !!v || '請再次輸入密碼',
          v => this.registerData.password === v || '密碼不一致'
        ],
        gender: [
          v => !!v || '請選擇性別'
        ],
        roleId: [
          v => !!v || '請選擇身份'
        ]
      },
      registerData: {
        username: '',
        phone: '',
        password: '',
        email: '',
        gender: ''
      },
      confirmPassword: ''
    }
  },
  methods: {
    toLoginPage () {
      this.$router.push('/login')
    },
    handleSignUp () {
      signUp(this.roleId, this.registerData).then(res => {
        console.log(this.registerData)
        console.log(res)
        this.$store.dispatch('userInfo')
        this.$router.push('/index')
      }).catch(err => {
        console.log(err)
        console.log(this.registerData)
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
  margin-bottom: 20px;
}

.clicked {
  background-color: white !important;
  color: black !important;
}
</style>

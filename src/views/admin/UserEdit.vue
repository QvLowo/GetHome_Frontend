<script setup>

</script>

<template>
  <v-card style="max-width: 600px; center; margin: auto; margin-top: 20px ">
    <v-card-title>
      <h3 class="headline mb-0">會員資料更新</h3>

    </v-card-title>
    <v-card-text>
      <v-col cols="12" sm="6" md="4">
        <v-row>
          <v-radio-group label="我想當：" v-model="roleId" dense required :rules="formRules.roleId">
            <v-radio
              label="房東"
              value='1'
            ></v-radio>
            <v-radio
              label="租客"
              value='2'
            ></v-radio>
          </v-radio-group>
        </v-row>
        <v-row>
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
        </v-row>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-text-field
          label="姓名"
          v-model="registerData.username"
          required
          disabled
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          label="Email"
          v-model="registerData.email"
          required
          disabled
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field
          label="電話"
          v-model="registerData.phone"
          required
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-btn color="primary" @click="updateUser">
          確認送出

        </v-btn>
      </v-col>
    </v-card-text>
  </v-card>
</template>
<script>
import Cookies from 'js-cookie'
import {signUp, userInfo} from '../../api/user'
import Vue from 'vue'

export default {
  data () {
    return {
      formRules: {
        gender: [
          v => !!v || '請選擇性別'
        ],
        roleId: [
          v => !!v || '請選擇身份'
        ]
      },
      roleId: '',
      registerData: {
        username: Cookies.get('name'),
        phone: '',
        password: Cookies.get('id'),
        email: Cookies.get('email'),
        gender: ''
      }
    }
  },
  methods: {
    updateUser () {
      signUp(this.roleId, this.registerData).then(response => {
        console.log('su', response)
        const userId = response.userId
        Vue.prototype.$message({message: '註冊成功', type: 'info'})
        userInfo(userId).then(response => {
          console.log('user', response)
        })
        this.$router.push('/index')
      }).catch(error => {
        Vue.prototype.$message({message: '您已註冊', type: 'error'})
        console.log('error', error)
      })
    }
  }
}
</script>
<style scoped>

</style>

<template>
  <div>
    <v-snackbar v-model="visible" :timeout="duration" top :color="color">
      {{ message }}
      <v-btn color="blue" text @click="visible = false">
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>
<script>
const typeClass = {
  success: '#4caf50',
  error: '#ff5252',
  info: '#2196f3',
  default: 'info'
}
export default {
  name: 'messageMain',
  data () {
    return {
      visible: false,
      type: 'success',
      message: 'default',
      duration: 2000
    }
  },
  computed: {
    color () {
      return typeClass[this.type]
    }
  }
}
</script>

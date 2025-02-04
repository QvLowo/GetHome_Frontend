import Vue from 'vue'
import BlogMessage from './BlogMessage.vue'

const MessageBox = Vue.extend(BlogMessage)
let instance
let timer = null
const Message = function (options = {}) {
  if (Vue.prototype.$isServer) return
  if (timer) return
  if (typeof options === 'string') {
    options = {
      message: options
    }
  }
  instance = new MessageBox({
    data: options
  })
  instance.vm = instance.$mount()
  document.body.appendChild(instance.vm.$el)

  instance.vm.visible = true
  timer = setTimeout(() => {
    instance.vm.$destroy()
    instance.vm.$el.parentNode.removeChild(instance.vm.$el)
    timer = null
  }, instance.vm.duration)
  return instance.vm
}

export default {
  message: Message,
  install (Vue) {
    Vue.prototype.$message = Message
    Vue.message = Message
  }
}

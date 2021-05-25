import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VModal from 'vue-js-modal'
import VueRouter from "vue-router";



Vue.use(VModal)
Vue.use(VueRouter)

Vue.config.productionTip = false


new Vue({
  el: '#app',
  router,
  render: h => h(App)
}).$mount('#app')


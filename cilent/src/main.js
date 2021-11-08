import Vue from 'vue'
import App from './App.vue'
import vueRouter from 'vue-router'
const BASE = ''
Vue.use(vueRouter)


import Main from './components/Main.vue'
import {Form,Button,Input,FormItem,Table,TableColumn,Message,Progress,Upload} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(Form).use(Button).use(Input).use(FormItem).use(Table).use(TableColumn).use(Progress).use(Upload)
Vue.prototype.$message = Message;
const router = new vueRouter({
  routes:[
    {
      path:BASE + '/main',
      component:Main
    },
    // {
    //   path:BASE + '/login',
    //   component:Login
    // },
  //   {
  //     path:BASE + '/',
  //     redirect:'/login'
  //  } 
  ]
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')

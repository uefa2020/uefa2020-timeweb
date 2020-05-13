import Vue from 'vue'
//import moment from 'moment'
import Vuetify from 'vuetify/lib'
import '@fortawesome/fontawesome-free/css/all.css'

//Vue.prototype.$moment = moment;
Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'fa'
  }
});

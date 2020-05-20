import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
//import SocketIO from "socket.io-client"

export default function({store}) {
  Vue.use(new VueSocketIO ({
    debug: false,
    connection: 'http://192.168.1.64:3000',
    vuex: {
      store,
      actionPrefix: 'socket_',
      mutationPrefix: 'SOCKET_'
    }
  }));
}

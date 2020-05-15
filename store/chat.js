const layoutAdmin = {
  list: {
    width: '50%',
    class: 'mx-auto'
  },
  content: {
    class: 'text-left'
  }
};
const layoutLeft = {
  list: {
    width: '70%',
    class: 'mr-auto'
  },
  avatar: {
    class: 'order-first'
  },
  content: {
    class: 'text-left'
  }
};
const layoutRight = {
  list: {
    width: '70%',
    class: 'ml-auto'
  },
  avatar: {
    class: 'order-last'
  },
  content: {
    class: 'text-right'
  }
};

export const state = () => ({
  gamblers: [],
  messages: []
});

export const getters = {
  getGamblers: state => state.gamblers,
  getMessages: state => state.messages
};

export const mutations = {
  LOAD_GAMBLERS(state, payload) {
    state.gamblers = payload
  },
  ADD_GAMBLER(state, payload) {
    // На всякий случай, сначала удаляем
    state.gamblers = state.gamblers.filter(el => el.id !== payload.id);

    state.gamblers.push(payload);

    if (state.gamblers.length > 1) {
      state.gamblers.sort((a, b) => {
        const nickname1 = a.nickname.toUpperCase();
        const nickname2 = b.nickname.toUpperCase();

        let result = 0;

        if (nickname1 > nickname2) {
          result = 1;
        } else {
          result = -1;
        }

        return result;
      })
    }
  },
  DELETE_GAMBLER(state, payload) {
    state.gamblers = state.gamblers.filter(el => el.id !== payload);
  },
  DELETE_GAMBLER_BY_SOCKET(state, payload) {
    state.gamblers = state.gamblers.filter(el => payload.indexOf(el.socket_id) >= 0);
  },
  CLEAR_GAMBLERS(state) {
    state.gamblers = []
  },
  LOAD_MESSAGES(state, payload) {
    state.messages = payload.map((item, i, arr) => {
      if (item.fromId == 0) {
        item.layout = layoutAdmin
      } else if (i === 0 || arr[i - 1].fromId == 0) {
        item.layout = layoutLeft
      } else if (arr[i - 1].fromId == item.fromId) {
        item.layout = arr[i - 1].layout
      } else if (arr[i - 1].layout.list.class === 'mr-auto') {
        item.layout = layoutRight
      } else {
        item.layout = layoutLeft
      }

      return item
    })
  },
  ADD_MESSAGE(state, payload) {
    if (payload.fromId == 0) {
      payload.layout = layoutAdmin
    } else {
      const i = state.messages.length - 1;

      if (i < 0) {
        payload.layout = layoutLeft
      } else {
        const message = state.messages[i];

        if (payload.fromId == message.fromId) {
          payload.layout = message.layout
        } else if (message.layout.list.class === 'mr-auto') {
          payload.layout = layoutRight
        } else {
          payload.layout = layoutLeft
        }
      }
    }

    state.messages.push(payload)
  },
  UPDATE_MESSAGE(state, payload) {

  }
};

export const actions = {
  async loadGamblers({commit}) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/chat/loadGamblers');

      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: data.error
        }, {root: true});
      } else {
        await commit('LOAD_GAMBLERS', data)
      }
    } catch (e) {
      console.log('Error loadGamblers:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении loadGamblers (см. в консоли ошибку "Error loadGamblers")'
      }, {root: true});
    }
  },

  async loadMessages({commit}) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/chat/loadMessages');

      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: data.error
        }, {root: true});
      } else {
        await commit('LOAD_MESSAGES', data)
      }
    } catch (e) {
      console.log('Error loadMessages:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении loadMessages (см. в консоли ошибку "Error loadMessages")'
      }, {root: true});
    }
  },

  async saveMessage({commit}, payload) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/chat/saveMessage', {
        params: {
          from: payload.fromId,
          to: payload.to,
          message: payload.message
        }
      });

      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: data.error
        }, {root: true});
      }
    } catch (e) {
      console.log('Error saveMessage:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении saveMessage (см. в консоли ошибку "Error saveMessage")'
      }, {root: true});
    }
  },

  async updateMessage({commit}, payload) {
    /*try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/chat/updateMessage', {
        params: {
          from: payload.fromId,
          to: payload.to,
          message: payload.message
        }
      });

      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: data.error
        }, {root: true});
      }
    } catch (e) {
      console.log('Error saveMessage:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении saveMessage (см. в консоли ошибку "Error saveMessage")'
      }, {root: true});
    }*/
  }
}

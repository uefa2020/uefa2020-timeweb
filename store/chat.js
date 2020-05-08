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
  LOAD_MESSAGES(state, payload) {
    state.messages = payload
  },
  ADD_MESSAGE(state, payload) {
    if (payload.from === 0) payload.from = 'администратор';

    state.messages.push(payload)
  }
};

export const actions = {
  async loadGamblers({commit}) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/chat/loadGamblers');

      if (data.error) {
        console.log('loadGamblers:', data.error);
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
        console.log('loadMessages:', data.error);
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
};

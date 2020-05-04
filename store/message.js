export const state = () => ({
  messages: []
});

export const getters = {
 getMessages: state => state.messages
};

export const mutations = {
  LOAD_MESSAGES(state, payload) {
    state.messages = payload
  },
  ADD_MESSAGE(state, payload) {
    state.messages.push(payload)
  }
};

export const actions = {
  async loadMessages({commit}) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/message/loadAll');

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
};

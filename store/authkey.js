export const state = () => ({
  error: ''
});

export const getters = {
  getError: state => state.error
};

export const mutations = {
  CLEAR_ERROR(state) {
    state.error = ''
  },
  SET_ERROR(state, payload) {
    state.error = payload
  }
};

export const actions = {
  async checkKey({commit}, key) {
    try {
      await commit('CLEAR_ERROR');
      const data = await this.$axios.$get('/api/authkey/checkKey', {
        params: {
          key
        }
      });

      if (data.error) {
        await commit('SET_ERROR', data.error);
      }
    } catch (e) {
      /*console.log('Error checkKey:', e);
      await commit('common/CLEAR_MESSAGE', null, {root: true});
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении checkKey (см. в консоли ошибку "Error checkKey")'
      }, {root: true});*/
      commit('SET_ERROR', e.message);
    }
  },

  async resetKey({commit}, key) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/authkey/resetKey', {
        params: {
          key
        }
      });

      if (data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: data.error,
        }, {root: true});
      }
    } catch (e) {
      console.log('Error resetKey:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении resetKey (см. в консоли ошибку "Error resetKey")'
      }, {root: true});
    }
  }
};

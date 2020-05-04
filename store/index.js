export const actions = {
  async nuxtServerInit({dispatch, getters}) {
    await dispatch('gambler/autoLogin');
    await dispatch('gambler/loadGamblers');
  },
  /*async socket_changedGamblers({commit, dispatch}, payload) {
    console.log('payload:', payload);
    await dispatch('gambler/loadGamblers', null, {root: true});
    await commit('common/CLEAR_MESSAGE', null, {root: true});
    await commit('common/SET_MESSAGE', {
      status: 'success',
      text: payload
    }, {root: true});
  },*/

  /*async socket_addMessage({commit, dispatch}, payload) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/message/add', {
        params: {
          from: payload.from,
          to: payload.to,
          message: payload.message
        }
      });

      if(data.error) {
        await commit('common/SET_MESSAGE', {
          status: 'error',
          text: data.error
        }, {root: true});
      } else {
        await commit('message/ADD_MESSAGE', payload, {root: true})
      }
    } catch (e) {
      console.log('Error addMessage:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении addMessage (см. в консоли ошибку "Error addMessage")'
      }, {root: true});
    }
  },*/

  async socket_addMessage({commit}, payload) {
    await commit('message/ADD_MESSAGE', payload, {root: true})
  },

  async socket_messageToDB({commit}, payload) {
    try {
      await commit('common/CLEAR_MESSAGE', null, {root: true});

      const data = await this.$axios.$get('/api/message/add', {
        params: {
          from: payload.from,
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
      console.log('Error messageToDB:', e);
      await commit('common/SET_MESSAGE', {
        status: 'error',
        text: 'Ошибка при выполнении messageToDB (см. в консоли ошибку "Error messageToDB")'
      }, {root: true});
    }
  },

  async socket_setMessage({commit}, payload) {
    await commit('common/SET_MESSAGE', {
      status: payload.status,
      text: payload.text
    }, {root: true});
  },

  async socket_changeProfile({getters, commit, dispatch}, payload) {
    await dispatch('gambler/loadGamblers', null, {root: true});

    if (payload.nickname !== getters['gambler/getGambler'].nickname) {
      await commit('common/CLEAR_MESSAGE', null, {root: true});
      await commit('common/SET_MESSAGE', {
        status: 'success',
        text: `У игрока '${payload.nickname}' обновился профиль`
      }, {root: true})
    }
  }
};

export const actions = {
  async nuxtServerInit({dispatch, getters}) {
    await dispatch('gambler/autoLogin');
    await dispatch('gambler/loadGamblers');
  },

  async socket_sendMessage({commit}, payload) {
    await commit('chat/SEND_MESSAGE', payload, {root: true})
  },

  async socket_addToChat({commit}, payload) {
    await commit('chat/ADD_GAMBLER', payload, {root: true})
  },

  async socket_messageToDB({dispatch}, payload) {
    await dispatch('chat/saveMessage', payload, {root: true});
  },

  async socket_setMessage({commit}, payload) {
    await commit('common/CLEAR_MESSAGE', null, {root: true});
    await commit('common/SET_MESSAGE', {
      status: payload.status,
      text: payload.text
    }, {root: true});
  },

  async socket_changeProfile({getters, commit, dispatch}, payload) {
    await dispatch('gambler/loadGamblers', null, {root: true});

    const message = (
      payload.isSign
        ? `${payload.nickname} ${payload.sex === 'м' ? 'зарегистрировался' : 'зарегистрировалась'} в системе`
        : `У игрока '${payload.nickname}' обновился профиль`
    );

    if (payload.nickname !== getters['gambler/getGambler'].nickname) {
      await commit('common/CLEAR_MESSAGE', null, {root: true});
      await commit('common/SET_MESSAGE', {
        status: 'primary',
        text: message
      }, {root: true})
    }
  },

  async socket_logout({commit}, payload) {
    await commit('chat/DELETE_GAMBLER', payload.id, {root: true});
  },

  async socket_setSocketId({dispatch}, payload) {
    await dispatch('gambler/setSocketId', payload, {root: true})
  },

  async socket_update({commit, dispatch}, payload) {
    await dispatch('gambler/logout', payload.id, {root: true});
    await dispatch('gambler/disconnectGamblersBySocket', payload.sockets, {root: true});
    await commit('chat/DELETE_GAMBLER', payload.id, {root: true});
    await commit('chat/DELETE_GAMBLER_BY_SOCKET', payload.sockets, {root: true});
  }
};

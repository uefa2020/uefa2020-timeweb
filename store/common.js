export const state = () => ({
  message: null
});

export const getters = {
  getMessage: state => state.message,
  isMessage: state => !!state.message
};

export const mutations = {
  SET_MESSAGE(state, payload) {
    state.message = payload;
  },
  CLEAR_MESSAGE(state) {
    state.message = null
  }
};

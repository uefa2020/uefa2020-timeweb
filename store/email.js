export const actions = {
   async sendMail({commit}, email) {
     await commit('common/CLEAR_MESSAGE', null, {root: true});

     try {
       const data = await this.$axios.$get('/api/email/sendMail', {
         params: {
           email
         }
       });

       if (data.error) {
         await commit('common/SET_MESSAGE', {
           status: 'error',
           text: 'Ошибка при отправке почты: ' + data.error
         }, {root: true});
       } else {
         await commit('common/SET_MESSAGE', {
           status: 'success',
           text: data.success
         }, {root: true});
       }
     } catch (e) {
       console.log('Error sendMail:', e);
       await commit('common/SET_MESSAGE', {
         status: 'error',
         text: 'Ошибка при отправке почты (см. в консоли ошибку "Error sendMail")'
       }, {root: true});
     }
   }
};

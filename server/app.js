const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const authkeyRoutes = require('./routes/authkey.routes');
const gamblerRoutes = require('./routes/gambler.routes');
const emailRoutes = require('./routes/email.routes');
const messageRoutes = require('./routes/message.routes');
const imageRoutes = require('./routes/image.routes');

app.use('/api/authkey', authkeyRoutes);
app.use('/api/gambler', gamblerRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/image', imageRoutes);

io.on('connection', (socket) => {
  //console.log('a user connected');

  const room = 'uefa2020';

  socket.join(room); //Если будет несколько "комнат", то, наверное, правильнее подключаться к ней
                     //внутри прослушивания конкретного события

  /*socket.on('gamblerLogged', data => {
    //Подсоединяем сокет с идентификатором, равным номеру комнаты
    //socket.join(data.room);
    //В нашем приложении будет одна комната 'uefa2020'
    socket.join(room);
    //Отправить сообщение в указанную комнату (кроме текущего пользователя)
    socket.broadcast
    .to(room)
    .emit('addMessage', {
      from: 0,
      to: room,
      message: `${data.gambler.nickname} ${data.gambler.sex === 'м' ? 'подключился' : 'подключилась'}`
    });
  });*/

  socket.on('login', data => {
    const message = {
      from: 0,
      to: room,
      message: `${data.nickname} ${data.sex === 'м' ? 'вошёл' : 'вошла'} в приложение`
    };

    io.to(room).emit('addMessage', message);
    socket.emit('messageToDB', message);
    socket.broadcast.to(room).emit('setMessage', {status: 'primary', text: message.message})
  });

  socket.on('changeProfile', data => {
    io.emit('changeProfile', data);
  })
});

module.exports = {app, server};

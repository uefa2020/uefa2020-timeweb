const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const authkeyRoutes = require('./routes/authkey.routes');
const gamblerRoutes = require('./routes/gambler.routes');
const emailRoutes = require('./routes/email.routes');
const chatRoutes = require('./routes/chat.routes');
const imageRoutes = require('./routes/image.routes');

app.use('/api/authkey', authkeyRoutes);
app.use('/api/gambler', gamblerRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/image', imageRoutes);

io.on('connection', (socket) => {
  //console.log('a user connected');

  const room = 'uefa2020';

  socket.join(room); //Если будет несколько "комнат", то, наверное, правильнее подключаться к ней
                     //внутри прослушивания конкретного события

  socket.on('login', data => {
    const message = {
      from: 0,
      to: room,
      message: `${data.nickname} ${data.sex === 'м' ? 'вошёл' : 'вошла'} в приложение`
    };

    io.to(room).emit('addMessage', message);

    socket.emit('messageToDB', message);

    socket.broadcast.to(room).emit('addToChat', data);

    socket.broadcast.to(room).emit('setMessage', {status: 'primary', text: message.message})
  });

  socket.on('changeProfile', data => {
    socket.broadcast.to(room).emit('changeProfile', data);
  });

  socket.on('logout', data => {
    socket.broadcast.to(room).emit('logout', data);

    const message = {
      from: 0,
      to: room,
      message: `${data.nickname} ${data.sex === 'м' ? 'вышёл' : 'вышла'} из приложения`
    };

    io.to(room).emit('addMessage', message);
    socket.broadcast.to(room).emit('messageToDB', message);
    socket.broadcast.to(room).emit('setMessage', {status: 'primary', text: message.message});
  });

  /*socket.on('disconnect', () => {
    socket.emit('disconnect', 1);

    const message = {
      from: 0,
      to: room,
      message: 'MU ушёл'
    };

    io.to(room).emit('addMessage', message);
    io.to(room).emit('messageToDB', message);
    io.to(room).emit('setMessage', {status: 'primary', text: message.message});
  })*/
});

module.exports = {app, server};

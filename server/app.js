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
  let gamblerId = 0;
  let socketId = socket.id;

  socket.join(room); //Если будет несколько "комнат", то, наверное, правильнее подключаться к ней
                     //внутри прослушивания конкретного события

  socket.on('login', data => {
    gamblerId = data.id;
    data.socket_id = socketId;

    socket.emit('setSocketId', data);

    socket.broadcast.emit('addToChat', data);

    const message = {
      from: 0,
      photo: '',
      to: room,
      message: `${data.nickname} ${data.sex === 'м' ? 'вошёл' : 'вошла'} в приложение`
    };

    socket.emit('messageToDB', message);

    socket.broadcast.emit('sendMessage', message);

    socket.broadcast.emit('setMessage', {status: 'primary', text: message.message})
  });

  /*socket.on('reload', data => {
    console.log('socket-reload');
    data.socket_id = socketId;

    socket.emit('setSocketId', data);

    socket.broadcast.emit('addToChat', data);
  });*/

  /*socket.on('chat', data => {
    gamblerId = data.id;
    data.socket_id = socketId;

    socket.emit('setSocketId', data);

    io.to(room).emit('addToChat', data);
  });*/

  socket.on('changeProfile', data => {
    socket.broadcast.emit('changeProfile', data);
  });

  socket.on('logout', data => {
    io.to(room).emit('logout', data);

    const message = {
      from: 0,
      to: room,
      message: `${data.nickname} ${data.sex === 'м' ? 'вышёл' : 'вышла'} из приложения`
    };

    socket.emit('messageToDB', message);
    socket.broadcast.emit('sendMessage', message);
    socket.broadcast.emit('setMessage', {status: 'primary', text: message.message});
  });

  socket.on('disconnect', (reason) => {
    io.of('/').clients((error, clients) => {
      if (error) throw error;

      if (clients.length > 0) { //иначе ничего сделать нельзя, так как некому "прослушать" данное событие (никого нет в комнате)
        socket.broadcast.emit('update', {sockets: clients, id: gamblerId})
      }
    });
  })
});

module.exports = {app, server};

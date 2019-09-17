const express = require('express');
const connectDB = require('./config/db');
const io = require('socket.io')();

const app = express();

// Connect to database
connectDB();

// Todo: More secruity for socket connections
io.on('connection', socket => {
  socket.on('subscribe', room => {
    socket.join(room);
  });

  socket.on('update code', data => {
    socket.broadcast.to(data.room).emit('receive update', {
      code: data.code
    });
  });
});

// Init Middleware
app.use(express.json({ extended: false }));

app.use('/api/codeRunner', require('./routes/api/codeRunner'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/files', require('./routes/api/files'));

const PORT = process.env.PORT || 5000;
const SOCKET_PORT = 8000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
io.listen(SOCKET_PORT);

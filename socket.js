var app = require("express")();
var http = require("http").createServer(app);
var io = require('socket.io')(http);
var port = 3000;

app.get('/', (req, res) => res.sendFile(__dirname + '/client_side.html'));

http.listen(port, () => {
  console.log("listening on *:" + port);
});

//client가 연결되었을 경우
io.on('connection', function (socket) {
  console.log(socket.id, 'Connected');
  console.log("socket.emit 할게요, 이벤트 이름은 msg");
  //msg라는 이벤트를 호출, 패러미터로 문자열 data를 보냄

  socket.emit('msg', `${socket.id} 연결 되었습니다.`);

  //msg 이벤트를 받을 경우
  socket.on('msg', function (data) {
    console.log("msg 이벤트 받았습니다")
    console.log(socket.id, data);
    console.log("socket.emit 한번 더 할게요");
    socket.emit('msg', `Server : "${data}" 받았습니다.`);
  });

  socket.emit('msg', `${socket.id} 연결 되었습니다.`);
  socket.emit('msg', `${socket.id} 연결 되었습니다.`);

});

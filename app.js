var express = require('express');
var app = express();
var path = require('path');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var rpio = require('rpio');

app.use(express.static(path.join(__dirname, '/public')));

// declaracao dos GPIOs motor A
const M1A = 31
const M1B = 15
const M1EN = 11

// declaracao dos GPIOs motor B
const M2A = 18
const M2B = 13
const M2EN = 29

// configuracao dos GPIOs como saida
rpio.open(M1A, rpio.OUTPUT, rpio.LOW);
rpio.open(M1B, rpio.OUTPUT, rpio.LOW);
rpio.open(M1EN, rpio.OUTPUT, rpio.LOW);
rpio.open(M2A, rpio.OUTPUT, rpio.LOW);
rpio.open(M2B, rpio.OUTPUT, rpio.LOW);
rpio.open(M2EN, rpio.OUTPUT, rpio.LOW);

// declaracao das funcoes de movimentacao frente, tras, esquerda, direita
function goForward() {
 rpio.write(M1A, rpio.LOW);
 rpio.write(M1B, rpio.HIGH);
 rpio.write(M2A, rpio.HIGH);
 rpio.write(M2B, rpio.LOW);
}
function goBackward() {
 rpio.write(M1A, rpio.HIGH);
 rpio.write(M1B, rpio.LOW);
 rpio.write(M2A, rpio.LOW);
 rpio.write(M2B, rpio.HIGH);
}
function goLeft() {
 rpio.write(M1A, rpio.HIGH);
 rpio.write(M1B, rpio.LOW);
 rpio.write(M2A, rpio.HIGH);
 rpio.write(M2B, rpio.LOW);
}
function goRight() {
 rpio.write(M1A, rpio.LOW);
 rpio.write(M1B, rpio.HIGH);
 rpio.write(M2A, rpio.LOW);
 rpio.write(M2B, rpio.HIGH);  
}
function enableMotors() {
 rpio.write(M1EN, rpio.HIGH);
 rpio.write(M2EN, rpio.HIGH);
}
function disableMotors() {
 rpio.write(M1EN, rpio.LOW);
 rpio.write(M2EN, rpio.LOW);
}

io.on('connection', function(socket){
 console.log('a user connected');
 socket.on('disconnect', function(){
   console.log('user disconnected');
   disableMotors();
 });
 socket.on('joystickData', function(joystickData){
   //console.log(joystickData);
   enableMotors();
   if(joystickData == 'up') goForward();
   if(joystickData == 'down') goBackward();
   if(joystickData == 'left') goLeft();
   if(joystickData == 'right') goRight();
 });
 socket.on('joystickReleased', function(){
   //console.log('Stop');
   disableMotors();
 });
});

server.listen(3000, '192.168.0.1', function () {
 var port = server.address().port
 console.log('Server listening:%s...', port);
});

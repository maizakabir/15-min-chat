var http = require ('http');
var express = require ('express');
var app = express();
var server = http.Server(app);
var bodyParser = require('body-parser');
var io = require ('socket.io')(server);
var mongoose= require ("mongoose");
var users = [];
var connections = [];

//middleware for body-parser
app.use (bodyParser.json());
app.use (bodyParser.urlencoded ({extended: true}));

//mongoDB
// var db;
var db_url= "mongodb://" + process.env.IP + ":27017";
mongoose.connect (db_url + '/user', {useNewUrlParser: true});
// mongoose.connection.once ('open', function (){
//   console.log( "mongoose connected to mongoDB");
// });
mongoose.connection.on ('error', function (){
  console.log ('could not connect to mongoDB');
});


// //connecting mongoose to mongoDB
// mongoose.connect(db_url + "user");
// mongoose.connection.on('error', function(){
//   console.log ("Could not connect to MongoDB");
// });

app.get('/home', function (req, res){
  res.render ('home.ejs');
});

app.get ('/index', function (req, res){
  res.render ('index.ejs');
});

require('./routes/user-routes.js')(app);

io.sockets.on ('connection', function (socket){
  connections.push (socket);
  console.log ('Connected: %s sockets connected', connections.length);

  //Disconnect
  socket.on ('disconnect', function (data){
    users.splice (users.indexOf (socket.username), 1);
    updateUsernames();
    connections.splice (connections.indexOf (socket), 1);
    console.log ('Disconnected: %s sockets connected', connections.length);
  });

  //Send Message
  socket.on ('send message', function (data){
    io.sockets.emit ('new message', {msg:data, user:socket.username});
  });

  //New user
  socket.on ('new user', function (data, callback){
    callback(true);
    socket.username= data;
    users.push (socket.username);
    updateUsernames();
  });

  function updateUsernames(){
    io.sockets.emit ('get users', users);
  };

});

server.listen (process.env.PORT || process.env.IP  || 'localhost', function (){
    console.log ('Server running');
});

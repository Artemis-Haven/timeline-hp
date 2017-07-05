import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import * as path from 'path';
import * as http from 'http';
import * as socket from 'socket.io';

import setRoutes from './routes';
import Game from './models/game';

const app = express();
dotenv.load({ path: '.env' });
app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('dev'));
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
(<any>mongoose).Promise = global.Promise;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');

  setRoutes(app);

  app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  app.listen(app.get('port'), () => {
    console.log('Angular Full Stack listening on port ' + app.get('port'));
  });

});

let socketServer = http.createServer(app);
let io = socket(socketServer);
global['io'] = io;
socketServer.listen(8090, "localhost");
io.on('connection', function (socket) {

  //socket.broadcast.emit('notification', {level: 'info', message:'Welcome!'});
  //socket.emit('notification', {level: 'info', message:'Welcome!'});

  socket.on('initSocket',function(data){
  	Game.find({users: { "$in" : [data.id]}}, (err, games) => {
  	  if (err) { return console.error(err); }
	  for (var i = 0; i < games.length; i++) {
	    socket.join('game '+games[i]._id);
	  }
  	});
  });

  socket.on('joinedGame',function(data){
  	io.to('game '+data.id).emit('notification', {level: 'info', message:'A new player joined game!'});
    socket.join('game '+data.id);
  	console.log("Socket joined game "+data.id);
  });

  socket.on('leavedGame',function(data){
    socket.leave('game '+data.id);
  	io.to('game '+data.id).emit('notification', {level: 'info', message:'A player leaved game!'});
  });

  socket.on('updatedGame',function(data){
    socket.leave('game '+data.id);
  	io.to('game '+data.id).emit('notification', {level: 'info', message:data.message});
  });
});

export { app };

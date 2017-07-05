import Game from '../models/game';
import BaseCtrl from './base';

export default class GameCtrl extends BaseCtrl {
  model = Game;

  insert = (req, res) => {
    console.log("Création d'une nouvelle partie...");
    const obj = new this.model(req.body.game);
    console.log(Object.keys(req.body.game));
    obj.users.push(req.body.user);
    obj.save((err, item) => {
      // 11000 is the code for duplicate key error
      if (err && err.code === 11000) {
        res.sendStatus(400);
      }
      if (err) {
        return console.error(err);
      }
      console.log("Nouvelle partie '+this.model.name+' créée !");
      global['io'].emit('games-updated', { msg: 'Welcome bro!' });
      global['io'].emit('message', { message: 'Welcome bro!', label: 'info' });
      res.status(200).json(item);
    });
  };

  // join game
  join = (req, res) => {
  	this.model.findOne({ _id: req.params.game_id }, (err, game) => {
      if (err) { return console.error(err); }
  	  game.users.push(req.params.user_id);
      game.save((err, game) => {
        if (err) { return console.error(err); }
        global['io'].emit('games-updated', { msg: 'Welcome bro!' });
        res.status(200).json(game);
      });
    });
  };

  // quit game
  quit = (req, res) => {
    this.model.findOne({ _id: req.params.game_id }, (err, game) => {
      if (err) { return console.error(err); }
      console.log(req.params.user_id);
      console.log(game.users.map(user => user._id.toString());
      console.log(game.users.map(user => user._id.toString()).indexOf(req.params.user_id));
      game.users.splice(game.users.map(user => user._id.toString()).indexOf(req.params.user_id), 1);
      game.save((err, game) => {
        if (err) { return console.error(err); }
        global['io'].emit('games-updated', { msg: 'Welcome bro!' });
        res.status(200).json(game);
      });
    });
  };

  // Update by id
  update = (req, res) => {
    delete req.body._id;
    this.model.findOneAndUpdate({ _id: req.params.id }, req.body, (err) => {
      if (err) { return console.error(err); }
      global['io'].emit('games-updated', { msg: 'Welcome bro!' });
      //global['io'].emit('game-updated-'+req.params.id, { msg: 'Welcome bro!' });
      res.sendStatus(200);
    });
  };

  // Delete by id
  delete = (req, res) => {
    this.model.findOneAndRemove({ _id: req.params.id }, (err) => {
      if (err) { return console.error(err); }
      global['io'].emit('games-updated', { msg: 'Welcome bro!' });
      res.sendStatus(200);
    });
  };
}

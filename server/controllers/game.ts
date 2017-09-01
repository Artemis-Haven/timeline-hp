import Game from '../models/game';
import Card from '../models/card';
import User from '../models/user';
import BaseCtrl from './base';

export default class GameCtrl extends BaseCtrl {
  model = Game;

  insert = (req, res) => {
    console.log("Création d'une nouvelle partie...");
    const game = new Game(req.body.game);
    console.log(Object.keys(req.body.game));
    game.users.push(req.body.user);
    game.save((err, item) => {
      // 11000 is the code for duplicate key error
      if (err && err.code === 11000) {
        res.sendStatus(400);
      }
      if (err) {
        return console.error(err);
      }
    });
    console.log("Nouvelle partie '+this.model.name+' créée !");
    global['io'].emit('games-updated', { msg: 'Welcome bro!' });
    global['io'].emit('message', { message: 'Welcome bro!', label: 'info' });
    res.status(200).json(game);
    var deckCards = [
      new Card({name: "Name1", displayedDate: "2017", startDate: '2017-01-01', endDate: '2017-01-01', game: game}),
      new Card({name: "Name2", displayedDate: "2016", startDate: '2017-01-01', endDate: '2017-01-01', game: game}),
      new Card({name: "Name3", displayedDate: "2015", startDate: '2017-01-01', endDate: '2017-01-01', game: game}),
      new Card({name: "Name4", displayedDate: "2014", startDate: '2017-01-01', endDate: '2017-01-01', game: game}),
      new Card({name: "Name5", displayedDate: "2013", startDate: '2017-01-01', endDate: '2017-01-01', game: game}),
      new Card({name: "Name6", displayedDate: "2012", startDate: '2017-01-01', endDate: '2017-01-01', game: game}),
    ];
    for (var i = 0; i < deckCards.length; i++) {
      game.deckCards.push(deckCards[i]);
      deckCards[i].save((err, item) => { return console.error(err); });
    }
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
      console.log(game.users.map(user => user._id.toString()));
      console.log(game.users.map(user => user._id.toString()).indexOf(req.params.user_id));
      game.users.splice(game.users.map(user => user._id.toString()).indexOf(req.params.user_id), 1);
      game.save((err, game) => {
        if (err) { return console.error(err); }
        global['io'].emit('games-updated', { msg: 'Welcome bro!' });
        res.status(200).json(game);
      });
    });
  };

  start = (req, res) => {
    this.model.findOne({ _id: req.params.game_id }, (err, game) => {
      if (err) { return console.error(err); }
      game.started = true;
      var card = game.deckCards[0];
      game.deckCards.pull(card._id);
      game.boardCards.push(card._id);
      card.save((err, card) => {if (err) {return console.error(err);} });
      game.save((err, game) => {
        if (err) {return console.error(err);}
        global['io'].emit('game-updated-'+game._id, { game: game }); 
        res.status(200).json(game);
      });
    });
  };

  drawCard = (req, res) => {
    this.model.findOne({ _id: req.params.game_id }, (err, game) => {
      if (err) { return console.error(err); }
      var card = game.deckCards[0];
      game.deckCards.pull(card._id);
      game.handCards.push(card._id);
      card.user = req.params.user_id;
      card.save((err, card) => {if (err) {return console.error(err);} });
      game.save((err, game) => {
        if (err) {return console.error(err);}
        global['io'].emit('games-updated', { msg: 'Welcome bro!' }); 
        global['io'].emit('game-updated-'+game._id, { game: game }); 
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

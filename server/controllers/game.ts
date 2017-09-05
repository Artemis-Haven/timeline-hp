import Game from '../models/game';
import Card from '../models/card';
import User from '../models/user';
import Reference from '../models/reference';
import BaseCtrl from './base';

export default class GameCtrl extends BaseCtrl {
  model = Game;

  private shuffleCards(cardsArray) {
    cardsArray = cardsArray.sort((c1, c2) => (Math.random() >= 0.5))
    cardsArray = cardsArray.sort((c1, c2) => (Math.random() >= 0.5))
    return cardsArray
  }

  private nextTurn(game) {
    if (game.turn == null)
      game.turn = game.users[0]
    else
      for (var i = 0; i < game.users.length; i++) {
        if (JSON.stringify(game.turn) == JSON.stringify(game.users[i])) {
          game.turn = game.users[(i+1)%game.users.length]
          break
        }
      }
  }

  insert = (req, res) => {
    console.log("Création d'une nouvelle partie...");
    const game = new Game(req.body.game);
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
    Reference.find({}, (err, references) => {
      if (err) { return console.error(err); }
      references = this.shuffleCards(references);
      for (var i = 0; i < references.length; i++) {
        var card = new Card({
          'name': references[i].name, 
          'displayedDate': references[i].displayedDate, 
          'startDate': references[i].startDate, 
          'endDate': references[i].endDate, 
          'game': game
        });
        game.deckCards.push(card);
        card.save((err, item) => { if (err) return console.error(err); });
      }
      game.save((err, item) => { if (err) return console.error(err); });
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
      this.nextTurn(game);
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

  playCard = (req, res) => {
    this.model.findOne({ _id: req.params.game_id }, (err, game) => {
      if (err) { return console.error(err); }
      
      var card = game.handCards.filter( (c) => c._id == req.body.cardId)[0]
      var previousCard, nextCard = null
      var failure = false
      previousCard = game.boardCards.filter( (c) => c._id == req.body.previousCardId)[0]
      nextCard = game.boardCards.filter( (c) => c._id == req.body.nextCardId)[0]
      if (previousCard != null && previousCard.startDate > card.endDate)
        failure = true;
      if (nextCard != null && nextCard.endDate < card.startDate)
        failure = true;

      game.handCards.pull(card._id)
      card.user = null
      game.boardCards.push(card._id)

      if (!failure) 
        this.nextTurn(game)
      
      card.save((err, card) => {if (err) {return console.error(err);} });
      game.save((err, game) => {
        if (err) {return console.error(err);}
        global['io'].emit('game-updated-'+game._id, { game: game, type:'cardPlayed', success: !failure }); 
        res.status(200).send({success: !failure, displayedDate: card.displayedDate, startDate: card.startDate, endDate: card.endDate});
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

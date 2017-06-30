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
      res.status(200).json(item);
    });
  };

  // join game
  join = (req, res) => {
	  console.log(JSON.stringify(req.body));
  	this.model.findOne({ _id: req.params.id }, (err, game) => {
      if (err) { return console.error(err); }

	  console.log(Object.keys(req.body));
	  console.log(JSON.stringify(req.body));
	  console.log(JSON.stringify(game));
	  game.users.push(req.body._id);
	  /*this.model.findOneAndUpdate({ _id: req.params.id }, game, (err) => {
	    if (err) { return console.error(err); }
	    res.sendStatus(200);
	  });*/
    });
  };

  // quit game
  quit = (req, res) => {
	  console.log(JSON.stringify(req.body));
  	this.model.findOne({ _id: req.params.id }, (err, game) => {
      if (err) { return console.error(err); }

	  console.log(Object.keys(req.body));
	  console.log(JSON.stringify(req.body));
	  console.log(JSON.stringify(game));
	  game.users.pop(req.body._id);
    });
  };
}

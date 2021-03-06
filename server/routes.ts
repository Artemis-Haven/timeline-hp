import * as express from 'express';

import ReferenceCtrl from './controllers/reference';
import GameCtrl from './controllers/game';
import CardCtrl from './controllers/card';
import UserCtrl from './controllers/user';
import Reference from './models/reference';
import Game from './models/game';
import Card from './models/card';
import User from './models/user';

export default function setRoutes(app) {

  const router = express.Router();

  const referenceCtrl = new ReferenceCtrl();
  const gameCtrl = new GameCtrl();
  const cardCtrl = new CardCtrl();
  const userCtrl = new UserCtrl();

  // Reference
  router.route('/references').get(referenceCtrl.getAll);
  router.route('/references/count').get(referenceCtrl.count);
  router.route('/reference').post(referenceCtrl.insert);
  router.route('/reference/:id').get(referenceCtrl.get);
  router.route('/reference/:id').put(referenceCtrl.update);
  router.route('/reference/:id').delete(referenceCtrl.delete);

  // Games
  router.route('/games').get(gameCtrl.getAll);
  router.route('/games/count').get(gameCtrl.count);
  router.route('/game').post(gameCtrl.insert);
  router.route('/game/:id').get(gameCtrl.get);
  router.route('/game/join/:game_id/:user_id').put(gameCtrl.join);
  router.route('/game/quit/:game_id/:user_id').put(gameCtrl.quit);
  router.route('/game/draw/:game_id/:user_id').put(gameCtrl.drawCard);
  router.route('/game/play/:game_id').put(gameCtrl.playCard);
  router.route('/game/start/:game_id').put(gameCtrl.start);
  router.route('/game/:id').put(gameCtrl.update);
  router.route('/game/:id').delete(gameCtrl.delete);

  // Cards
  router.route('/cards').get(cardCtrl.getAll);
  router.route('/cards/count').get(cardCtrl.count);
  router.route('/card').post(cardCtrl.insert);
  router.route('/card/:id').get(cardCtrl.get);
  router.route('/card/:id').put(cardCtrl.update);
  router.route('/card/:id').delete(cardCtrl.delete);

  // Users
  router.route('/login').post(userCtrl.login);
  router.route('/users').get(userCtrl.getAll);
  router.route('/users/count').get(userCtrl.count);
  router.route('/user').post(userCtrl.insert);
  router.route('/user/:id').get(userCtrl.get);
  router.route('/user/:id').put(userCtrl.update);
  router.route('/user/:id').delete(userCtrl.delete);

  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

}

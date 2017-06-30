import * as express from 'express';

import CatCtrl from './controllers/cat';
import GameCtrl from './controllers/game';
import UserCtrl from './controllers/user';
import Cat from './models/cat';
import Game from './models/game';
import User from './models/user';

export default function setRoutes(app) {

  const router = express.Router();

  const catCtrl = new CatCtrl();
  const gameCtrl = new GameCtrl();
  const userCtrl = new UserCtrl();

  // Cats
  router.route('/cats').get(catCtrl.getAll);
  router.route('/cats/count').get(catCtrl.count);
  router.route('/cat').post(catCtrl.insert);
  router.route('/cat/:id').get(catCtrl.get);
  router.route('/cat/:id').put(catCtrl.update);
  router.route('/cat/:id').delete(catCtrl.delete);

  // Games
  router.route('/games').get(gameCtrl.getAll);
  router.route('/games/count').get(gameCtrl.count);
  router.route('/game').post(gameCtrl.insert);
  router.route('/game/:id').get(gameCtrl.get);
  router.route('/game/join/:id').put(gameCtrl.join);
  router.route('/game/quit/:id').put(gameCtrl.quit);
  router.route('/game/:id').put(gameCtrl.update);
  router.route('/game/:id').delete(gameCtrl.delete);

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

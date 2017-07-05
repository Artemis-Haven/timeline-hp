import * as mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  name: {
  	type: String,
  	require: true,
    default: 'Nouvelle partie'
  },
  createdAt: {
    type: Date,
    require: true
  },
  started: {
    type: Boolean,
    require: true,
    default: false
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  cards: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card'
  }]
});

gameSchema.pre('save', function(next) {
  this.createdAt = new Date();
  next();
});

gameSchema.pre('update', function(next) {
  next();
});

const Game = mongoose.model('Game', gameSchema);

export default Game;

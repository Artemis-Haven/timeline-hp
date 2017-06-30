import * as mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  name: {
  	type: String,
  	require: true
  },
  displayedDate: {
  	type: Date,
  	require: true
  },
  startDate: {
  	type: Date,
  	require: true
  },
  endDate: {
  	type: Date,
  	require: true
  },
  user: {
    type: Number,
    ref: 'User'
  },
  game: {
    type: Number,
	ref: 'Game'
  }
});

const Card = mongoose.model('Card', cardSchema);

export default Card;

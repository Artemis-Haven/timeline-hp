import * as mongoose from 'mongoose';

const referenceSchema = new mongoose.Schema({
  name: {
  	type: String,
  	require: true
  },
  displayedDate: {
  	type: String,
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
});

const Reference = mongoose.model('Reference', referenceSchema);

export default Reference;

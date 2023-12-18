const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');
mongoose.set('strictQuery', true);

const URI =
  'mongodb+srv://andresmiranda:messirvemongo@cluster0.z9z9uy5.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const connections = mongoose.connection;

connections.once('open', () => {
  console.log('db is ok');
});

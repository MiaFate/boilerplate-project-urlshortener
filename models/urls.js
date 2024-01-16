const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  }
})

//let Url = mongoose.model('Url', urlSchema);
module.exports = mongoose.model('Url', urlSchema);

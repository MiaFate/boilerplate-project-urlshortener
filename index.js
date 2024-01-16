require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors');
const app = express();
const dns = require("node:dns")

// Basic Configuration
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
const port = process.env.PORT || 3000;

//bd Configuration
mongoose.connect(process.env.MONGO_URI)

const Url = require("./models/urls.js")
// const createAndSaveUrl = (done) => {
//   let newUrl = new Url({ url })
// }
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(_, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(_, res) {
  res.json({ greeting: 'hello API' });
});
app.get('/api/shorturl/:shorturl', async function(req, res) {
  const { shorturl } = req.params
  const doc = await Url.findById({ _id: shorturl })
  res.redirect(doc.url)
})

app.post('/api/:shorturl', async function(req, res) {
  try {
    const { url } = req.body;
    const lookupResponse = dns.lookup(url, function lookup(err, _, _) {
      if (err) {
        return false
      }
      return true
    })
    if (lookupResponse === true) {
      let newUrl = new Url({ url })
      const doc = await newUrl.save()
      res.json({ original_url: url, short_url: doc._id })
    } else {
      res.json({ error: "invalid url" })
    }
  } catch (error) {
    res.json({ error })
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

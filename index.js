require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors');
const app = express();
const dns = require("node:dns")

// Basic Configuration
const urlParser = require('url');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
const port = process.env.PORT || 3000;

//bd Configuration
mongoose.connect(process.env.MONGO_URI)

const Url = require("./models/urls.js");
const { log } = require('node:console');
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(_, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  const { url } = req.body
  dns.lookup(urlParser.parse(url).hostname, async (err, address) => {
    if (!address) {
      res.status(200).json({ error: "invalid url" })
    } else {
      let newUrl = new Url({ url })
      const doc = await newUrl.save()
      res.json({ original_url: url, short_url: doc._id })
    }
  })
});
app.get('/api/shorturl/:shorturl', async function(req, res) {
  try {
    const { shorturl } = req.params
    console.log(shorturl)
    const doc = await Url.findById({ _id: shorturl })
    res.redirect(doc.url)
  } catch (error) {
    res.status(400).json({ error: "no short url" })
  }
})

// app.post('/api/:shorturl', async function(req, res) {
//   try {
//     const { url } = req.body;

//     const hostname = new URL(url).hostname;
//     if (hostname.origin === "null") {
//       res.status(200).json({ error: "invalid url" })
//     } else {
//       const isUrlValid = dns.lookup(hostname, (err, addr) => {
//         if (err || !addr) {
//           return false
//         }
//         return true
//       })
//       if (isUrlValid) {
//         let newUrl = new Url({ url })
//         const doc = await newUrl.save()
//         res.json({ original_url: url, short_url: doc._id })
//       } else {
//         res.status(200).json({ error: "invalid url" })
//       }
//     }
//   } catch (error) {
//     res.status(200).json({ error: "invalid url" })
//   }
// })

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

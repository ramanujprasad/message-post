const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const mongoose = require('mongoose');

const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
const app = express();

mongoose.connect("mongodb+srv://ramanuj:"+ process.env.MONGO_ATLAS_PW +"@cluster0-hgkmb.mongodb.net/node-angular?retryWrites=true&w=majority", { useNewUrlParser: true })
.then(()=> {
  console.log('Connected Successfully!');
})
.catch((error)=> {
  console.log(error);
  console.log('Connection failed!');
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
  next();
})

app.use(postRoutes);
app.use(userRoutes);

module.exports = app;

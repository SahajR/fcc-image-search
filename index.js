var express = require('express');
var app = express(), port = process.env.PORT || 8080;
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
var search = require('./image_al');

app.get("/", function(req, res){
  res.redirect('/api/imagesearch/cats');
});

app.get("/api/imagesearch/:term", function(req, res){
  var size = req.query.offset || 10;
  search.getImages(req.params.term, size, function(err, result){
    if(err) {
     res.send(err);
     return;
    }
    if(result.length == 0) result = "No results! Try with another query!";
    res.setHeader('Content-Type', 'application/json');
    res.send(result);
  });
});

app.get("/imagesearch/latest", function(req, res){
  search.getHistory(function(err, result){
    if(err) {
      res.send(err);
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(result);
  });
});

app.listen(port, function () {
  console.log('App listening on port ' + port + '!');
});

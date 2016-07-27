var imageAl = {};
var key = process.env.API_KEY;
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var dburl = process.env.MONGOLAB_API;  
var bing = require('bing.search');
var search = new bing(key);

imageAl.saveQuery = function(query, callback) {
    MongoClient.connect(dburl, function (err, db) {
    if (err) {
     console.log('Unable to connect to the mongoDB server. Error:', err);
     callback(err);
    } else {
        db.collection("search-history").insertOne({
            term: query,
            when: new Date().toLocaleString()
        });
      }
    });
}

imageAl.getHistory = function(callback) {
    MongoClient.connect(dburl, function (err, db) {
    if (err) {
     console.log('Unable to connect to the mongoDB server. Error:', err);
     callback(err);
    } else {
        /*db.collection("search-history").find({},{},{limit: 10}, 
        function(err, result){
            if (err) {
                callback(err);
                db.close();
                return;
            } else {
                console.log(result.toArray());
                if(result.toArray().length < 1) {
                    callback(null, "No history, yet!");
                    db.close();
                    return;
                }
                callback(null, result.toArray());
                db.close();
                return;
            }
        });*/
        db.collection('search-history').find({},{_id: 0},{limit: 10}).toArray().then(function(docs) {
            callback(null, docs);
            return;
        });
      }
    });
}

imageAl.getImages = function(query, size, callback) {
    search.images(query,
      {top: size},
      function(err, results) {
          if(err) {
            callback(err);
            return;
          }
        callback(null, results.map(transform));
        imageAl.saveQuery(query, function(err){
           if(err) {
               // Unable to save
           } 
        });
      }
    );
}

function transform(item) {
      return {
      "url": item.url,
      "snippet": shorten(item.title),
      "thumbnail": item.thumbnail.url,
      "context": item.sourceUrl
    };
}

function shorten(desc) {
    return desc.length > 25 ? desc.substr(0, 25) + '...' : desc;
}

module.exports = imageAl;
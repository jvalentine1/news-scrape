//dependencies
var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var path = require("path");

// models and port
var db = require("./models");
var PORT = 3000;

// Initialize Express
var app = express();

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

//HTML Routes

//Home page rout
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
  });

// saved articles route
app.get("/saved-articles", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/articles.html"));
  });

//API Routes

//Route that scrapes USA today
app.get("/scrape", function(req, res) {
    
    axios.get("https://www.usatoday.com/search/?q=articles").then(function(response) {
        var $ = cheerio.load(response.data);

    $("div.gnt_se_tw").each(function(i, element) {
    
        var result = {};
        if (i < 5) {

            var title = $(element).children("div").text();
            var summary = $(element).children("div").attr("data-c-desc");
            var link = $(element).parent("a").attr("href");

            result.title = title;
            result.summary = summary
            result.link = link;

            db.Article.create(result).then(function(dbArticle) {
                console.log(dbArticle);
            }).catch(function(err) {
                console.log(err);
            });
        
        } 
    });
        res.send("News Scrape Complete");
    });
});

//Route that retrieves articles from mongoDB
app.get("/news", function(req, res) {

    db.Article.find({})
    .then(function(dbArticle) {

      res.json(dbArticle);
    })
    .catch(function(err) {

        res.json(err);
    });
});

//Route that posts a user comment and stores it with the id of the corresponding news article
app.post("/news/:id", function(req, res) {

    db.Note.create(req.body)
    .then(function(dbNote) {

      return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {

        res.json(dbArticle);
    })
    .catch(function(err) {

        res.json(err);
    });

});

//Route that Grabs only the articles that the user has commented on
app.get("/mynews", function(req, res) {
    db.Article.find({})
    .populate("comment")
    .then(function(dbArticle) {

        res.json(dbArticle);
    })
    .catch(function(err) {

        res.json(err);
    });
});

//deletes an article selected by the user
app.delete("/delete/:id", function(req, res) {
    db.Article.remove({_id: req.params.id})
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

//Port Listener
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });


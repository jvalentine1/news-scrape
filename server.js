//dependencies
var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

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

//API Routes

//Route that scrapes USA today
app.get("/scrape", function(req, res) {
    console.log("SCRAPE TEST");
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

//Port Listener
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });


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
app.get("/scrape", function(req, res) {
    console.log("SCRAPE TEST");
    axios.get("https://www.usatoday.com/search/?q=articles").then(function(response) {
        var $ = cheerio.load(response.data);
    // For each element with a "title" class
    $("div.gnt_se_hl").each(function(i, element) {
        if (i < 5) {
        var title = $(element).text();
        var summary = $(element).attr("data-c-desc");
        console.log(i);
        console.log("\n");
        console.log(title);
        console.log("\n");
        console.log(summary);
        } 
    });
    $("a.gnt_se_a").each(function(i, element) {
        if (i < 5) {
        var link = $(element).attr("href");
        console.log("\n");
        console.log(link);
        } 
    });
    });
});

//Port Listener
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });


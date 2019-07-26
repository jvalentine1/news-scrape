# news-scrape

## About news-scrape

The News Scrape website is an application that scrapes news article content from the web and displays it to the user. The user is also given the option to comment on articles of interest. All items are stored to MongoDb until deleted by the user. 

## Why news-scrape?

This application provides an environment for page visitors to not only recieve the latest news, but also to comment on articles. This provides an space for user's to share thoughts on some of the worlds most relevent topics. 

## How It Works!

Upon load of the page, if the user has saved articles they will render in the content center. If the user has not previously scraped any articles, they will be given a button option to find news from the web

![Home-Page](https://github.com/jvalentine1/news-scrape/blob/master/images/home-page-pic.png)

Clicking the *Find News* button will then scrape up to ten articles and store them in Mongodb, after the content has been saved a modal will render notifying the user that the scrape has been complete. When the user clicks *view*, the modal will close and the articles will populate the content center

![article-render](https://github.com/jvalentine1/news-scrape/blob/master/images/news-scrape-gif.gif)

If the user wishes to comment on an article, they simply have to click comment. Once they have entered their message in the text field they can click submit, which will populate the database with a new collection. Or, they can click cancel and the message will be discarded. *The user must have charecters in the input field or they will be notified of an invalid comment*

![comment-render](https://github.com/jvalentine1/news-scrape/blob/master/images/n-s-comment-gif.gif)

If the user wishes to delete a commented article field, they simply have to visit the *Your Articles* section and click delete. The corresponding information will then be removed from the database.

![delete-article]()
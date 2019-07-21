
//Handles ajax call for usa today news scrape
$(document).on("click", "#news-scrape", function() {
    $.get("/scrape", function(data) {
        generateModal(data);
    });
});

//generates modal and option to retrieve articles from mongoDB
function generateModal(data) {
    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];

    modal.style.display = "block";

    $(".modal-text").html("");

    let modalDiv = $("<div>");

    let modalTitle = $("<h1>");
    modalTitle.text(data);
    modalDiv.append(modalTitle);

    let br1 = $("<br>");
    modalDiv.append(br1);

    let modalMessage = $("<h4>");
    modalMessage.text("Click View To See The Latest News");
    modalDiv.append(modalMessage);

    let br2 = $("<br>");
    modalDiv.append(br2);

    let viewBtn = $("<button>");
    viewBtn.addClass("btn btn-primary");
    viewBtn.attr("type", "button");
    viewBtn.attr("id", "view-news");
    viewBtn.text("View");
    modalDiv.append(viewBtn);

    $(".modal-text").append(modalDiv);

    span.onclick = function() {
        modal.style.display = "none";
    }
      
    window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
    }
}

//Initializes ajax call and retrieves articles from mongoDB
$(document).on("click", "#view-news", function() {
    
    var modal = document.getElementById("myModal");

    modal.style.display = "none";

    $.getJSON("/news", function(data) {
        generateNews(data);
    });
});

//Renders articles to page
function generateNews(data) {
    console.log(data);
    for (let i = 0; i < data.length; i++) {
        
        let savedArticle = data[i];

        let newsDiv = $("<div>");
        newsDiv.addClass("col-md-12 pt-3");

        let newsTitle = $("<h1>");
        newsTitle.text(savedArticle.title);
        newsDiv.append(newsTitle);

        let newsSummary = $("<h5>");
        newsSummary.text(savedArticle.summary);
        newsDiv.append(newsTitle);

        let newsLink = $("<a>");
        newsLink.attr("href", "https://news.google.com" + savedArticle.link);
        newsLink.html(savedArticle.link);
        newsDiv.append(newsLink);

        $("#news").prepend(newsDiv);

    }
}
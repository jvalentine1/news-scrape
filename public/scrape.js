
//Handles ajax call for usa today news scrape
$(document).on("click", "#news-scrape", function() {
    $.get("/scrape", function(data) {
        generateModal(data);
    });
});

//generates modal and option to retrieve articles from mongoDB
function generateModal(data) {
    //Display the modal
    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];

    modal.style.display = "block";

    $(".modal-text").html("");

    //generat modal html structure
    let modalDiv = $("<div>");

    let modalTitle = $("<h1>");
    modalTitle.addClass("modal-message text-center");
    modalTitle.text(data);
    modalDiv.append(modalTitle);

    let br1 = $("<br>");
    modalDiv.append(br1);

    let modalMessage = $("<h4>");
    modalMessage.addClass("text-center");
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

    //append modal data
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

    $("#scrape-btn").html("");

    $.getJSON("/news", function(data) {
        generateNews(data);
    });
});

//Renders articles to page
function generateNews(data) {

    for (let i = 0; i < data.length; i++) {
        
        let savedArticle = data[i];

        let newsDiv = $("<div>");
        newsDiv.addClass("col-md-12 pt-3 news-div");
        newsDiv.attr("id", i);

        let newsTitle = $("<h1>");
        newsTitle.addClass("news-title");
        newsTitle.text(savedArticle.title);
        newsDiv.append(newsTitle);

        let newsSummary = $("<h5>");
        newsSummary.addClass("news-summary");
        newsSummary.text(savedArticle.summary);
        newsDiv.append(newsSummary);

        let newsLink = $("<a>");
        newsLink.attr("href", "https://www.usatoday.com" + savedArticle.link);
        newsLink.attr("target", "_blank");
        newsLink.html("https://www.usatoday.com/" + savedArticle.link);
        newsDiv.append(newsLink);

        let br1 = $("<br>");
        newsDiv.append(br1);

        let br2 = $("<br>");
        newsDiv.append(br2);

        var commentBtn = $("<button>");
        commentBtn.addClass("btn btn-primary");
        commentBtn.attr("type", "button");
        commentBtn.attr("id", "comment-news");
        commentBtn.attr("data-id", savedArticle._id);
        commentBtn.text("Comment");
        newsDiv.append(commentBtn);

        $("#news").prepend(newsDiv);
    }
}


//Comment on an article, this onclick function renders a text area to write and submit a comment
$(document).on("click", "#comment-news", function() {
    let id = $(this).attr("data-id");
    let divId = $(this).parent("div").attr("id");

    $(this).detach();

    $("#" + divId).append("<textarea id='body-input' name='body'></textarea>");
    $("#" + divId).append("<br id='br'>")
    $("#" + divId).append("<button type='submit' class='btn btn-primary' data-id=" + id + " id='comment-submit'>Submit</button>")
    $("#" + divId).append("<button type='button' class='btn btn-primary mr-2 cancel-comment'>Cancel</button>");
});

// Submits the comment to the mongodb database along with the object_id of it's corresponding article
$(document).on("click", "#comment-submit", function(e) {
    e.preventDefault();

    let divId = $(this).parent("div").attr("id");
    let id = $(this).attr("data-id");
    let comment = $("#body-input").val();

    $.ajax({
        method: "POST",
        url: "/news/" + id,
        data: {

          body: comment

        }
    }).then(function(data) {
          console.log(data);

        $("#body-input").detach();
        $("#comment-submit").detach();
        $(".cancel-comment").detach();
        $("#br").detach();
        $("#" + divId).append("<button type='button' class='btn btn-primary' id='comment-news' data-id=" + id + ">Comment</button");
    });
});

//Cancels the request to comment on an article
$(document).on("click", ".cancel-comment", function() {
    let divId = $(this).parent("div").attr("id");
    let id = $(this).attr("data-id");

    $("#body-input").detach();
    $("#comment-submit").detach();
    $(".cancel-comment").detach();
    $("#br").detach();
    $("#" + divId).append("<button type='button' class='btn btn-primary' id='comment-news' data-id=" + id + ">Comment</button");
});

//Funtion that retrieves any commented articles on load
function populateNews() {

    $(".my-articles").html("");

    $.ajax({
        method: "GET",
        url: "/mynews"
    }).then(function(data) {

        for (let j = 0; j < data.length; j++) {
            let myNews = data[j];

            if (myNews.comment) {

                let newsDiv = $("<div>");
                newsDiv.addClass("col-md-12 pt-3 news-div");
                newsDiv.attr("id", j);

                let newsTitle = $("<h1>");
                newsTitle.addClass("news-title");
                newsTitle.text(myNews.title);
                newsDiv.append(newsTitle);

                let newsSummary = $("<h5>");
                newsSummary.addClass("news-summary");
                newsSummary.text(myNews.summary);
                newsDiv.append(newsSummary);

                let newsLink = $("<a>");
                newsLink.attr("href", "https://www.usatoday.com" + myNews.link);
                newsLink.attr("target", "_blank");
                newsLink.html("https://www.usatoday.com/" + myNews.link);
                newsDiv.append(newsLink);

                let commentTitle = $("<h1>");
                commentTitle.text("Comments:");
                newsDiv.append(commentTitle);

                let commentWrap = $("<ul>");

                let commentBody = $("<li>");
                commentBody.html(myNews.comment.body);
                commentWrap.append(commentBody);

                newsDiv.append(commentWrap);

                let br1 = $("<br>");
                newsDiv.append(br1);

                var deleteBtn = $("<button>");
                deleteBtn.addClass("btn btn-primary");
                deleteBtn.attr("type", "button");
                deleteBtn.attr("id", "delete-news-btn");
                deleteBtn.attr("data-id", myNews._id);
                deleteBtn.text("Delete");
                newsDiv.append(deleteBtn);

                $(".my-articles").append(newsDiv);
            }
        }
    });
}
//Function call
populateNews();

//On Click function to delete articles that have been saved via comment
$(document).on("click", "#delete-news-btn", function() {

    let id = $(this).attr("data-id");

    $.ajax({
        method: "DELETE",
        url: "/delete/" + id
    }).then(function(data) {
        populateNews();
    });
})


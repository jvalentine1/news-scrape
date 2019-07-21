
//Handles ajax call for usa today news scrape
$("#news-scrape").on("click", function() {
    $.get("/scrape", function(data) {
        generateModal(data);
    });
});

function generateModal(data) {
    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];

    modal.style.display = "block";

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

$(document).on("click", "#view-news", function() {
    console.log("testeroo");
    var modal = document.getElementById("myModal");

    modal.style.display = "none";

    $.getJSON("/news", function(data) {
        console.log(data);
    });
});
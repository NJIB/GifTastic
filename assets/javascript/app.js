var gifImg; // Stores gif for rendering to div
var favGIFs = [{ url: "", title: "", rating: "", importDT: "" }];  //Array to hold favorite GIFs

var k = 0;  // To store favGIFs array index

// Initial array
var gifCategs = [];

// Function for displaying GIFs
function renderButtons() {

    // Deleting the buttons prior to adding new buttons (this is necessary otherwise we will have repeat buttons)
    $("#buttons-view").empty();

    // Looping through the array of GIF searches
    for (var i = 0; i < gifCategs.length; i++) {

        // Then dynamicaly generate buttons for each GIF search in the array
        // This code $("<button>") is all jQuery needs to create the start and end tag. (<button></button>)
        var newBtn = $("<button>");
        // Adding a class for div population
        newBtn.addClass("newGIF");
        //Adding a Bootstrap class for formatting only
        newBtn.addClass("btn btn-warning");
        // Adding a data-attribute with a value of the gif search at index i
        newBtn.attr("data-name", gifCategs[i]);
        // Providing the button's text with a value of the gif search at index i
        newBtn.text(gifCategs[i]);
        // Adding the button to the HTML
        $("#buttons-view").append(newBtn);
    }
}

// This function handles events where one button is clicked
$("#searchBtn").on("click", function (event) {

    // event.preventDefault() prevents the form from trying to submit itself.
    // We're using a form so that the user can hit enter instead of clicking the button if they want
    event.preventDefault();

    // This line will grab the text from the input box
    var searchString = $("#searchGIF").val().trim();

    // The gif Search criteria from the textbox is then added to our array
    gifCategs.push(searchString);

    // calling renderButtons which handles the processing of our GIF array
    renderButtons();
});

// Calling the renderButtons function at least once to display the initial list of GIFs
renderButtons();

// When the Search button is clicked...
$(document.body).on("click", ".newGIF", function () {
    // Grabbing and storing the data-name property value from the button
    var gifData = $(this).attr("data-name");
    console.log("gifData: " + gifData)

    // Constructing a queryURL using the animal name
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        gifData + "&api_key=9P0PILnLoHRVcWYE21GVF0EfgVkXXRr0&limit=10&rating=g";

    // Performing an AJAX request with the queryURL
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        // After data comes back from the request
        .then(function (response) {
            console.log(response);

            // storing the data from the AJAX request in the results variable
            // var results = response.data;
            results = response.data;

            // Identifying output area for GIFs (used to distinguish between the main area and the favorites area)
            gifDestDiv = "gifOutput";

            // Upload GIF and select details to the DOM
            populateDiv(results, gifDestDiv);
        });
});


// Writing the data selected to the DOM
function populateDiv(results, destDiv) {

    // Looping through each result item
    for (var i = 0; i < results.length; i++) {

        // Creating and storing a div tag
        var gifDiv = $("<div>");

        // Creating a paragraph tag with the result item's rating
        var gifP = $("<p>").text("Title: " + results[i].title);
        gifP.append("<br/>" + "Rating: " + results[i].rating);
        gifP.append("<br/>" + "Import date: " + results[i].import_datetime);

        // Creating and storing an image tag
        var gifImg = $("<img>");

        // Give gifImg the gif class, so it can be identified when clicked
        gifImg.addClass("gif");
        gifImg.attr("src", results[i].images.fixed_height.url);

        // Adding Save to favorites button  
        favBtn = $("<button>");
        favBtn.addClass("favGIF");

        //Adding a Bootstrap class for formatting only
        favBtn.addClass("btn btn-success");
        //Add attributes to the favorite button, to be passed on if clicked
        favBtn.attr("data-link", results[i].images.fixed_height.url);
        favBtn.attr("data-title", results[i].title);
        favBtn.attr("data-rating", results[i].rating);
        favBtn.attr("data-import_datetime", results[i].import_datetime);

        favBtn.text("Save as favorite");

        // Appending the paragraph and image tag to the gifDiv
        gifDiv.append(gifP);
        // gifDiv.append("<br/>");
        gifDiv.append(gifImg);
        gifDiv.append("<br/>");

        //Do not show 'Save to favorites' button in Favs pane
        if (destDiv === "favOutput") {
        } else {
            gifDiv.append(favBtn);
        }



        // Prependng the gifDiv to the HTML page in the "#gifOutput" div
        if (destDiv === "favOutput") {
            $("#favOutput").prepend(gifDiv);
        } else {
            $("#gifOutput").prepend(gifDiv);
        };
    }
}

//Pause / play GIF
$(document.body).on("click", ".gif", function () {
    var src = $(this).attr("src");
    if ($(this).hasClass('playing')) {
        //stop
        $(this).attr('src', src.replace(/\.gif/i, "_s.gif"))
        $(this).removeClass('playing');
    } else {
        //play
        $(this).addClass('playing');
        $(this).attr('src', src.replace(/\_s.gif/i, ".gif"))
    }
});


// Save favorites
$(document.body).on("click", ".favGIF", function () {
    // favBtn.attr("data-idx", favGIFs.length + 1);
    $(this).attr("data-Clicked", true);

    document.getElementById("favsContainer").style.display = "flex";

    var gifLink = $(this).attr("data-link");
    var gifTitle = $(this).attr("data-title");
    var gifRating = $(this).attr("data-rating");
    var gifImportDT = $(this).attr("data-import_datetime");

    //Constructing object, so that it can leverage the standard populateDiv function
    favGIFs[k] = {
        images: { fixed_height: { url: gifLink } },
        title: gifTitle,
        rating: gifRating,
        importDT: gifImportDT
    };

    // Increment counter
    k++;
});

// Play favorites
$(document.body).on("click", "#playFavs", function () {
    favDestDiv = "favOutput";
    console.log(favDestDiv);

    populateDiv(favGIFs, favDestDiv);

});

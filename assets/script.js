$(document).ready(function () {
    // Search for city
    $("#search-button").on("click", function () {
        var searchTerm = $("#search-value").val();
        $("#search-value").val("");
        // need to call weather function
        weatherFunction(searchTerm);
        weatherForecast(searchTerm);
    });


    // Get local storage if any
    var history = JSON.parse(localStorage.getItem("history")) || [];

    if (history.length > 0) {
        weatherFunction(history[history.length - 1]);
    }
    // Made row for each city searched for
    for (var i = 0; i < history.length; i++) {
        createRow(history[i]);
    }


    function createRow(text) {
        var listItem = $("<li>").addClass("list-group-item").text(text);
        $(".history").append(listItem);
    }
    $(".history").on("click", "li", function () {
        weatherFunction($(this).text());
        weatherForecast($(this).text());
    });

    function weatherFunction(searchTerm) {
        $.ajax({
            method: "GET",
            queryURL: "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&appid=973fe31b877852d30bc224eba51b5df1&units=imperial",

        }).then(function (data) {
            if (history.indexOf(searchTerm) === -1) {
                history.push(searchTerm);
                localStorage.setItem("history", JSON.stringify(history));
                createRow(searchTerm);
            }
            $("#today").empty();

            var title = $("<h2>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
            var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + "png");

            var card = $("<div>").addClass("card");
            var cardBody = $("<div>").addClass("card-body");
            var wind = $("<p>").addClass("card-text").text("Wind: " + data.wind.speed + " MPH");
            var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
            var temp = $("<p>").addClass("card-text").text("Temperatur: " + data.main.temp + " Fahrenheit");
            var lon = data.coord.lon;
            var lat = data.coord.lat;

            $.ajax({
                method: "GET",
                queryURL: "https://api.openweathermap.org/data/2.5/uvi?appid=973fe31b877852d30bc224eba51b5df1&lat=" + lat + "&lon=" + lon,

            }).then(function (response) {

                console.log(response);

                var uvResponse = response.value;
                var uvIndex = $("<p>").addClass("card-text").text("UV Index: ");
                var btn = $("<span>").addClass("btn btn-sm").text(uvResponse);

                if (uvResponse < 3) {
                    btn.addClass("btn-success");
                } else if (uvResponse < 7) {
                    btn.addClass("btn-warning");
                } else {
                    btn.addClass("btn-danger");
                }

                cardBody.append(uvIndex);
                $("#today .card-body").append(uvIndex.append(btn));
            });

            //merge and add page
            title.append(img);
            cardBody.append(title, temp, humid, wind);
            card.append(cardBody);
            $("#today").append(card);
            console.log(data);
        });
    }
    
    function weatherForecast(searchTerm) {
        $.ajax({
            method: "GET",
            queryURL: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchTerm + "&appid=973fe31b877852d30bc224eba51b5df1&units=imperial",
        
        }).then(function (data) {
            console.log(data);
            $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");

            for (var i = 0; i < data.list.length; i++) {

                if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {

                    var fiveDay = $("<h3>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
                    var fiveIMG = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + "png");
                    var fiveCards = $("<div>").addClass("card bg-primary text-white");
                    var fiveBodyCard = $("<div>").addClass("card-body p-2")
                    var fiveHumidity = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + " %");
                    var fiveTemp = $("<p>").addClass("card-text").text("Temperature: " + data.list[i].main.temp + " Farhenheit");

                    fiveDay.append(fiveIMG);
                    fiveBodyCard.append(fiveDay, fiveTemp, fiveHumidity);
                    fiveCards.append(fiveBodyCard);
                    $(".card-deck").append(fiveCards);


                }

            }
        })
    }

});


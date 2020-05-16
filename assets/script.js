$(document).ready(function (){
    // Search for city
    $("#searchButton").on("click", function(){
        var searchValue = $("#citySearch").val();
        $("#citySearch").val("");
        // need to call weather function
        
    });
    // Get local storage if any
    var cityHistory = JSON.parse(localStorage.getItem("history")) || [];

    
})
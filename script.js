// var citiesSearched = []

// on the page load, grab the cities saved to local storage and find a way to display the city data (dropdown or autopopulate) in a way that is helpful / relevant to the user

// Hannah on the search button event

// onclick event to run the event search query when the user clicks the search button
$("#searchBtn").on("click", function () {

    var city = $("#searchCity").val()

    console.log(city)

    var queryURL = `https://app.ticketmaster.com/discovery/v2/events.json?city=${city}&apikey=JFMQRTKJnY1nEhUvR9DPsBdCSiWWrKBv`;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
    })

    // search the ticketmaster object based on the date

    // search the ticketmaster object based on type of event (based on the classification by ticketmaster)

    // if they check "recommend breweries" then include the ajax / api search for breweries near the selected event location 

    // update the google map view to zoom in on the selected city the user searches 
    
    // push the city search to the citiesSearched array and save to local storage

    // function eventList - generate the list of events

})

// Andrew on the event list 

// function eventList

// for (var i =0; i<20; i++) {

// create a new row for the event 

// display high level detail of event 

// add a button for that event

// on click event 

// update google map to show location of the selected event 

// if they selected yes, they would like brewery recommendations then show the breweries on the map that are near the location of the event

$.ajax({
    url: "https://api.openbrewerydb.org/breweries?by_city=sultan",
    method: "GET"
}).then(function (response) {
    console.log(response)
})

// update the web page to display the new event row / button(s)

// }


// Beth on the Maps

// update map when city is searched 
// update map when event is clicked 
// update map if breweries are selected "yes, include" then populate map with pins of surrounding breweries
// function googleMap() {

    let map;

    function initMap() {
        map = new google.maps.Map(document.getElementById("map"), {
            center: {
                lat: -34.397,
                lng: 150.644
            },
            zoom: 8,
        });
    }
// }
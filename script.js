var citiesSearched = []
var city = ""
// import the string of cities in local storage
var citiesInLocalStorage = localStorage.getItem("cities")

if (citiesInLocalStorage) {
    citiesSearched = JSON.parse(citiesInLocalStorage)
    // find a way to display the city data (dropdown or autopopulate)
}

// onclick event to run the event search query when the user clicks the search button


$("#searchBtn").on("click", function () {

    city = $("#searchCity").val()
    // add the new city to the local storage
    citiesSearched.push(city)
    localStorage.setItem("cities", JSON.stringify(citiesSearched))
    // call the TicketMaster Ajax function
    searchTicketMaster()
})

function searchTicketMaster() {
    // run the query based on the new city
    var queryURL = `https://app.ticketmaster.com/discovery/v2/events.json?city=${city}&apikey=JFMQRTKJnY1nEhUvR9DPsBdCSiWWrKBv`;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        updateEvents(response)
    })

    // call the function to update event list based on the object 
    

}


var eventItems = $(".eventList")
var eventText = "Event filler"

function updateEvents(response) {

    for (let i = 0; i < 20; i++) {
        var showButton = $("<button>")
        showButton.text("Show on Map")
        eventItems.append(showButton)
        eventItems.append("<br><hr>")
        var date = response._embedded.events[i].dates.start.dateTime
        console.log(date)


    }
}

// search the ticketmaster object based on the date

// search the ticketmaster object based on type of event (based on the classification by ticketmaster)

// if they check "recommend breweries" then include the ajax / api search for breweries near the selected event location 

// update the google map view to zoom in on the selected city the user searches 

// push the city search to the citiesSearched array and save to local storage

// function eventList - generate the list of events







// Andrew on the event list 

// TODO: Create 20 breaks, lines, and buttons each time 
// TODO: Fill in the div with the relevant information for the event
// TODO: Make the button functional (it should populate the map with pins relavent to the specific event the button is associated with)
// TODO: Format the above items

// You are pretty much done once you understand the NYT article. All you have to do after that is call out the correct data, print it in the div, and format it correctly 



    
    

    // for (let i = 0; i < 20; i++) {
    //     var showButton = $("<button>")
    //     showButton.text("Show on Map")
    //     eventItems.append(showButton)
    //     eventItems.append("<br><hr>")
    

// function eventList

// for (var i =0; i<20; i++) {

// create a new row for the event 

// display high level detail of event 

// add a button for that event

// on click event 

// update google map to show location of the selected event 

// if they selected yes, they would like brewery recommendations then show the breweries on the map that are near the location of the event

// TODO: questions to ask: 1. Am I supposed to do the Google map stuff above, or is that Beth? 2. We need to make the search button reloads/changes the page (so that someone can enter in a different city and get a fresh page of results). Activity 13 of the APIs could be helpful here. 3. What CSS framework are we using? 

// $.ajax({
//     url: "https://api.openbrewerydb.org/breweries?by_city=sultan",
//     method: "GET"
// }).then(function (response) {
//     console.log(response)
// })

// update the web page to display the new event row / button(s)

// }


// Beth on the Maps

// update map when city is searched 
// update map when event is clicked 
// update map if breweries are selected "yes, include" then populate map with pins of surrounding breweries


// function googleMap() {

//     let map;

//     function initMap() {
//         map = new google.maps.Map(document.getElementById("map"), {
//             center: {
//                 lat: -34.397,
//                 lng: 150.644
//             },
//             zoom: 8,
//         });
//     }
// }
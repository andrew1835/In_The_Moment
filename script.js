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
    geocodeAddress(city, geocoder, map)

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



function updateEvents(response) {

    for (let i = 0; i < 20; i++) {
        // var image
        // TODO: Within this for loop, create a link with jQuery (create an a href), then set the href equal to the URL, and finally append it to the div

        // creates the tag. Right now it shows object Object (like the button used to do). Figure out why that is, and figure out what you changed with button to make it an actual button

        var link = $("<a></a>")
        link.text("Link to Event")
        link.attr("href", response._embedded.events[i].url)
        link.attr("target", "_blank")

        //     href: "",
        //     text: "Link to Event",
        // }) 
        // link.text("Link to Event")

        // Now set the attribute for href to be equal to the URL at the given index of events (events[i]). It should be easy to find an example Activity where they set the attributes of a tag using jQuery

        // link.attr("href" , response._embedded.events[i].url)

        // Then append eventItems with link, and you can then delete the below code you have which puts the actual URL in there


        var eventName = response._embedded.events[i].name
        var date = response._embedded.events[i].dates.start.dateTime
        // var eventLink = response._embedded.events[i].url
        var showButton = $("<button>")
        showButton.text("Show on Map")
        eventItems.append(eventName + " ")
        eventItems.append(date + " ")
        eventItems.append(link)
        eventItems.append(" ")
        eventItems.append(showButton)
        eventItems.append("<br><hr>")



    }
}

$(function () {
    $(window).scroll(function () {
        var winTop = $(window).scrollTop();
        if (winTop >= 30) {
            $("body").addClass("sticky-shrinknav-wrapper");
        } else {
            $("body").removeClass("sticky-shrinknav-wrapper");
        }
    });
});



// search the ticketmaster object based on the date

// search the ticketmaster object based on type of event (based on the classification by ticketmaster)

// if they check "recommend breweries" then include the ajax / api search for breweries near the selected event location 

// update the google map view to zoom in on the selected city the user searches 

// push the city search to the citiesSearched array and save to local storage

// function eventList - generate the list of events







// Andrew on the event list 

// TODO: Create 20 breaks, lines, and buttons each time 
// TODO: Fill in the div with the relevant information for the event
// TODO: Make sure that the information that shows up changes based on the search filters 
// TODO: Make the button functional (it should populate the map with pins relavent to the specific event the button is associated with)
// TODO: Format the above items
// TODO: Make sure that the events are the same as the events that acutally appear on Ticketmaster (right now they aren't)


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
// TODO: on page load, generate map to lat/lng of seattle
// TODO: when search button is clicked, center map around the city search
// TODO: when event/show breweries button is clicked, center map around the event location
//  TODO: put marker on event location
//  TODO: put markers on every nearby brewery

let map;
// location of Seattle, what first shows when user opens website
var location1 = { lat: 47.6, lng: -122.3 };
var location2 = { lat: -37, lng: 144.9 };
var geocoder;
var myOptions = {
    zoom: 8,
    center: location1
}

// loads map on screen
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), myOptions);
    geocoder = new google.maps.Geocoder();

    // marker = new google.maps.Marker({
    //     position: location1,
    //     map: map,
    //     title: "Click to zoom"
    // })
}

// change center to whatever is passed
function geocodeAddress(city, geocoder, resultsMap) {
console.log(city)
    geocoder.geocode({ 'address': city }, function (results, status) {
        if (status === "OK") {
            console.log(results)
            map.setCenter(results[0].geometry.location)
            var marker = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location
            })
        }
    })
}
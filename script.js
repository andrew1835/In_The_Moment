var citiesSearched = []
var city = ""
var eventArray;
var citiesInLocalStorage = localStorage.getItem("cities")
var completeAddress = ""

// import the string of cities in local storage
if (citiesInLocalStorage) {
    citiesSearched = JSON.parse(citiesInLocalStorage)
    city = citiesSearched[citiesSearched.length - 1]
    searchTicketMaster(city)
    $("#eventsListTitle").text(`Top 20 Event Recommendations for ${city}`)
}


// onclick event to run the event search query when the user clicks the search button

$("#target").submit(function (event) {
    event.preventDefault();
    deleteMarkers();
    deleteBreweryMarkers();
    searchEngine();
})

$("#searchBtn").on("click", function () {
    deleteMarkers();
    deleteBreweryMarkers();
    searchEngine();
})

function searchEngine() {
    city = $("#searchCity").val()
    var dateSelected = $("#date").val()

    // add the new city to the local storage
    if (city) {
        citiesSearched.push(city)
        localStorage.setItem("cities", JSON.stringify(citiesSearched))
        // update the title page display to show the city 
        $("#eventsListTitle").text(`Top 20 Event Recommendations for ${city}`)

        if (dateSelected) {
            $("#eventsListDate").text(`Date Selected: ${dateSelected}`)
        } else {
            $("#eventsListDate").text(` `)
        }

        // call the TicketMaster Ajax function
        searchTicketMaster(city, dateSelected)
        geocodePlace(city)
        searchBreweries()

    } else {
        $("#notice").text(`Please select a city`)
    }

    // clear the search bar
    $("#searchCity").val("")
    $("#date").val("")
}


// search for events based on the city searched
function searchTicketMaster(city, startDate) {
    var apiKey = "JFMQRTKJnY1nEhUvR9DPsBdCSiWWrKBv";

    var formattedDate = ""

    if (startDate) {
        formattedDate = new Date(startDate).toISOString().split('.')[0] + "Z";
    } else {
        formattedDate = new Date().toISOString().split('.')[0] + "Z"; // today
    }
    // console.log(formattedDate)

    // var formattedDate = startDate ? new Date(startDate).toISOString() : new Date().toISOString();
    // run the query based on the new city
    var queryURL = `https://app.ticketmaster.com/discovery/v2/events.json?city=${city}&startDateTime=${formattedDate}&sort=date,asc&apikey=${apiKey}`;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        clearPreviousSearches()
        updateEvents(response)

        eventArray = response;
    })
}
var breArr = []

function searchBreweries() {
    deleteBreweryMarkers();
    if ($("#includeBreweries").is(":checked")) {

        $.ajax({
            url: `https://api.openbrewerydb.org/breweries?by_city=${city}`,
            method: "GET"
        }).then(function (response) {
            console.log(response)
            //  put markers on every nearby brewery
            for (var i = 0; i < response.length; i++) {
                var breweryName = response[i].name;
                var breObj = {
                    brewery: breweryName,
                    address: response[i].street + response[i].city
                }
                breArr.push(breObj)
            }
            for (let j = 0; j < breArr.length; j++) {
              
                
                geocoder.geocode({
                    'address': breArr[j].address
                }, function (results, status) {
    
                    if (status === "OK") {
                        // adds marker to that coordinate
                        addBreweryMarker(results[0].geometry.location, breArr[j].brewery)
                    }
                })
            }
        })
    }


}


function clearPreviousSearches() {
    $(".eventList").empty();
}

// grab the event list class from the html
var eventBucket = $(".eventList")

// update the page with event list data from the ticketmaster API
function updateEvents(response) {

    for (let i = 0; i < 20; i++) {
        var currentEvent = response._embedded.events[i];
        var imageURL = currentEvent.images[1].url;
        var url = currentEvent.url;
        var eventName = currentEvent.name;
        var rawDate = currentEvent.dates.start.dateTime;
        var formattedDate = new Date(rawDate).toDateString();

        // event div
        var wrapperDiv = $("<div>");
        wrapperDiv.addClass("eventItem")

        // create image
        var image = $("<img>");
        image.attr("src", imageURL);
        image.attr("alt", eventName);
        image.attr("width", "30%");
        image.attr("height", "90%");
        image.addClass("eventImage");

        // create link 
        var link = $("<a></a>");
        link.text("Link to Event");
        link.attr("href", url);
        link.attr("target", "_blank");

        // create event name and date
        var nameDiv = $("<div>");
        nameDiv.addClass("eventNameTitle")
        nameDiv.append(eventName);

        var dateDiv = $("<div>");
        dateDiv.append(formattedDate);

        // create button 
        var showButton = $("<button>");
        showButton.text("Show on Map");
        showButton.addClass("button button-rounded-hover");
        showButton.attr("value", i);

        // append all items to page
        wrapperDiv.append(image);
        wrapperDiv.append(nameDiv);
        wrapperDiv.append(dateDiv);

        wrapperDiv.append(link);
        wrapperDiv.append(" ");
        wrapperDiv.append(showButton);
        wrapperDiv.append("<br><hr>");

        eventBucket.append(wrapperDiv);

        // save the first event's longitutde and latitude to local storage to use later as the default location on page load
        if (i === 0) {
            // get location for later
            var location = {
                lat: currentEvent["_embedded"]["venues"][0]["location"]["latitude"],
                lng: currentEvent["_embedded"]["venues"][0]["location"]["longitude"]
            }
            localStorage.setItem("lastCitySearched", JSON.stringify(location))
        }
    }

}


// default location if nothing in local storage
let map;

var lastLoctionFromStorage = JSON.parse(localStorage.getItem("lastCitySearched"))
console.log(lastLoctionFromStorage)

if (lastLoctionFromStorage !== null) {
    var defaultLocation = {
        lat: parseFloat(lastLoctionFromStorage.lat),
        lng: parseFloat(lastLoctionFromStorage.lng)
    }

} else {
    var defaultLocation = {
        lat: 47.6,
        lng: -122.3
    };
}

var geocoder;
var googleMapsOptions = {
    zoom: 8,
    center: defaultLocation
}


// load map on screen
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), googleMapsOptions);
    geocoder = new google.maps.Geocoder();
}

// when search button is clicked, center map around the city search
// change center to whatever is passed

function placeCity(completeAddress) {
    // deletes markers from previous searches
    deleteMarkers();
    geocodePlace(completeAddress);
    // returns lat and long of city name
}

function geocodePlace(completeAddress) {
    geocoder.geocode({
        'address': completeAddress
    }, function (results, status) {
        if (status === "OK") {
            // centers map around that coordinate
            map.setCenter(results[0].geometry.location);
            // adds marker to that coordinate
            addMarker(results[0].geometry.location);
        }
    })
}
// var previousEventLocation = localStorage.getItem("eventLocations")

// if (previousEventLocation) {
//     lastAddressSearched = JSON.parse(previousEventLocation)
//     lastAddressForPageLoad = lastAddressSearched[lastAddressSearched.length - 1]
//     placeCity(lastAddressForPageLoad)

// }

// when event/show breweries button is clicked, center map around the event location
//  put marker on event location

$("#eventList").delegate(".button-rounded-hover", "click", function () {
    deleteMarkers();
    var value = $(this).attr("value");
    var streetAddress = eventArray._embedded.events[value]._embedded.venues[0].address.line1;
    citySearched = eventArray._embedded.events[value]._embedded.venues[0].city.name;
    var state = eventArray._embedded.events[value]._embedded.venues[0].state.name;
    completeAddress = streetAddress + ", " + citySearched + " " + state

    // // create array for event locations clicked
    // var previousEventLocation = []

    // // save the location array to local storage
    // previousEventLocation.push(completeAddress)
    // localStorage.setItem("eventLocations", JSON.stringify(previousEventLocation))

    placeCity(completeAddress)
})



var markers = [];
var breweryMarkers = [];

function addMarker(location) {
    const marker = new google.maps.Marker({
        position: location,
        map: map,
    })
    console.log("added place marker at " + location)
    markers.push(marker)
}

function addBreweryMarker(location, breweryName) {
    const marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        },
        title: breweryName
    })
    breweryMarkers.push(marker)
}

function setMapOnEvents(map) {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function setMapOnBreweries(map) {
    for (let i = 0; i < breweryMarkers.length; i++) {
        breweryMarkers[i].setMap(map);
    }
}

function deleteMarkers() {
    setMapOnEvents(null);
    markers = [];
}

function deleteBreweryMarkers() {
    setMapOnBreweries(null);
    breweryMarkers = [];
    breArr = [];
}

var citiesSearched = []
var city = ""
var eventArray;
var citiesInLocalStorage = localStorage.getItem("cities")
var lastLocationCoordinates = localStorage.getItem("lastLocationCoordinates")

// import the string of cities in local storage
if (citiesInLocalStorage) {
    citiesSearched = JSON.parse(citiesInLocalStorage)
    city = citiesSearched[citiesSearched.length - 1]
    searchTicketMaster(city)
    $("#eventsListTitle").text(`Top 20 Event Recommendations for ${city}`)
}

// onclick event to run the event search query when the user clicks the search button
$("#searchBtn").on("click", function () {
    city = $("#searchCity").val()
    // add the new city to the local storage
    citiesSearched.push(city)
    localStorage.setItem("cities", JSON.stringify(citiesSearched))

    // update the title page display to show the city 
    $("#eventsListTitle").text(`Top 20 Event Recommendations for ${city}`)

    // call the TicketMaster Ajax function
    searchTicketMaster(city)

})


// search for events based on the city searched
function searchTicketMaster(city) {
    // run the query based on the new city
    var queryURL = `https://app.ticketmaster.com/discovery/v2/events.json?city=${city}&apikey=JFMQRTKJnY1nEhUvR9DPsBdCSiWWrKBv`;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        clearPreviousSearches()
        updateEvents(response)

        eventArray = response;
    })
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
        var url = currentEvent.url;
        var eventName = currentEvent.name;
        var rawDate = currentEvent.dates.start.dateTime;
        var formattedDate = new Date(rawDate).toDateString();

        // event div
        var wrapperDiv = $("<div>")

        // create link 
        var link = $("<a></a>")
        link.text("Link to Event")
        link.attr("href", url)
        link.attr("target", "_blank")

        // create event name and date
        var nameDiv = $("<div>")
        nameDiv.append(eventName)

        var dateDiv = $("<div>")
        dateDiv.append(formattedDate)

        // create button 
        var showButton = $("<button>")
        showButton.text("Show on Map")
        showButton.addClass("button button-rounded-hover")
        showButton.attr("value", i)

        // append all items to page
        eventBucket.append(wrapperDiv)
        eventBucket.append(nameDiv)
        eventBucket.append(dateDiv)

        wrapperDiv.append(link)
        wrapperDiv.append(" ")
        wrapperDiv.append(showButton)
        wrapperDiv.append("<br><hr>")

        // save the first event's longitutde and latitude to local storage to use later as the default location on page load
        if (i === 0) {

            // get location for later
            var location = currentEvent["_embedded"]["venues"][0]["location"];
            localStorage.setItem("lastLocationCoordinates", JSON.stringify(location))

        }

    }

}



var lastLocationCoordinates = localStorage.getItem("lastLocationCoordinates")

if (lastLocationCoordinates) {
    // console.log(typeof lastLocationCoordinates)
    lastLocationCoordinates = JSON.parse(lastLocationCoordinates)
    // console.log(typeof lastLocationCoordinates)
    // location of Seattle, what first shows when user opens website
    var defaultLocation = {
        lat: parseInt(lastLocationCoordinates.latitude),
        lng: parseInt(lastLocationCoordinates.longitude)
    };

    googleMapsOptions = {
        zoom: 8,
        center: defaultLocation
    }
} else {
    // default location if nothing in local storage
    let map;

    var defaultLocation = {
        lat: 47.6,
        lng: -122.3
    };

    var geocoder;
    var googleMapsOptions = {
        zoom: 8,
        center: defaultLocation
    }
};


// load map on screen
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), googleMapsOptions);
    geocoder = new google.maps.Geocoder();
}

// when search button is clicked, center map around the city search
// change center to whatever is passed

function placeCity(city) {
    // deletes markers from previous searches
    deleteMarkers();
    // returns lat and long of city name
    geocoder.geocode({
        'address': city
    }, function (results, status) {
        if (status === "OK") {
            // centers map around that coordinate
            map.setCenter(results[0].geometry.location)
            // adds marker to that coordinate
            addMarker(results[0].geometry.location)
        }
    })
}


// when event/show breweries button is clicked, center map around the event location
//  put marker on event location
$("#eventList").delegate(".button-rounded-hover", "click", function () {
    deleteMarkers();
    var value = $(this).attr("value");
    var address = eventArray._embedded.events[value]._embedded.venues[0].name;
    placeCity(address)
    $.ajax({
        url: `https://api.openbrewerydb.org/breweries?by_city=${eventArray._embedded.events[value]._embedded.venues[0].city.name}`,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        //  put markers on every nearby brewery
        for (var i = 0; i < response.length; i++) {
            geocoder.geocode({
                'address': response[i].street + response[i].city
            }, function (results, status) {
                if (status === "OK") {
                    // adds marker to that coordinate
                    addBreweryMarker(results[0].geometry.location)
                }
            })
        }
    })
})


var markers = [];

function addMarker(location) {
    const marker = new google.maps.Marker({
        position: location,
        map: map,
    })
    markers.push(marker)
}

function addBreweryMarker(location) {
    const marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        }
    })
    markers.push(marker)
}

function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function deleteMarkers() {
    setMapOnAll(null);
    markers = [];
}
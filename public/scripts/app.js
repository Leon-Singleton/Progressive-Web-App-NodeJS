/**
 * called by the HTML onload
 * registers the service worker and synce the data between mongoDB and indexedDB, before loading it
 */
function initIndex() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then(function () {
                console.log('Service Worker Registered');
            })
            .catch (function (error){
                console.log('Service Worker NOT Registered '+ error.message);
            });
    }

    syncDatabaseIndexDB();
    loadDataEvent();
}

/**
 * retrieves all the events from the database
 */
function loadDataEvent(){
    if (document.getElementById(    'offline_div')!=null)
        document.getElementById('offline_div').style.display='none';
    retrieveAllEvents();
}

//////////////////////////////////////////////////////////////
///////////////////////// INTERFACE MANAGEMENT //////////////
/////////////////////////////////////////////////////////////

/**
 * displays all of the events passed in via the 'events' paramater using innerhtml
 * @param events
 */
function displayEvents(events) {
    document.getElementById('results').innerHTML='';
    console.log(events[0])
    events.forEach(function(event) {
        // const event_name = String(event.eventName);
        // console.log(event_name);
        const card = document.createElement('div');
        // appending a new row
        document.getElementById('results').appendChild(card);

        // formatting the row by applying css classes
        card.classList.add('card');
        card.classList.add('bg-light');
        card.classList.add('card-body');
        card.classList.add('mb-3');
        var cardhtml = "                <div class=\"container\">\n" +
            "                    <div class=\"row\">\n" +
            "                        <div class=\"media w-100\">\t<a class=\"float-left\" href=\"#\">\n" +
            "\n";

        if(event.img != "") {
            cardhtml += "                                 <img src=\"/index/images/" +event.img[0]+"\" class=\"eventImg\">"
        }

         cardhtml +=   "                            </a>\n" +
            "                            <div class=\"media-body\">\n" +
            "                                <ul class=\"list-inline list-unstyled highlight\">\n" +
            "                                    <li class=\"list-inline-item\" style=\"font-size: 28px\"><b>&ensp;" + event.eventname + "</b></li>\n" +
            "                                    <li class=\"list-inline-item float-right char\"><b>Created By " + event.firstname +" "+event.surname + " </b></li>\n" +
            "                                </ul>\n" +
            "                                <p style=\"padding: 5px 0px 5px 25px;\">" + event['description'] + "</p>\n" +
            "                            </div>\n" +
            "                        </div>\n" +
            "                    </div>\n" +
            "                    <div class=\"row\">\n" +
            "                        <ul class=\"list-inline list-unstyled w-100\" style=\"padding: 5px 0px 0px 0px;\">\n" +
            "                            <li class=\"list-inline-item\"><span><i class=\"glyphicon glyphicon-calendar\"><b>Date: </b></i>" + event.startdate.toString().substring(0, 10)+ "<i><b> Time: </b></i> "+ event.startdate.toString().substring(11, 16)+"</span></li>\n" +
            "                            <li class=\"list-inline-item\">~</li> <span><i class=\"glyphicon glyphicon-comment\"><b>Date: </b></i>" + event.startdate.toString().substring(0, 10)+ "<i><b> Time: </b></i>"+ event.startdate.toString().substring(11, 16)+ "</span>\n" +
            "                            <li class=\"list-inline-item\">&ensp;|</li> <span><i class=\"glyphicon glyphicon-comment\"><b>Location: </b></i>" + event.location+ " "+ event.city+" "+event.postcode+"</span>\n" +
            "                              <div>\n" +
            "                            <button class=\"btn btn-info btn-md float-right\" style=\"margin-left:5px;\" onclick=\"window.location.href =\'/viewStories/"+event.event_id+"\' \">\n" +
            "                                View Stories\n" +
            "                            </button>"+
            "                               </div>\n" +
            "                            <button type='button' class=\"btn btn-primary\" data-toggle=\"modal\" data-target=\"#model-" + event.event_id+  "\">\n" +
            "                                View Images\n" +
            "                            </button>"+
            "                        </ul>\n" +
            "                    </div>\n" +
            "                </div>\n" +
            "            </div>" +
            "<!-- Modal -->\n" +
            "            <div class=\"modal fade\" id=\"model-"+ event.event_id +"\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"model-"+ event.event_id +"\" aria-hidden=\"true\">\n" +
            "                <div class=\"modal-dialog modal-dialog-centered modal-lg\" role=\"document\">\n" +
            "                    <div class=\"modal-content\">\n" +
            "                        <div class=\"modal-header\">\n" +
            "                            <h5 class=\"modal-title\" >Images - "+ event.eventname+ "</h5>\n" +
            "                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n" +
            "                                <span aria-hidden=\"true\">&times;</span>\n" +
            "                            </button>\n" +
            "                        </div>\n"+
            "                        <div class=\"modal-body\" id=\"model-body\">\n";

        event.img.forEach(function(img){
            if(event.img != "") {
                cardhtml += "<img src=\"/index/images/" +img+"\" class=\"eventImg\" style=\"padding-right: 4px\">"
            }
        });

        cardhtml += "                        </div>\n" +
            "                        <div class=\"modal-footer\">\n" +
            "                            <button type=\"button\" class=\"btn btn-primary\" data-dismiss=\"modal\">Close</button>\n" +
            "                        </div>\n" +
            "                    </div>\n" +
            "                </div>\n" +
            "            </div>"

        card.innerHTML = cardhtml;
    });
}

/**
 * displays all of the events passed in via the 'events' paramater using innerhtml associated with the logged in user
 * displays button options allowing the user to edit/delete the events
 * @param events
 */
function displayMyEvents(events) {
    document.getElementById('results').innerHTML='';
    console.log(events[0])
    events.forEach(function(event) {
        // const event_name = String(event.eventName);
        // console.log(event_name);
        const card = document.createElement('div');
        // appending a new row
        document.getElementById('results').appendChild(card);

        // formatting the row by applying css classes
        card.classList.add('card');
        card.classList.add('bg-light');
        card.classList.add('card-body');
        card.classList.add('mb-3');
        var cardhtml = "                <div class=\"container\">\n" +
            "                    <div class=\"row\">\n" +
            "                        <div class=\"media w-100\">\t<a class=\"float-left\" href=\"#\">\n" +
            "\n";
        if(event.img != "") {
            cardhtml += "                                 <img src=\"/index/images/" +event.img[0]+"\" class=\"eventImg\">"
        }
         cardhtml += "                            </a>\n" +
            "                            <div class=\"media-body\">\n" +
            "                                <ul class=\"list-inline list-unstyled highlight\">\n" +
            "                                    <li class=\"list-inline-item\" style=\"font-size: 28px\"><b>&ensp;" + event.eventname + "</b></li>\n" +
            "                                    <li class=\"list-inline-item float-right char\"><b>Created By " + event.firstname +" "+event.surname + " </b></li>\n" +
            "                                </ul>\n" +
            "                                <p style=\"padding: 5px 0px 5px 25px;\">" + event['description'] + "</p>\n" +
            "                            </div>\n" +
            "                        </div>\n" +
            "                    </div>\n" +
            "                    <div class=\"row\">\n" +
            "                        <ul class=\"list-inline list-unstyled w-100\" style=\"padding: 5px 0px 0px 0px;\">\n" +
            "                            <li class=\"list-inline-item\"><span><i class=\"glyphicon glyphicon-calendar\"><b>Date: </b></i>" + event.startdate.toString().substring(0, 10)+ "<i><b>Time: </b></i> "+ event.startdate.toString().substring(11, 16)+"</span></li>\n" +
            "                            <li class=\"list-inline-item\">~</li> <span><i class=\"glyphicon glyphicon-comment\"><b>Date: </b></i>" + event.enddate.toString().substring(0, 10)+ "<i><b>Time: </b></i> "+ event.enddate.toString().substring(11, 16)+ "</span>\n" +
            "                            <li class=\"list-inline-item\">&ensp;|</li> <span><i class=\"glyphicon glyphicon-comment\"><b>Location: </b></i>" + event.location+ " "+ event.city+" "+event.postcode+"</span>\n" +
            "                            <form id=\“xForm\" onsubmit=\"onSubmit('/MyEvents/deleteEvent/"+ event.event_id +"')\">\n" +
            "                               <input class=\"btn btn-danger btn-md float-right\" style=\"margin-left:5px;\" type=\"submit\" name=\"delete\" value='Delete Event' onClick=\"return confirm('Are you sure you want to delete this event?')\" />\n" +
            "                            </form>\n" +
            "                            <form method=\"get\" action=\"/myEvents/editEvent/"+event.event_id+"\">\n" +
            "                                <input class=\"btn btn-warning btn-md float-right\" style=\"margin-left:5px;\" type=\"submit\" name=\"edit\" value='Edit Event'/>\n" +
            "                            </form>\n" +
            // "                            <form method=\"get\" action=\"/viewStories/"+event['event_id']+"\" onsubmit=\"storyView('"+ event.eventName + "')\">\n" +
            // "                                <input class=\"btn btn-info btn-md float-right\" style=\"margin-left:5px;\" type=\"submit\" name=\"viewstories\" value='View Stories'/>\n" +
            // "                            </form>\n" +
            // "                            <form >\n" +
            "                              <div>\n" +
            "                            <button class=\"btn btn-info btn-md float-right\" style=\"margin-left:5px;\" onclick=\"window.location.href =\'/viewStories/"+event.event_id+"\'\">\n" +
            "                                View Stories\n" +
            "                            </button>"+
            "                               </div>\n" +
            // "                            </form>\n" +
            "                            <form method=\"get\" action=\"/myEvents/createStory/"+event['event_id']+"\">\n" +
            "                                <input class=\"btn btn-success btn-md float-right\" style=\"margin-left:5px;\" type=\"submit\" name=\"create\" value='Create Story'/>\n" +
            "                            </form>\n" +
            "                            <button type='button' class=\"btn btn-primary\" data-toggle=\"modal\" data-target=\"#model-" + event.event_id+  "\">\n" +
            "                                View Images\n" +
            "                            </button>"+
            "                        </ul>\n" +
            "                    </div>\n" +
            "                </div>\n" +
            "            </div>" +
            "<div class=\"modal fade\" id=\"modelstories-" + event.event_id+  "\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"modelstories-"+ event.event_id+ "\" aria-hidden=\"true\">\n" +
            "                <div class=\"modal-dialog modal-dialog-centered modal-lg\" role=\"document\">\n" +
            "                    <div class=\"modal-content\">\n" +
            "                        <div class=\"modal-header\">\n" +
            "                            <h5 class=\"modal-title\" >Stories - " + event.img+ "</h5>\n" +
            "                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n" +
            "                                <span aria-hidden=\"true\">&times;</span>\n" +
            "                            </button>\n" +
            "                        </div>\n" +
            "                        <div class=\"modal-body\" id=\"model-body\">\n" +
            "                             <div class=\"container\">\n" +
            "                                    <div id=\"displayStories\" class=\"card card-body mb-3\"></div>\n" +
            "                              </div>"+
            "                        </div>\n" +
            "                        <div class=\"modal-footer\">\n" +
            "                            <button type=\"button\" class=\"btn btn-primary\" data-dismiss=\"modal\">Close</button>\n" +
            "                        </div>\n" +
            "                    </div>\n" +
            "                </div>\n" +
            "            </div>" +
            "<!-- Modal -->\n" +
            "            <div class=\"modal fade\" id=\"model-"+ event.event_id +"\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"model-"+ event.event_id +"\" aria-hidden=\"true\">\n" +
            "                <div class=\"modal-dialog modal-dialog-centered modal-lg\" role=\"document\">\n" +
            "                    <div class=\"modal-content\">\n" +
            "                        <div class=\"modal-header\">\n" +
            "                            <h5 class=\"modal-title\" >Images - "+ event.eventname+ "</h5>\n" +
            "                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n" +
            "                                <span aria-hidden=\"true\">&times;</span>\n" +
            "                            </button>\n" +
            "                        </div>\n"+
            "                        <div class=\"modal-body\" id=\"model-body\">\n";

        event.img.forEach(function(img){
            if(event.img != "") {
                cardhtml += "<img src=\"/index/images/" +img+"\" class=\"eventImg\" style=\"padding-right: 4px\">"
            }
        });

        cardhtml += "                        </div>\n" +
            "                        <div class=\"modal-footer\">\n" +
            "                            <button type=\"button\" class=\"btn btn-primary\" data-dismiss=\"modal\">Close</button>\n" +
            "                        </div>\n" +
            "                    </div>\n" +
            "                </div>\n" +
            "            </div>"

        card.innerHTML = cardhtml;
    });
}

/**
 * syncs the indexedDb and mongoDB databases
 */
function syncDatabaseIndexDB() {

    //initialises the indexedDB database
    initDatabase();

    fetch('/index/events')
        .then(response => {
            return response.json();
        })
        .then(events => {
            clearEvent();
            addEvents(events);
        })
        .catch(err => {

        });
    fetch('/index/stories')
        .then(response => {
            return response.json();
        })
        .then(stories => {
            clearStory();
            addStories(stories)
            //console.log(events);
        })
        .catch(err => {

        });
}

/**
 * method for extracting the event paramters from a html form and then converting them to JSON
 * then inserting this JSON into indexedDB
 */
function sendEvent() {
    initDatabase();

    //create event JSON
    var event = {
        username: document.getElementById("eventUsername").value,
        firstname: document.getElementById("eventfirstname").value,
        surname: document.getElementById("eventSurname").value,
        eventName: document.getElementById("eventName").value,
        startdate: document.getElementById("eventstartdate").value,
        enddate: document.getElementById("eventenddate").value,
        description: document.getElementById("eventDescription").value,
        img: "No Picture",
        location: document.getElementById("eventLocation").value,
        city: document.getElementById("eventCity").value,
        postcode: document.getElementById("eventPostcode").value
    };

    //add event JSON to indexedDB
    addEvent(event);
}

/**
 * function to get the field values from a html form for editing an event
 */
function initEditEvent() {
    initDatabase();
    var event_id = document.getElementById("eventID").value;
    getEditEventFields(event_id);
}

function initViewStories(event_id) {
    syncDatabaseIndexDB();
    relatedStories(event_id)
}

/**
 * function to get the field values from a html form for editing an event
 */
function editEvent() {
    event_id = parseInt(document.getElementById("eventID").value);

    //create a new event JSON
    var event = {
        event_id: event_id,
        eventName: document.getElementById("newEventName").value,
        startdate: new Date(document.getElementById("eventstartdate").value),
        enddate: new Date(document.getElementById("eventenddate").value),
        description: document.getElementById("eventDescription").value,
        img: "No Picture",
        location: document.getElementById("eventLocation").value,
        city: document.getElementById("eventCity").value,
        postcode: document.getElementById("eventPostcode").value
    };
    //update the event using the new event JSON
    updateEvent(event);
}

/**
 * function to delete an event using its associated eventID
 * @param eventID the id of the event
 */
function deleteEvent(eventID) {
    confirm('This will also remove all associated stories. Are you sure you want to delete this event?');
    event_id = parseInt(eventID);
    removeEvent(event_id);
}

/**
 * function to delete a story using its associated storyID
 * @param storyID the id of the story
 */
function deleteStory(storyID) {
    confirm('Are you sure you want to delete this story?');
    story_id = parseInt(storyID);
    removeStory(story_id);
}

/**
 * function to initialise the creation of a story
 */
function initCreateStory() {
    initDatabase();
    var eventID = document.getElementById("eventID").value;
    event_id = parseInt(eventID);
    eventNameforStory(event_id);
}

/**
 * function to sync the database and retrieve events related to the logged in user
 */
function initMyEvents(username) {
    syncDatabaseIndexDB();
    retrieveEventbyUser(username)
}

/**
 * function to sync the database and retrieve stories related to the logged in user
 */
function initMyStories(username) {
    syncDatabaseIndexDB();
    retrieveStoriesByUser(username)
}

/**
 * method for extracting the story paramters from a html form and then converting them to JSON
 * then inserting this JSON into indexedDB
 */
function createStory() {
    var event_id = parseInt(document.getElementById('eventID').value);

    //create a story JSON
    var story = {
        storyname: document.getElementById('storyname').value,
        eventname: document.getElementById('eventname').value,
        username: document.getElementById('storyUsername').value,
        firstname: document.getElementById('storyfirstname').value,
        surname: document.getElementById('storySurname').value,
        event_id: event_id,
        img: "No Picture",
        description: document.getElementById('storyDescription').value,
        longitude: document.getElementById('storyLongitude').value,
        latitude: document.getElementById('storyLatitude').value,
        datePosted: new Date().getTime()
    };

    //insert the story JSON into the indexedDB
    addStory(story);
}

/**
 * function to sync the database and all of the stories from the indexedDB database
 */
function initStories() {
    initDatabase();
    retrieveAllStories();
}

/**
 * displays all of the stories passed in via the 'stories' paramater using innerhtml associated with the logged in user
 * @param stories the stories JSON object
 */
function displayStories(stories) {
    document.getElementById('results').innerHTML='';
    stories.forEach(function(story) {
        console.log("Running")
        const card = document.createElement('div');
        // appending a new row
        document.getElementById('results').appendChild(card);

        card.classList.add('card');
        card.classList.add('bg-light');
        card.classList.add('card-body');
        card.classList.add('mb-3');

        var cardhtml = "          <div class=\"media\">\t<a class=\"float-left\" href=\"#\">\n" +
            "\n";

        if(story.img != "") {
            cardhtml += "      \t\t<img class=\"storyImg\" src=\"/index/images/"+ story.img[0] +"\">\n"
        }
         cardhtml +=   "\n" +
            "    \t\t</a>\n" +
            "              <div class=\"media-body\">\n" +
            "                    <ul class=\"list-inline list-unstyled highlight\">\n" +
            "                  \t<li class=\"list-inline-item\" style=\"font-size: 28px\"><b>&ensp;"+story.storyname+"</b></li>\n" +
            "                    <li class=\"list-inline-item float-right char\"><b>Created By "+story.firstname +" "+story.surname+ "</b>" +
             "</li>\n" +
            "                    </ul>\n" +
            "                  <p style=\"padding: 5px 0px 5px 25px;\"><b>Event: </b>"+story.eventname +"<br>"+story.description +"</p>\n" +
            "\n" +
            "                  <ul class=\"list-inline list-unstyled\" style=\"padding: 5px 0px 5px 25px;\">\n" +
            "                      <li class=\"list-inline-item\"><span><i class=\"glyphicon glyphicon-calendar\"><b>Date: </b></i>"+story.dateposted.substring(0,10)+ " | "+"<i><b>Time: </b></i> " + story.dateposted.substring(11,16)+"</span></li>\n" +
            "                      <form id=\“xForm\" onsubmit=\"onSubmit('/MyStories/deleteStory/"+ story.story_id +"')\">\n" +
            "                           <input class=\"btn btn-danger btn-md float-right\" style=\"margin-left:5px;\" type=\"submit\" name=\"delete\" value='Delete Story' onClick=\"return confirm('Are you sure you want to delete this story?')\" />\n" +
            "                      </form>\n" +
            "                      <form method=\"get\" action=\"/MyStories/editStory/"+story.story_id+"\">\n" +
            "                          <input class=\"btn btn-warning btn-md float-right\" style=\"margin-left:5px;\" type=\"submit\" name=\"edit\" value='Edit Story'/>\n" +
            "                      </form>\n" +
            "                            <button type='button' class=\"btn btn-primary\" data-toggle=\"modal\" data-target=\"#model-" + story.story_id+  "\">\n" +
            "                                View Images\n" +
            "                            </button>"+
            "                  </ul>\n" +
            "              </div>\n" +
            "\n" +
            "          </div>\n"+
            "<!-- Modal -->\n" +
            "            <div class=\"modal fade\" id=\"model-"+ story.story_id +"\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"model-"+ story.story_id +"\" aria-hidden=\"true\">\n" +
            "                <div class=\"modal-dialog modal-dialog-centered modal-lg\" role=\"document\">\n" +
            "                    <div class=\"modal-content\">\n" +
            "                        <div class=\"modal-header\">\n" +
            "                            <h5 class=\"modal-title\" >Images - "+ story.storyname+ "</h5>\n" +
            "                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n" +
            "                                <span aria-hidden=\"true\">&times;</span>\n" +
            "                            </button>\n" +
            "                        </div>\n"+
            "                        <div class=\"modal-body\" id=\"model-body\">";

        if(story.img != "") {
            story.img.forEach(function (img) {
                cardhtml += "<img src=\"/index/images/" + img + "\" class=\"eventImg\" style=\"padding-right: 4px\">"
            });
        }

        cardhtml += "                        </div>\n" +
            "                        <div class=\"modal-footer\">\n" +
            "                            <button type=\"button\" class=\"btn btn-primary\" data-dismiss=\"modal\">Close</button>\n" +
            "                        </div>\n" +
            "                    </div>\n" +
            "                </div>\n" +
            "            </div>"

        card.innerHTML = cardhtml

    });

}

/**
 * displays all of the stories passed in via the 'stories' paramater using innerhtml associated with the logged in user
 * displays button options allowing the user to edit/delete the events
 * @param stories the stories JSON object
 */
function displayMyStories(stories) {
    document.getElementById('results').innerHTML='';
    stories.forEach(function(story) {
        console.log("Running")
        const card = document.createElement('div');
        // appending a new row
        document.getElementById('results').appendChild(card);

        card.classList.add('card');
        card.classList.add('bg-light');
        card.classList.add('card-body');
        card.classList.add('mb-3');

        var cardhtml = "          <div class=\"media\">\t<a class=\"float-left\" href=\"#\">\n" +
            "\n"
        if(story.img != "") {
            cardhtml += "      \t\t<img class=\"storyImg\" src=\"/index/images/"+ story.img[0] +"\">\n"
        }
        cardhtml += "\n" +
            "    \t\t</a>\n" +
            "              <div class=\"media-body\">\n" +
            "                    <ul class=\"list-inline list-unstyled highlight\">\n" +
            "                  \t<li class=\"list-inline-item\" style=\"font-size: 28px\"><b>&ensp;"+story.storyname+"</b></li>\n" +
            "                    <li class=\"list-inline-item float-right char\"><b>Created By "+story.firstname +" "+story.surname+ "</b><</li>\n" +
            "                    </ul>\n" +
            "                  <p style=\"padding: 5px 0px 5px 25px;\"><b>Event: </b>"+story.eventname +"<br>"+story.description +"</p>\n" +
            "\n" +
            "                  <ul class=\"list-inline list-unstyled\" style=\"padding: 5px 0px 5px 25px;\">\n" +
            "                      <li class=\"list-inline-item\"><span><i class=\"glyphicon glyphicon-calendar\"><b>Date: </b></i>"+story.dateposted.substring(0,10)+ " | "+"<i><b>Time: </b></i> " + story.dateposted.substring(11,16)+"</span></li>\n" +
            "                      <form id=\“xForm\" onsubmit=\"onSubmit('/MyStories/deleteStory/"+ story.story_id +"')\">\n" +
            "                           <input class=\"btn btn-danger btn-md float-right\" style=\"margin-left:5px;\" type=\"submit\" name=\"delete\" value='Delete Story' onClick=\"return confirm('Are you sure you want to delete this story?')\" />\n" +
            "                      </form>\n" +
            "                      <form method=\"get\" action=\"/MyStories/editStory/"+story.story_id+"\">\n" +
            "                          <input class=\"btn btn-warning btn-md float-right\" style=\"margin-left:5px;\" type=\"submit\" name=\"edit\" value='Edit Story'/>\n" +
            "                      </form>\n" +
            "                            <button type='button' class=\"btn btn-primary\" data-toggle=\"modal\" data-target=\"#model-" + story.story_id+  "\">\n" +
            "                                View Images\n" +
            "                            </button>"+
            "                  </ul>\n" +
            "              </div>\n" +
            "\n" +
            "          </div>\n"+
            "<!-- Modal -->\n" +
            "            <div class=\"modal fade\" id=\"model-"+ story.story_id +"\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"model-"+ story.story_id +"\" aria-hidden=\"true\">\n" +
            "                <div class=\"modal-dialog modal-dialog-centered modal-lg\" role=\"document\">\n" +
            "                    <div class=\"modal-content\">\n" +
            "                        <div class=\"modal-header\">\n" +
            "                            <h5 class=\"modal-title\" >Images - "+ story.storyname+ "</h5>\n" +
            "                            <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n" +
            "                                <span aria-hidden=\"true\">&times;</span>\n" +
            "                            </button>\n" +
            "                        </div>\n"+
            "                        <div class=\"modal-body\" id=\"model-body\">\n";

        if(story.img != "") {
            story.img.forEach(function (img) {
                cardhtml += "<img src=\"/index/images/" + img + "\" class=\"eventImg\" style=\"padding-right: 4px\">"
            });
        }

        cardhtml += "                        </div>\n" +
            "                        <div class=\"modal-footer\">\n" +
            "                            <button type=\"button\" class=\"btn btn-primary\" data-dismiss=\"modal\">Close</button>\n" +
            "                        </div>\n" +
            "                    </div>\n" +
            "                </div>\n" +
            "            </div>"

        card.innerHTML = cardhtml
    });
}

/**
 * method to search events within indexedDB
 */
function searchEvent() {
    storyOrEvent = document.getElementById('searchName').value;
    console.log(storyOrEvent);
    dateInfo = document.getElementById('searchDatepicker').value;
    selectedOption = document.getElementById('optionSelect').value;
    if (selectedOption == "Event") {
        //Search for events
        retrieveSelectedEvents(storyOrEvent, dateInfo);
    } else{
        retrieveSelectedStories(storyOrEvent, dateInfo); //Search for stories
    }
}

/**
 * method to search My events within indexedDB
 */
function searchMYEvent() {
    storyOrEvent = document.getElementById('searchName').value;
    dateInfo = document.getElementById('searchDatepicker').value;
    retrieveSelectedMYEvents(storyOrEvent, dateInfo);
}

/**
 * method to search My Story within indexedDB
 */
function searchMYStory() {
    storyOrEvent = document.getElementById('searchName').value;
    dateInfo = document.getElementById('searchDatepicker').value;
    retrieveSelectedMYStories(storyOrEvent, dateInfo);
}

/**
 * method to view all of the stories associated with an event
 * @param event_name the name of the event to get the stories of
 */
function storyView(event_name) {
    relatedStories(event_name);
}

/**
 * When the client gets off-line, it shows an off line warning to the user
 * so that it is clear that the data is stale
 */
window.addEventListener('offline', function(e) {
    // Queue up events for server.
    console.log("You are offline");
    showOfflineWarning();
}, false);

/**
 * When the client gets online, it hides the off line warning
 */
window.addEventListener('online', function(e) {
    // Resync data with server.
    console.log("You are online");
    hideOfflineWarning();
    // loadDataEvent();
}, false);

/**
 * show an offline message
 */
function showOfflineWarning(){
    if (document.getElementById('offline_div')!=null)
        document.getElementById('offline_div').style.display='block';
}

/**
 * show an online message
 */
function hideOfflineWarning(){
    if (document.getElementById('offline_div')!=null)
        document.getElementById('offline_div').style.display='none';
}

//get all the data from the /index/json routes
function getEvents() {
    fetch('/index/json')
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data)
        })
        .catch(err => {
        })
}

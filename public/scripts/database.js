////////////////// DATABASE //////////////////
// the database receives from the server the following structure
/** class event{
 *  NOTE! the database is implemented with indexedDB meaning that it is non-blocking.
 */

var dbPromise;

const APP_DB_NAME = 'app_db';
const EVENT_OBJECT_STORE = 'store_events';
const STORY_OBJECT_STORE = 'store_stories';

/**
 * it inits the database
 */
function initDatabase() {

    //check for support
    if (!('indexedDB' in window)) {
        alert('This browser doesn\'t support IndexedDB');
        return;
    }

    //create the event object store
    dbPromise = idb.openDb(APP_DB_NAME, 1, function (upgradeDb) {
        if (!upgradeDb.objectStoreNames.contains(EVENT_OBJECT_STORE)) {
            var eventOS = upgradeDb.createObjectStore(EVENT_OBJECT_STORE, {keyPath: 'event_id'});
            eventOS.createIndex('username', 'username', {unique: false});
            eventOS.createIndex('firstname', 'firstname', {unique: false});
            eventOS.createIndex('surname', 'surname', {unique: false});
            eventOS.createIndex('eventname', 'eventname', {unique: false});
            eventOS.createIndex('startdate', 'startdate', {unique: false});
            eventOS.createIndex('enddate', 'enddate', {unique: false});
            eventOS.createIndex('description', 'description', {unique: false});
            eventOS.createIndex('img', 'img', {unique: false});
            eventOS.createIndex('location', 'location', {unique: false});
            eventOS.createIndex('city', 'city', {unique: false});
            eventOS.createIndex('postcode', 'postcode', {unique: false});
        }

        //create the story object store
        if (!upgradeDb.objectStoreNames.contains(STORY_OBJECT_STORE)) {
            var storyOS = upgradeDb.createObjectStore(STORY_OBJECT_STORE, {keyPath: 'story_id', autoIncrement: true});
            storyOS.createIndex('storyname', 'storyname', {unique: false});
            storyOS.createIndex('username', 'username', {unique: false});
            storyOS.createIndex('event_id', 'event_id', {unique: false});
            storyOS.createIndex('eventname', 'eventname', {unique: false});
            storyOS.createIndex('firstname', 'firstname', {unique: false});
            storyOS.createIndex('surname', 'surname', {unique: false});
            storyOS.createIndex('img', 'img', {unique: false});
            storyOS.createIndex('description', 'description', {unique: false});
            storyOS.createIndex('latitude', 'latitude', {unique: false});
            storyOS.createIndex('longitude', 'longitude', {unique: false});
            storyOS.createIndex('dateposted', 'dateposted', {unique: false});
        }
    });
}

/**
 * clears the indexedDb object store for event data
 */
function clearEvent() {
    dbPromise.then(function (db) {
        var tx = db.transaction(EVENT_OBJECT_STORE, 'readwrite');
        var eventOS = tx.objectStore(EVENT_OBJECT_STORE);
        return eventOS.clear();
    }).then(function (events) {
        console.log("cleared object data");
    });
}

/**
 * clears the indexedDb object store for story data
 */
function clearStory() {
    dbPromise.then(function (db) {
        var tx = db.transaction(STORY_OBJECT_STORE, 'readwrite');
        var storeOS = tx.objectStore(STORY_OBJECT_STORE);
        return storeOS.clear();
    }).then(function (events) {
        console.log("cleared story data");
    });
}

/**
 * retrieves all of the event data from indexedDb
 */
function retrieveAllEvents() {
    dbPromise.then(function (db) {
        var tx = db.transaction(EVENT_OBJECT_STORE, 'readonly');
        var eventOS = tx.objectStore(EVENT_OBJECT_STORE);
        return eventOS.getAll();
    }).then(function (events) {
        displayEvents(events);
    });
}

/**
 * retrieves all of the event data from indexedDb that corresponds to the current logged in user that created it
 */
function retrieveEventbyUser(username) {
    narray = [];
    dbPromise.then(function (db) {
        var tx = db.transaction(EVENT_OBJECT_STORE, 'readonly');
        var eventOS = tx.objectStore(EVENT_OBJECT_STORE);
        var index = eventOS.index('username');
        return index.openCursor(username);
    }).then(function selectedEvent(cursor) {
        if (!cursor) {
            return;
        }
        narray.push(cursor.value);
        return cursor.continue().then(selectedEvent);
    }).then(function () {
        console.log('Done cursoring');
        console.log(narray);
        //displays the events on the webpage
        displayMyEvents(narray);
    });
}

/**
 * retrieves all of the story data from indexedDb that corresponds to the current logged in user that created it
 */
function retrieveStoriesByUser(username) {
    console.log("Users Stories");
    narray = [];
    console.log(username);
    dbPromise.then(function (db) {
        var tx = db.transaction(STORY_OBJECT_STORE, 'readonly');
        var storyOS = tx.objectStore(STORY_OBJECT_STORE);
        var index = storyOS.index('username');
        return index.openCursor(username);
    }).then(function selectStory(cursor) {
        if (!cursor) {
            return;
        }
        narray.push(cursor.value);
        return cursor.continue().then(selectStory);
    }).then(function () {
        console.log('Done cursoring');
        console.log(narray);
        //displays the story data on the webpage
        displayMyStories(narray);
    });
}

/**
 * retrieves all of the event data from indexedDb that match the search query
 */
function retrieveSelectedEvents(storyOrEvent, dateInfo) {
    narray = [];
    // var checker = 0;
    var lower = "1000-01-01T00:00";
    var range;
    console.log(dateInfo);
    if (dateInfo !== '') {
        range = IDBKeyRange.bound(lower, dateInfo);
    } else {
        range = 0;
    }
    console.log(range);
    dbPromise.then(function (db) {
        var tx = db.transaction(EVENT_OBJECT_STORE, 'readonly');
        var eventOS = tx.objectStore(EVENT_OBJECT_STORE);
        var index = eventOS.index('eventname');
        return index.openCursor(storyOrEvent);
    }).then(function selectedEvent(cursor) {
        if (!cursor) {
            return;
        }
        narray.push(cursor.value);
    }).then(function () {
        console.log('Done cursoring');
        //filters by name first
        // displayEvents(narray);
    });

    //Filters by date
    dbPromise.then(function (db) {
        var tx = db.transaction(EVENT_OBJECT_STORE, 'readonly');
        var eventOS = tx.objectStore(EVENT_OBJECT_STORE);
        var dateselect = eventOS.index('startdate');
        return dateselect.openCursor(range);
    }).then(function showRange(cursor) {
        if (!cursor) {
            return;
        }
        narray.push(cursor.value);
        return cursor.continue().then(showRange);
    }).then(function () {
        console.log('Done cursoring');
        var narray2 = arrUnique(narray);
        displayEvents(narray2);
    });

}

//For removing duplicate events written in json format
function arrUnique(arr) {
    var cleaned = [];
    arr.forEach(function(itm) {
        var unique = true;
        cleaned.forEach(function(itm2) {
            if (JSON.stringify(itm) == JSON.stringify(itm2)) {
                unique = false;
            }
        });
        if (unique)  cleaned.push(itm);
    });
    return cleaned;
}

function retrieveSelectedMYEvents(storyOrEvent, dateInfo) {
    narray = [];
    var lower = "1000-01-01T00:00";
    var range;
    console.log(dateInfo);
    if (dateInfo !== '') {
        range = IDBKeyRange.bound(lower, dateInfo);
    } else {
        range = 0;
    }
    console.log(range);
    dbPromise.then(function (db) {
        var tx = db.transaction(EVENT_OBJECT_STORE, 'readonly');
        var eventOS = tx.objectStore(EVENT_OBJECT_STORE);
        var index = eventOS.index('eventname');
        return index.openCursor(storyOrEvent);
    }).then(function selectedEvent(cursor) {
        if (!cursor) {
            return;
        }
        narray.push(cursor.value);
    }).then(function () {
        console.log('Done cursoring');
        //displays the events on the webpage
        // displayMyEvents(narray);
    });

    dbPromise.then(function (db) {
        var tx = db.transaction(EVENT_OBJECT_STORE, 'readonly');
        var eventOS = tx.objectStore(EVENT_OBJECT_STORE);
        var dateselect = eventOS.index('startdate');
        return dateselect.openCursor(range);
    }).then(function showRange(cursor) {
        if (!cursor) {
            return;
        }
        narray.push(cursor.value);
        return cursor.continue().then(showRange);
    }).then(function () {
        console.log('Done cursoring');
        //displays the events on the webpage
        var narray2 = arrUnique(narray);
        displayEvents(narray2);
    });

}

/**
 * retrieves all of the story data from indexedDb that match the search query
 */
function retrieveSelectedStories(storyOrEvent, dateInfo) {
    narray = [];
    dbPromise.then(function (db) {
        var tx = db.transaction(STORY_OBJECT_STORE, 'readonly');
        var storyOS = tx.objectStore(STORY_OBJECT_STORE);
        var index = storyOS.index('storyname');
        return index.openCursor(storyOrEvent);
    }).then(function selectedEvent(cursor) {
        if (!cursor) {
            return;
        }
        narray.push(cursor.value);
    }).then(function () {
        console.log('Done cursoring');
        // displayStories(narray);
    });

    dbPromise.then(function (db) {
        var tx = db.transaction(STORY_OBJECT_STORE, 'readonly');
        var eventOS = tx.objectStore(STORY_OBJECT_STORE);
        var dateselect = eventOS.index('dateposted');
        return dateselect.openCursor(dateInfo);
    }).then(function selectedStory(cursor) {
        if (!cursor) {
            return;
        }
        narray.push(cursor.value);
        return cursor.continue().then(selectedStory);
    }).then(function () {
        console.log('Done cursoring');
        displayStories(narray);
    });
    var narray2 = arrUnique(narray);
    displayEvents(narray2);
}

function retrieveSelectedMYStories(storyOrEvent, dateInfo) {
    narray = [];
    dbPromise.then(function (db) {
        var tx = db.transaction(STORY_OBJECT_STORE, 'readonly');
        var storyOS = tx.objectStore(STORY_OBJECT_STORE);
        var index = storyOS.index('storyname');
        return index.openCursor(storyOrEvent);
    }).then(function selectedEvent(cursor) {
        if (!cursor) {
            return;
        }
        narray.push(cursor.value);
    }).then(function () {
        console.log('Done cursoring');
        // displayMyStories(narray);
    });

    dbPromise.then(function (db) {
        var tx = db.transaction(STORY_OBJECT_STORE, 'readonly');
        var eventOS = tx.objectStore(STORY_OBJECT_STORE);
        var dateselect = eventOS.index('dateposted');
        return dateselect.openCursor(dateInfo);
    }).then(function selectedStory(cursor) {
        if (!cursor) {
            return;
        }
        narray.push(cursor.value);
        return cursor.continue().then(selectedStory);
    }).then(function () {
        console.log('Done cursoring');
        displayMyStories(narray);
    });
}

/**
 * retrieves all of the stories from indexedDb that are associated with the passed in event name parameter
 * @param event_name the name of an event
 */
function relatedStories(event_id) {
    console.log("relatedSTories");
    narray = [];
    dbPromise.then(function (db) {
        var tx = db.transaction(STORY_OBJECT_STORE, 'readonly');
        var storyOS = tx.objectStore(STORY_OBJECT_STORE);
        // var index = storyOS.index('eventname');
        // return index.openCursor(event_name);
        return storyOS.openCursor();
    }).then(function selectStory(cursor) {
        if (!cursor) {
            return;
        }
        if (cursor.value['event_id'] == event_id) {
            narray.push(cursor.value);
        }
        return cursor.continue().then(selectStory);
    }).then(function () {
        displayStories(narray);
    });
}

/**
 * method to add a JSON event object into indexedDB
 * @param event a JSON object containing the details of the new event
 */
function addEvent(event) {
    dbPromise.then(function (db) {
        var tx = db.transaction(EVENT_OBJECT_STORE, 'readwrite');
        var eventOS = tx.objectStore(EVENT_OBJECT_STORE);
        eventOS.add(event);
        return tx.complete;
    });
}

/**
 * method to add a JSON event object into indexedDB containing multiple events
 * @param event a JSON object containing the details of the new event
 */
function addEvents(events) {
    dbPromise.then(function (db) {
        var tx = db.transaction(EVENT_OBJECT_STORE, 'readwrite');
        var eventOS = tx.objectStore(EVENT_OBJECT_STORE);
        events.forEach(function (event) {
            event.event_id = event._id;
            delete event.stories;
            delete event._id;
            eventOS.add(event);
        });
        return tx.complete;
    });
}

/**
 * method to edit an event within indexedDB given the event_id passed in
 * @param event_id the id of the event to edit
 */
function getEditEventFields(event_id) {
    dbPromise.then(function (db) {
        var tx = db.transaction(EVENT_OBJECT_STORE, 'readonly');
        var eventOS = tx.objectStore(EVENT_OBJECT_STORE);
        return eventOS.get(event_id);
    }).then(function (event) {
        updateEditEventFields(event);
    });
}

/**
 * update an event within indexedDb
 * @param newEvent object containing the updated event details
 */
function updateEvent(newEvent) {
    dbPromise.then(function (db) {
        var tx = db.transaction(EVENT_OBJECT_STORE, 'readwrite');
        var eventOS = tx.objectStore(EVENT_OBJECT_STORE);
        return eventOS.get(newEvent.event_id);
    }).then(function (event) {
        event.eventname = newEvent.eventname;
        event.startdate = newEvent.startdate;
        event.enddate = newEvent.enddate;
        event.description = newEvent.description;
        event.img = newEvent.img;
        event.eventname = newEvent.eventname;
        event.location = newEvent.location;
        event.city = newEvent.city;
        event.postcode = newEvent.postcode;

        dbPromise.then(function (db) {
            var tx = db.transaction(EVENT_OBJECT_STORE, 'readwrite');
            var eventOS = tx.objectStore(EVENT_OBJECT_STORE);
            eventOS.put(event);
            return tx.complete;
        });
    });
}

/**
 * method to remove an event within indexedDB given the event_id passed in
 * @param event_id the id of the event to remove
 */
function removeEvent(event_id) {
    dbPromise.then(function (db) {
        var tx = db.transaction(EVENT_OBJECT_STORE, 'readwrite');
        var eventOS = tx.objectStore(EVENT_OBJECT_STORE);
        eventOS.delete(event_id);
        return tx.complete;
    });
}

/**
 * method to add a story within indexedDB given the story JSON object
 * @param story JSON object containing the story details
 */
function addStory(story) {
    dbPromise.then(function (db) {
        var tx = db.transaction(STORY_OBJECT_STORE, 'readwrite');
        var storyOS = tx.objectStore(STORY_OBJECT_STORE);
        storyOS.add(story);
        return tx.complete;
    });
}

/**
 * method to add multiple stories within indexedDB given a story JSON object
 * @param stories JSON object containing the story data
 */
function addStories(stories) {
    dbPromise.then(function (db) {
        var tx = db.transaction(STORY_OBJECT_STORE, 'readwrite');
        var storyOS = tx.objectStore(STORY_OBJECT_STORE);
        stories.forEach(function (story) {
            story.event_id = story.event;
            delete story.event;

            story.story_id = story._id;
            delete story._id;

            storyOS.add(story);
        });
        return tx.complete;
    });
}

/**
 * method to remove a story within indexedDB given the event_id passed in
 * @param story_id the id of the story to remove
 */
function removeStory(story_id) {
    dbPromise.then(function (db) {
        var tx = db.transaction(STORY_OBJECT_STORE, 'readwrite');
        var storyOS = tx.objectStore(STORY_OBJECT_STORE);
        storyOS.delete(story_id);
        return tx.complete;
    });
}

/**
 * method to remove a retrieve all of the stories stored within indexedDB
 */
function retrieveAllStories() {
    dbPromise.then(function (db) {
        var tx = db.transaction(STORY_OBJECT_STORE, 'readonly');
        var storyOS = tx.objectStore(STORY_OBJECT_STORE);
        return storyOS.getAll();
    }).then(function (stories) {
        displayStories(stories);
    });
}



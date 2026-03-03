const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "database.json");

//creates database.json if it doesnt already exist, initializes with empty arrays
function initializeDb() {
  if (!fs.existsSync(dbPath)) {
    const initialData = {
      events: [],
      attendees: [],
    };
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
  }
}

//reads database.json, returns as object
function readDb() {
  const rawData = fs.readFileSync(dbPath);
  return JSON.parse(rawData);
}

//overwrites database.json with whatever its given
function writeDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

//returns array of all the events
function getAllEvents() {
  return readDb().events;
}

//same idea as above, returns array of all attendees
function getAllAttendees() {
  return readDb().attendees;
}

//adds an attendee to the db
function saveAttendee(attendee) {
  const db = readDb();
  db.attendees.push(attendee);
  writeDb(db);
}

//adds an event to the db
function saveEvent(event) {
  const db = readDb();
  db.events.push(event);
  writeDb(db);
}

module.exports = {
  initializeDb,
  getAllEvents,
  getAllAttendees,
  saveAttendee,
  saveEvent,
  readDb,
  writeDb,
};

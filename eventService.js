const {
  getAllEvents,
  saveEvent,
  getAllAttendees,
  saveAttendee,
} = require("./eventDb");

//validate email
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

//create new event
function createEvent({ id, name, date }) {
  if (!id || !name || !date) throw new TypeError("Invalid event data");

  const events = getAllEvents();
  if (events.find((e) => e.id === id))
    throw new Error("Event ID already exists in our system");

  const event = { id, name, date };
  saveEvent(event);
  return event;
}

//register new attendee
function registerAttendee(eventId, name, email) {
  if (!name || !email) throw new TypeError("Invalid attendee data");
  if (!isValidEmail(email)) throw new Error("Invalid email");

  const events = getAllEvents();
  const event = events.find((e) => e.id === eventId);
  if (!event) throw new Error("Event not found");

  const attendees = getAllAttendees();
  if (attendees.find((a) => a.eventId === eventId && a.email === email))
    throw new Error("Duplicate email");

  const attendee = { eventId, name, email, checkedIn: false };
  saveAttendee(attendee);
  return attendee;
}

//check in attendee
function checkInAttendee(eventId, email) {
  const db = require("./eventDb").readDb();
  const attendee = db.attendees.find(
    (a) => a.eventId === eventId && a.email === email,
  );

  if (!attendee) throw new Error("Attendee not registered");

  attendee.checkedIn = true;

  require("./eventDb").writeDb(db);

  return attendee;
}

//console report
function generateReport(eventId) {
  const events = getAllEvents();
  const attendees = getAllAttendees();

  const event = events.find((e) => e.id === eventId);
  if (!event) throw new Error("Event not found");

  const registered = attendees.filter((a) => a.eventId === eventId);
  const checkedIn = registered.filter((a) => a.checkedIn);

  //the actual report
  console.log("Attendance Report:");
  console.log(`Event: ${event.name}`);
  console.log(`Date: ${event.date}`);
  console.log(`Total Registrations: ${registered.length}`);
  console.log(`Total Check-In's: ${checkedIn.length}`);
  console.log("Checked-In Attendees:");
  checkedIn.forEach((a) => console.log(`- ${a.name} (${a.email})`));

  return {
    eventName: event.name,
    totalRegistered: registered.length,
    totalCheckedIn: checkedIn.length,
    checkInAttendees: checkedIn,
  };
}

module.exports = {
  createEvent,
  registerAttendee,
  checkInAttendee,
  generateReport,
};

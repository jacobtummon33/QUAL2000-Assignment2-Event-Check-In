//JACOB TUMMON
function createEventService(db) {
  const {
    getAllEvents,
    saveEvent,
    getAllAttendees,
    saveAttendee,
    readDb,
    writeDb,
  } = db;

  // validate email
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // create new event
  function createEvent({ id, name, date }) {
    if (!id || !name || !date) throw new TypeError("Invalid event data");

    const events = getAllEvents();
    if (events.find((e) => e.id === id))
      throw new Error("Event ID already exists in our system");

    const event = { id, name, date };
    saveEvent(event);
    return event;
  }

  // register new attendee
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

  // check in attendee
  function checkInAttendee(eventId, email) {
    const dbData = readDb();
    const attendee = dbData.attendees.find(
      (a) => a.eventId === eventId && a.email === email,
    );

    if (!attendee) throw new Error("Attendee not registered");

    attendee.checkedIn = true;
    writeDb(dbData);

    return attendee;
  }

  // console report
  function generateReport(eventId) {
    const events = getAllEvents();
    const attendees = getAllAttendees();

    const event = events.find((e) => e.id === eventId);
    if (!event) throw new Error("Event not found");

    const registered = attendees.filter((a) => a.eventId === eventId);
    const checkedIn = registered.filter((a) => a.checkedIn);

    return {
      eventName: event.name,
      totalRegistered: registered.length,
      totalCheckedIn: checkedIn.length,
      checkInAttendees: checkedIn,
    };
  }

  return {
    createEvent,
    registerAttendee,
    checkInAttendee,
    generateReport,
  };
}

module.exports = createEventService;

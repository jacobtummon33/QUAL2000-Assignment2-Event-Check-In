//JACOB TUMMON
const { initializeDb } = require("./eventDb");
const createEventService = require("./eventService");
const eventDb = require("./eventDb");

const { createEvent, registerAttendee, checkInAttendee, generateReport } =
  createEventService(eventDb);

function main() {
  initializeDb();
  try {
    const event = createEvent({
      id: "TEST1",
      name: "Sample Event 01",
      date: "2026-01-01",
    });
    console.log(`Created event: ${event.name} (${event.id})`);

    registerAttendee("TEST1", "Greg", "greg@example.com");
    registerAttendee("TEST1", "Jim", "jim@yup.com");
    console.log("Registered Greg & Jim");

    checkInAttendee("TEST1", "greg@example.com");
    console.log("Greg checked in");

    generateReport("TEST1");
  } catch (err) {
    console.error("Error:", err.message);
  }
}

main();

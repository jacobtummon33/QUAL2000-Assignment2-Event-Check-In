const { initializeDb } = require("./eventDb");
const {
  createEvent,
  registerAttendee,
  checkInAttendee,
  generateReport,
} = require("./eventService");

async function main() {
  // Initialize DB if missing
  initializeDb();
}
main();

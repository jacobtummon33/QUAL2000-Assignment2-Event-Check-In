//JACOB TUMMON
const test = require("node:test");
const assert = require("node:assert");

const eventDb = require("../../eventDb");
const createEventService = require("../../eventService");

const eventService = createEventService(eventDb);

test.beforeEach(() => [eventDb.writeDb({ events: [], attendees: [] })]);

test("Full event lifecycle properly working", () => {
  eventService.createEvent({
    id: "CONF1",
    name: "First Official Conference",
    date: "2026-01-01",
  });

  eventService.registerAttendee("CONF1", "Greg", "greg@gmail.com");
  eventService.checkInAttendee("CONF1", "greg@gmail.com");

  const report = eventService.generateReport("CONF1");

  assert.strictEqual(report.totalRegistered, 1);
  assert.strictEqual(report.totalCheckedIn, 1);
});

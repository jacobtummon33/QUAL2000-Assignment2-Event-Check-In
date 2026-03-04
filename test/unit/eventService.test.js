//JACOB TUMMON
const test = require("node:test");
const assert = require("node:assert");

const createEventService = require("../../eventService");

const fakeDb = {
  events: [],
  attendees: [],

  getAllEvents() {
    return fakeDb.events;
  },

  getAllAttendees() {
    return fakeDb.attendees;
  },

  saveEvent(event) {
    fakeDb.events.push(event);
  },

  saveAttendee(attendee) {
    fakeDb.attendees.push(attendee);
  },

  readDb() {
    return { events: fakeDb.events, attendees: fakeDb.attendees };
  },

  writeDb(data) {
    fakeDb.events = data.events;
    fakeDb.attendees = data.attendees;
  },
};

const eventService = createEventService(fakeDb);

test.beforeEach(() => {
  fakeDb.events = [];
  fakeDb.attendees = [];
});

// UNIT TESTS

test("Email validation rejects invalid email", () => {
  assert.throws(() =>
    eventService.registerAttendee("event1", "John", "bademail"),
  );
});

test("Duplicate ID event throws error", () => {
  fakeDb.events = [{ id: "event2", name: "Test", date: "2026-01-01" }];

  assert.throws(() =>
    eventService.createEvent({
      id: "event2",
      name: "Test2",
      date: "2026-01-02",
    }),
  );
});

test("Duplicate registration prevention", () => {
  fakeDb.events = [{ id: "event3", name: "Test", date: "2026-01-01" }];
  fakeDb.attendees = [
    { eventId: "event3", name: "Jim", email: "jim@test.com", checkedIn: false },
  ];

  assert.throws(() =>
    eventService.registerAttendee("event3", "Jim", "jim@test.com"),
  );
});

test("Check-In fails if not registered", () => {
  assert.throws(() =>
    eventService.checkInAttendee("event4", "invalid@test.com"),
  );
});

test("Report returns correct totals", () => {
  fakeDb.events = [{ id: "event5", name: "Test", date: "2026-01-01" }];
  fakeDb.attendees = [
    {
      eventId: "event5",
      name: "Greg",
      email: "greg@email.com",
      checkedIn: true,
    },
    {
      eventId: "event5",
      name: "Jay",
      email: "jay@email.com",
      checkedIn: false,
    },
  ];

  const report = eventService.generateReport("event5");

  assert.strictEqual(report.totalRegistered, 2);
  assert.strictEqual(report.totalCheckedIn, 1);
});

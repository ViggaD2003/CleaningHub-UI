import Dexie from "dexie";

const db = new Dexie("NotificationDB");
db.version(1).stores({
    notifications: "++id, bookingId, service, duration, createdDate, updatedDate, "+
    "startedAt, endAt, address, userEmail, staffEmail, isRead, role"
});

export default db;
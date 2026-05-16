// // backend/db.js
// import mysql from "mysql2/promise"; // use promise version

// const db = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "Root@123",
//   database: "social_media_profile",
//   waitForConnections: true,
//   connectionLimit: 10, // allows multiple queries at the same time
//   queueLimit: 0,
// });

// export default db;
import mysql from "mysql2/promise";

const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Root@123",
  database: "social_media_profile",
});

console.log("MySQL connected ✅");

export default db;

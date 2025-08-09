import "dotenv/config";
import "../src/db"; // importing runs migration; we'll wipe & reseed
import { db } from "../src/db";

db.exec(`DELETE FROM products; VACUUM;`);
console.log("DB cleared.");

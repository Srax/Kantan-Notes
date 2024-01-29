import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";

export default async function openDatabase(dbName: string) {
  try {
    // Check if the database file already exists
    const dbPath = FileSystem.documentDirectory + "SQLite/" + dbName;
    const exists = await FileSystem.getInfoAsync(dbPath);

    if (!exists.exists) {
      // Create the database file if it doesn't exist
      await FileSystem.writeAsStringAsync(dbPath, "", {
        encoding: FileSystem.EncodingType.UTF8,
      });
    }

    // Open the database connection
    const db = SQLite.openDatabase(dbName);
    return db;
  } catch (error) {
    console.error("Error opening database:", error);
    throw error;
  }
}

import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";
import { Asset } from "expo-asset";

export default async function openDatabase(
  pathToDatabaseFile: string
): Promise<SQLite.Database> {
  if (
    !(await FileSystem.getInfoAsync(FileSystem.documentDirectory + "SQLite"))
      .exists
  ) {
    await FileSystem.makeDirectoryAsync(
      FileSystem.documentDirectory + "SQLite"
    );
  }
  await FileSystem.downloadAsync(
    Asset.fromModule(pathToDatabaseFile).uri,
    FileSystem.documentDirectory + "SQLite/myDatabaseName.db"
  );
  return SQLite.openDatabase("myDatabaseName.db");
}

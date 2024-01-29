import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("notes.db"); // Open or create a database

export class Note {
  id: number;
  title: string;
  text: string;

  constructor(id: number, title: string, text: string) {
    this.id = id;
    this.title = title;
    this.text = text;
  }
}

const initializeDatabase = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    db.transaction((tx) => {
      // Create notes table if it doesn't exist
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, text TEXT NOT NULL)",
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

// Create
const createNote = (note: Note): Promise<number> => {
  return new Promise<number>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO notes (title, text) VALUES (?, ?)",
        [note.title, note.text],
        (_, { insertId }) => {
          resolve(insertId);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

const getAllNotes = (): Promise<Note[]> => {
  return new Promise<Note[]>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM notes",
        [],
        (_, { rows }) => {
          const notes: Note[] =
            rows.length > 0
              ? rows._array.map(
                  (item: { id: number; title: string; text: string }) =>
                    new Note(item.id, item.title, item.text)
                )
              : [];
          resolve(notes);
        },
        (_, error: any) => {
          reject(error);
        }
      );
    });
  });
};

// Read One
const getNoteById = (noteId: number): Promise<Note | null> => {
  return new Promise<Note | null>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM notes WHERE id = ?",
        [noteId],
        (_, { rows }) => {
          if (rows.length > 0) {
            const item = rows.item(0);
            const note = new Note(item.id, item.title, item.text);
            resolve(note);
          } else {
            resolve(null);
          }
        },
        (_, error: any) => {
          reject(error);
        }
      );
    });
  });
};

// Update
const updateNote = (note: Note): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE notes SET title = ?, text = ? WHERE id = ?",
        [note.title, note.text, note.id],
        (_, result) => {
          if (result.rowsAffected > 0) {
            resolve();
          } else {
            reject(new Error("Note not found"));
          }
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

// Delete
const deleteNote = (noteId: number): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM notes WHERE id = ?",
        [noteId],
        (_, result) => {
          if (result.rowsAffected > 0) {
            resolve();
          } else {
            reject(new Error("Note not found"));
          }
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

const purgeDatabase = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM notes",
        [],
        (_, result) => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

const noteController = {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
  initializeDatabase,
  purgeDatabase,
};

export default noteController;

import * as SQLite from "expo-sqlite";
import RichNote from "../types/Note.type";
const db = SQLite.openDatabase("notes.db"); // Open or create a database

const initializeDatabase = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    db.transaction((tx) => {
      // Create notes table if it doesn't exist
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL, css TEXT NOT NULL, createdAt INTEGER NOT NULL, updatedAt INTEGER NOT NULL)",
        [],
        () => {
          resolve();
        },
        (_, error): any => {
          reject(error);
        }
      );
    });
  });
};

// Create
const createNote = async (note: RichNote): Promise<number> => {
  const currentTime = Date.now();
  return new Promise<number>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO notes (content, css, createdAt, updatedAt) VALUES (?, ?, ?, ?)",
        [
          encodeURIComponent(note.getContent()),
          encodeURIComponent(note.getCss()),
          currentTime,
          currentTime,
        ],
        (_, { insertId }) => {
          return resolve(insertId);
        },
        (_, error): any => {
          reject(error);
        }
      );
    });
  });
};

const getAllNotes = (): Promise<RichNote[]> => {
  return new Promise<RichNote[]>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM notes",
        [],
        (_, { rows }) => {
          const notes: RichNote[] =
            rows.length > 0
              ? rows._array.map(
                  (item: {
                    id: number;
                    content: string;
                    css: string;
                    createdAt: number;
                    updatedAt: number;
                  }) =>
                    new RichNote(
                      item.id,
                      decodeURIComponent(item.content),
                      decodeURIComponent(item.css),
                      item.createdAt,
                      item.updatedAt
                    )
                )
              : [];
          resolve(notes);
        },
        (_, error): any => {
          reject(error);
        }
      );
    });
  });
};

// Read One
const getNoteById = (noteId: number): Promise<RichNote | null> => {
  return new Promise<RichNote | null>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM notes WHERE id = ?",
        [noteId],
        (_, { rows }) => {
          if (rows.length > 0) {
            const item = rows.item(0);
            const note = new RichNote(
              item.id,
              decodeURIComponent(item.content),
              decodeURIComponent(item.css),
              item.createdAt,
              item.updatedAt
            );
            resolve(note);
          } else {
            resolve(null);
          }
        },
        (_, error): any => {
          reject(error);
        }
      );
    });
  });
};

// Update
const updateNote = (note: RichNote): Promise<void> => {
  const currentTime = Date.now();
  return new Promise<void>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE notes SET content = ?, css = ? , updatedAt = ? WHERE id = ?",
        [
          encodeURIComponent(note.getContent()),
          encodeURIComponent(note.getCss()),
          currentTime,
          note.getId(),
        ],
        (_, result) => {
          if (result.rowsAffected > 0) {
            resolve();
          } else {
            reject(new Error("Note not found"));
          }
        },
        (_, error): any => {
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
        (_, error): any => {
          reject(error);
        }
      );
    });
  });
};

const recordExists = (noteId: number): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM notes WHERE id = ?",
        [noteId],
        (_, { rows }) => {
          if (rows.length > 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        (_, error): any => {
          reject(error);
        }
      );
    });
  });
};

// const purgeDatabase = (): Promise<void> => {
//   return new Promise<void>((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "DELETE FROM notes",
//         [],
//         (_, result) => {
//           resolve();
//         },
//         (_, error) => {
//           reject(error);
//         }
//       );
//     });
//   });
// };

// const encryptNoteData = async (note: Note): Promise<Note> => {
//   const encryptedTitle = await Cipher.encryptData(note.getTitle());
//   const encryptedText = await Cipher.encryptData(note.getText());

//   if (!encryptedText) {
//     throw new Error("Failed to encrypt text");
//   }
//   if (!encryptedTitle) {
//     throw new Error("Failed to encrypt title");
//   }

//   // Create a new Note object with the encrypted title and text
//   const encryptedNote = new Note(
//     note.getId(),
//     encryptedTitle as string,
//     encryptedText as string,
//     note.getCreatedAt(),
//     note.getUpdatedAt()
//   );

//   return encryptedNote;
// };

// const decryptNoteData = async (note: Note): Promise<Note> => {
//   const decryptedTitle = await Cipher.decryptData(note.getTitle());
//   const decryptedText = await Cipher.decryptData(note.getText());

//   // Create a new Note object with the decrypted title and text
//   const decryptedNote = new Note(
//     note.getId(),
//     decryptedTitle as string,
//     decryptedText as string,
//     note.getCreatedAt(),
//     note.getUpdatedAt()
//   );

//   return decryptedNote;
// };

// const encryptNotesData = async (notes: Note[]): Promise<Note[]> => {
//   try {
//     const encryptedNotes = await Promise.all(
//       notes.map(async (note) => {
//         return await encryptNoteData(note);
//       })
//     );
//     return encryptedNotes;
//   } catch (error) {
//     console.error("Error encrypting notes:", error);
//     throw error;
//   }
// };

// const decryptNotesData = async (encryptedNotes: Note[]): Promise<Note[]> => {
//   try {
//     const decryptedNotes = await Promise.all(
//       encryptedNotes.map(async (encryptedNote) => {
//         return await decryptNoteData(encryptedNote);
//       })
//     );
//     return decryptedNotes;
//   } catch (error) {
//     console.error("Error decrypting notes:", error);
//     throw error;
//   }
// };

const richNoteController = {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
  initializeDatabase,
  //   purgeDatabase,
  recordExists,
};

export default richNoteController;

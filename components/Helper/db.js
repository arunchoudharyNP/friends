import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("chats.db");

const init = (dbName) => {
  console.log(dbName)
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `create table if not exists ${dbName.replace(/\s/g, "")} (id TEXT NOT NULL UNIQUE, createdAt Text NOT NULL,text TEXT NOT NULL, userId TEXT NOT NULL , userName TEXT NOT NULL)`,
        [],
        () => {
          resolve();
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });

  return promise;
};

export const insertMessage = (
  id,
  createdAt,
  text,
  userId,
  userName,
  dbName
) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `insert into ${dbName} (id,createdAt ,text,userId,userName)  values(?,?,?,?,?)`,
        [id, createdAt, text, userId, userName],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          console.log(err);
          reject(err);
        }
      );
    });
  });

  console.log(JSON.stringify(promise));

  return promise;
};

export const fetchMessages = (dbName) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from ${dbName}`,
        [],
        (_, result) => {
          resolve(result);
        },
        (_, err) => {
          reject(err);
        }
      );
    });
  });

  return promise;
};

export default init;

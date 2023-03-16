const connect = require('@databases/sqlite');
const {sql} = require('@databases/sqlite');
// We don't pass a file name here because we don't want to store
// anything on disk
const db = connect();

async function prepare() {
    await db.query(sql`
    CREATE TABLE users (
      username VARCHAR NOT NULL UNIQUE,
      _id VARCHAR NOT NULL PRIMARY KEY
    );
  `);

    await db.query(sql`
    CREATE TABLE exercises (
      description VARCHAR NOT NULL,
      duration INT NOT NULL,
      date VARCHAR NOT NULL,
      _id VARCHAR NOT NULL,
      FOREIGN KEY(_id) REFERENCES users(_id)
    );
  `);
}

const prepared = prepare();

exports.createUser = async function ({username}) {
    await prepared;
    let _id = Math.floor(Math.random() * 100000).toString() + Date.now().toString();

    await db.query(sql`
    INSERT INTO users (username, _id)
      VALUES (${username}, ${_id})
      ON CONFLICT (username) DO NOTHING;;
  `);

    const user = await db.query(sql`
    SELECT * FROM users WHERE username=${username};
  `);

    if (user.length) {
        _id = user[0]._id;
        username = user[0].username;
    } else {
        return undefined;
    }

    // console.log({username, _id})

    return {username, _id};
}

exports.getAll = async function () {
    await prepared;

    const users = await db.query(sql`
    SELECT username, _id FROM users;
  `);

    return users;
}

exports.setExercise = async function({_id, description, duration, date}) {
    await prepared;

    const exerciseWithUsername = {};

    await db.query(sql`
    INSERT INTO exercises (_id, description, duration, date)
      VALUES (${_id}, ${description}, ${duration}, ${date});
  `);

    const user = await db.query(sql`
    SELECT * FROM users WHERE _id=${_id};
  `);

    if (user.length) {
        exerciseWithUsername.username = user[0].username;
    } else {
        return undefined;
    }

    const exercise = await db.query(sql`
    SELECT * FROM exercises 
        WHERE _id=${_id} 
        AND description=${description}
        AND description=${description}
        AND date=${date};
  `);

    if (exercise.length) {
        return {
            ...exerciseWithUsername,
            ...exercise[0]
        }
    } else {
        return undefined;
    }
}

exports.getAllExercise = async function({_id}) {
    await prepared;

    const exercises = await db.query(sql`
    SELECT * FROM exercises;
  `);

    return exercises;
}
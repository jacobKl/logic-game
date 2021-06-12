class Database {
  constructor(collection) {
    this.collection = collection;
  }

  dbInsert(record) {
    this.collection.insert(record, (err, inDb) => {
      console.log("==SUCCESSFULLY ADDED RECORD==");
      console.log(inDb);
    });
  }

  getAllGames() {
    return new Promise((resolve, reject) => {
      this.collection.find({}, (err, docs) => {
        console.log("==RETURNING LIST OF GAMES==");
        resolve(docs);
      });
    });
  }

  getFreeId() {
    return new Promise((resolve, reject) => {
      this.collection.count({}, (err, docs) => {
        console.log("==RECORDS COUNT==");
        resolve(docs);
      });
    });
  }
}

module.exports = {
  Database,
};

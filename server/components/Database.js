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
    return this.collection.find({}, (err, docs) => {
      console.log("==RETURNING LIST OF GAMES==");
    });
  }
}

module.exports = {
  Database,
};

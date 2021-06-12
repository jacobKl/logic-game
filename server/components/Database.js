class Database {
  constructor(collection) {
    this.collection = collection;
  }

  dbInsert(record) {
    this.collection.insert(record, (err, inDb) => {
      console.log(inDb);
    });
  }

  getAllGames() {
    return new Promise((resolve, reject) => {
      this.collection.find({}, (err, docs) => {
        resolve(docs);
      });
    });
  }

  getFreeId() {
    return new Promise((resolve, reject) => {
      this.collection.count({}, (err, docs) => {
        resolve(docs);
      });
    });
  }

  getGameById(gameId) {
    return new Promise((resolve, reject) => {
      this.collection.findOne({ id: parseInt(gameId) }, (err, doc) => {
        resolve(doc);
      });
    });
  }
}

module.exports = {
  Database,
};

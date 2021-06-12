function saveToDb(io, data) {
  DB.dbInsert(data);
}

module.exports = {
  saveToDb,
};
